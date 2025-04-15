
// OneSignal initialization script
window.OneSignalDeferred = window.OneSignalDeferred || [];

console.log("🔔 OneSignal initialization script loaded");

window.addEventListener('load', function() {
  console.log("🔔 Page loaded, initializing OneSignal...");
  
  OneSignalDeferred.push(async function(OneSignal) {
    try {
      console.log("🔔 Initializing OneSignal SDK version", OneSignal.getVersion && OneSignal.getVersion());
      
      // Activate logging for debugging
      if (OneSignal.Debug && OneSignal.Debug.setLogLevel) {
        console.log("🛠️ Setting log level: trace");
        OneSignal.Debug.setLogLevel("trace");
      }

      // Check if push notifications are supported before initialization
      const isPushSupported = await OneSignal.isPushNotificationsSupported();
      console.log("🔔 Push notifications supported:", isPushSupported ? "YES" : "NO");
      
      if (!isPushSupported) {
        console.warn("⚠️ This browser doesn't support push notifications!");
        return;
      }

      // Initialize OneSignal
      await OneSignal.init({
        appId: "35af33cb-8ab8-4d90-b789-17fb5c45542b",
        allowLocalhostAsSecureOrigin: true,
        safari_web_id: "web.onesignal.auto.26e1efd4-c84b-4c22-b1a1-c9b7ff58fd07",
        notifyButton: {
          enable: false, // Don't show the built-in notification button
        },
        disableGoogleAnalytics: true, // Disable Google Analytics
        serviceWorkerParam: { scope: "/" },
        serviceWorkerPath: "/sw.js",
        promptOptions: {
          slidedown: {
            prompts: [
              {
                type: "push",
                autoPrompt: false, // Do not show automatically
                text: {
                  actionMessage: "Искате ли да получавате известия за нови сигнали?",
                  acceptButton: "Разреши",
                  cancelButton: "По-късно"
                }
              }
            ]
          }
        }
      });
      
      console.log("✅ OneSignal initialized with version:", OneSignal.getVersion && OneSignal.getVersion());
      
      // Check current subscription status
      const isPushEnabled = await OneSignal.User.PushSubscription.optedIn;
      console.log("🔔 Current subscription status:", isPushEnabled ? "subscribed" : "not subscribed");
      
      // Get player ID if user is subscribed
      if (isPushEnabled) {
        const playerId = await OneSignal.User.PushSubscription.id;
        console.log("🆔 OneSignal Player ID:", playerId || "none");
        
        if (playerId) {
          // Important: This ensures the subscriber is recorded in the database
          // immediately after loading, if already subscribed
          try {
            if (window.supabase) {
              // Get user ID, if logged in
              let userId = null;
              try {
                const { data } = await window.supabase.auth.getUser();
                userId = data?.user?.id || null;
              } catch (e) {
                console.error("❌ Error getting user:", e);
              }
              
              console.log("💾 Recording push subscriber on load:", { playerId, userId });
              
              const { error } = await window.supabase
                .from('push_subscribers')
                .upsert([{
                  user_id: userId,
                  player_id: playerId,
                  updated_at: new Date().toISOString()
                }], { onConflict: 'player_id' });
              
              if (error) {
                console.error("❌ Error recording push subscriber:", error);
              } else {
                console.log("✅ Push subscriber recorded successfully on load!");
              }
            }
          } catch (error) {
            console.error("❌ Error recording subscription on load:", error);
          }
        }
      }

      // Add listener for subscription changes
      OneSignal.User.PushSubscription.addEventListener('change', async (event) => {
        console.log("🔄 Change in push subscription", event);
        try {
          const isSubscribed = await OneSignal.User.PushSubscription.optedIn;
          const playerId = await OneSignal.User.PushSubscription.id;
          
          console.log(`🔔 New status: ${isSubscribed ? 'subscribed' : 'not subscribed'}, ID: ${playerId || 'none'}`);
          
          if (isSubscribed && playerId && window.supabase) {
            // Get user ID, if logged in
            let userId = null;
            try {
              const { data } = await window.supabase.auth.getUser();
              userId = data?.user?.id || null;
            } catch (e) {
              console.error("❌ Error getting user:", e);
            }
            
            const { error } = await window.supabase
              .from('push_subscribers')
              .upsert([{
                user_id: userId,
                player_id: playerId,
                updated_at: new Date().toISOString()
              }], { onConflict: 'player_id' });
            
            if (error) {
              console.error("❌ Error recording push subscriber:", error);
            } else {
              console.log("✅ Push subscriber recorded successfully after change!");
            }
          }
        } catch (error) {
          console.error("❌ Error processing subscription change:", error);
        }
      });
    } catch (error) {
      console.error("❌ Error initializing OneSignal:", error);
    }
  });
});
