
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.31.0';

// Read environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
const oneSignalAppId = Deno.env.get('ONESIGNAL_APP_ID') as string;
const oneSignalApiKey = Deno.env.get('ONESIGNAL_API_KEY') as string;

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      status: 204,
    });
  }

  // Only accept POST method
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  try {
    // Get user token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token and user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Check if user is admin
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    if (profileError || !profileData || !profileData.is_admin) {
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    // Get request body
    const { title, message, city, filterByCity, category, filterByCategory, url } = await req.json();
    
    if (!title || !message) {
      return new Response(JSON.stringify({ error: 'Title and message are required' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Query subscribers based on filters
    let query = supabase.from('push_subscribers').select('player_id');
    
    if (filterByCity && city) {
      query = query.eq('city', city);
    }
    
    if (filterByCategory && category) {
      query = query.contains('category', [category]);
    }
    
    const { data: subscribers, error: subscribersError } = await query;
    
    if (subscribersError) {
      throw subscribersError;
    }
    
    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({ 
        message: 'No subscribers match the criteria' 
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    // Extract player IDs
    const playerIds = subscribers.map(sub => sub.player_id);
    
    // Prepare notification payload
    const notificationPayload = {
      app_id: oneSignalAppId,
      headings: { "bg": title, "en": title },
      contents: { "bg": message, "en": message },
      include_player_ids: playerIds,
    };
    
    // Add URL if provided
    if (url) {
      notificationPayload.url = url;
    }
    
    // Send notification using OneSignal API
    const oneSignalResponse = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${oneSignalApiKey}`,
      },
      body: JSON.stringify(notificationPayload),
    });
    
    const oneSignalData = await oneSignalResponse.json();
    
    if (!oneSignalResponse.ok) {
      throw new Error(oneSignalData.errors?.[0] || 'OneSignal API error');
    }
    
    return new Response(JSON.stringify({
      success: true,
      recipients: playerIds.length,
      oneSignalResponse: oneSignalData,
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    
    return new Response(JSON.stringify({
      error: 'An error occurred',
      details: error.message
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
