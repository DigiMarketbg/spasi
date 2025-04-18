
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { title, message } = await req.json()

    console.log('Received notification request:', { title, message })

    if (!title || !message) {
      return new Response(
        JSON.stringify({ error: 'Both title and message are required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    const ONESIGNAL_APP_ID = "5e8423e4-9749-42ba-b564-f4dc70d93066"
    const ONESIGNAL_REST_API_KEY = Deno.env.get('ONESIGNAL_REST_API_KEY')

    if (!ONESIGNAL_REST_API_KEY) {
      console.error('OneSignal API key is not configured')
      return new Response(
        JSON.stringify({ error: 'OneSignal API key is not configured' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    console.log('Preparing OneSignal API request...')
    
    // Create OneSignal notification payload
    const notificationPayload = {
      app_id: ONESIGNAL_APP_ID,
      included_segments: ['Subscribed Users'],
      contents: { en: message },
      headings: { en: title },
      // Add a web button to direct users to the homepage
      web_buttons: [
        {
          id: "view-site",
          text: "Отвори сайта",
          url: "https://spasi.bg"
        }
      ]
    }
    
    console.log('OneSignal request payload:', JSON.stringify(notificationPayload))

    // Make request to OneSignal API
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notificationPayload)
    })

    const responseText = await response.text()
    console.log('OneSignal API raw response:', responseText)
    
    let result
    try {
      result = JSON.parse(responseText)
    } catch (e) {
      console.error('Error parsing OneSignal response:', e)
      return new Response(
        JSON.stringify({ 
          error: 'Error parsing OneSignal response', 
          details: responseText,
          statusCode: response.status 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }
    
    console.log('OneSignal API response:', result)

    if (!response.ok || result.errors) {
      return new Response(
        JSON.stringify({ 
          error: 'OneSignal API error', 
          details: result.errors || `HTTP status: ${response.status}`,
          statusCode: response.status 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true, result }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error sending notification:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
