
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

      // Initialize OneSignal with more debug options
      await OneSignal.init({
        appId: "35af33cb-8ab8-4d90-b789-17fb5c45542b", // Make sure this is your correct app ID
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
        },
        // Add user tags for better targeting - enabling this for better notification segmentation
        enableOnSession: true,
        // Enable verbose logging
        debugLevel: "trace"
      });
      
      console.log("✅ OneSignal initialized with version:", OneSignal.getVersion && OneSignal.getVersion());
      
      // Add Notifications API if not available
      if (!OneSignal.Notifications) {
        console.log("⚠️ Adding Notifications API to OneSignal");
        OneSignal.Notifications = {
          permission: false,
          
          sendSelfNotification: async (title, message, url, icon, data) => {
            try {
              console.log("📣 Sending self notification:", { title, message });
              
              // Check if user granted notification permission
              const state = await OneSignal.User.PushSubscription.optedIn;
              OneSignal.Notifications.permission = state;
              
              if (state) {
                if ('serviceWorker' in navigator && 'PushManager' in window) {
                  const sw = await navigator.serviceWorker.ready;
                  await sw.showNotification(title, {
                    body: message,
                    icon: icon,
                    data: { url, ...data }
                  });
                  return true;
                }
              } else {
                console.warn("⚠️ Notification permission not granted");
              }
            } catch (e) {
              console.error("❌ Error sending self notification:", e);
            }
            return false;
          },
          
          setDefaultUrl: (url) => {
            console.log("📝 Setting default notification URL:", url);
          },
          
          setDefaultTitle: (title) => {
            console.log("📝 Setting default notification title:", title);
          },
          
          isPushSupported: () => {
            return 'PushManager' in window;
          },
          
          requestPermission: async () => {
            try {
              if (Notification.permission !== "granted") {
                const permission = await Notification.requestPermission();
                return permission === "granted";
              }
              return true;
            } catch (e) {
              console.error("❌ Error requesting notification permission:", e);
              return false;
            }
          }
        };
      }
      
      // Verify initialization and app data
      console.log("📊 OneSignal initialization details:", {
        appId: "35af33cb-8ab8-4d90-b789-17fb5c45542b",
        initialized: OneSignal.initialized,
        serviceWorkerState: 'serviceWorker' in navigator ? 'active' : 'not active',
        userAgent: navigator.userAgent,
        pushSupported: await OneSignal.isPushNotificationsSupported(),
        notificationsAPI: !!OneSignal.Notifications
      });
      
      // Check current subscription status
      const isPushEnabled = await OneSignal.User.PushSubscription.optedIn;
      console.log("🔔 Current subscription status:", isPushEnabled ? "subscribed" : "not subscribed");
      
      // Get player ID if user is subscribed
      if (isPushEnabled) {
        const playerId = await OneSignal.User.PushSubscription.id;
        console.log("🆔 OneSignal Player ID:", playerId || "none");
        
        // Subscription debugging information
        console.log("📊 Detailed subscription info:", {
          optedIn: isPushEnabled,
          playerId: playerId,
          pushSubscription: OneSignal.User.PushSubscription
        });
        
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
          console.log("📊 Full subscription data:", OneSignal.User.PushSubscription);
          
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
