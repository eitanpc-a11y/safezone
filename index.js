const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

// הפונקציה בודקת את פיקוד העורף כל דקה
exports.checkSafeZoneAlerts = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {
    try {
        // 1. קבלת נתוני אזעקות
        const response = await axios.get('https://api.cumta.co.il/alertsActive.json');
        const activeCities = response.data.cities; 

        if (!activeCities || activeCities.length === 0) {
            console.log("אין אזעקות פעילות כרגע.");
            return null;
        }

        console.log("זוהו אזעקות בערים:", activeCities);

        // 2. שליחה למשתמשים בערים הרלוונטיות
        for (const city of activeCities) {
            const tokensSnapshot = await admin.firestore().collection('tokens')
                .where('city', '==', city)
                .get();

            if (tokensSnapshot.empty) continue;

            const tokens = [];
            tokensSnapshot.forEach(doc => tokens.push(doc.id));

            const message = {
                notification: {
                    title: `⚠️ אזעקה ב${city}!`,
                    body: 'היכנס מיד למרחב מוגן ודווח על מצבך ב-SafeZone.',
                },
                data: {
                    url: 'https://eitanpc-a11y.github.io/index.html?alert=true'
                },
                tokens: tokens,
            };

            const responseMessaging = await admin.messaging().sendEachForMulticast(message);
            console.log(`נשלחו ${responseMessaging.successCount} התראות ל${city}`);
        }
    } catch (error) {
        console.error("שגיאה בהרצת הפונקציה:", error);
    }
    return null;
});
