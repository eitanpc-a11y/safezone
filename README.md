# 🛡️ SafeZone — מערכת הגנה לצוותי חירום

## מה זה SafeZone?
אפליקציית PWA לצוותי חירום ישראלים:
- משתמשים נרשמים עם שם, עיר, ומיקום GPS
- מקבלים התראה מיידית (Push Notification) כשמזוהה **צבע אדום** בעירם
- האדמין רואה מפה של כל הצוות בזמן אמת ויכול לשלוח ניסוי צופר

---

## קבצי הפרויקט

| קובץ | תפקיד |
|------|--------|
| `index.html` | אפליקציית המשתמש — הרשמה ודיווח מיקום |
| `admin.html` | פאנל אדמין — מפה + ניסוי צופר (מוגן בסיסמה) |
| `firebase-messaging-sw.js` | Service Worker של Firebase — מקבל התראות ברקע |
| `sw.js` | Service Worker גיבוי |
| `manifest.json` | הגדרות PWA |
| `firebase.json` | הגדרות Firebase Hosting |
| `functions/index.js` | Cloud Functions — בדיקת פיקוד העורף + שליחת התראות |

---

## הגדרות חשובות לשנות לפני העלייה

### 1. סיסמת האדמין (בתוך `admin.html`)
```javascript
const ADMIN_PASSWORD = "SafeZone2024!"; // ← שנה לסיסמה חזקה שלך
```

### 2. מפתח ה-API לפונקציית הניסוי
ב-`admin.html`:
```javascript
const ADMIN_SECRET_KEY = "safezone-admin-2024"; // ← שנה
```
ב-`functions/index.js` (בשורה של ADMIN_SECRET):
```javascript
const ADMIN_SECRET = process.env.ADMIN_SECRET || "safezone-admin-2024"; // ← שנה
```

### 3. VAPID Key ב-`index.html`
```javascript
vapidKey: "BIXCZU-c8gIaA5JScoc7-..." // ← הכנס את ה-VAPID Key שלך מ-Firebase Console
```
לקבל VAPID Key: Firebase Console → Project Settings → Cloud Messaging → Web Push certificates

---

## פריסה ל-Firebase

```bash
# התקן Firebase CLI אם עוד לא התקנת
npm install -g firebase-tools

# כניסה ל-Firebase
firebase login

# התקן dependencies לפונקציות
cd functions
npm install
cd ..

# פרוס הכל
firebase deploy
```

---

## תכונות שנוספו בגרסה המתוקנת (v2.0)

✅ **תיקון קריטי:** הוספת אימות (סיסמה) לפאנל האדמין  
✅ **תיקון קריטי:** טיפול נכון ב-API של פיקוד העורף (מערך + מחרוזת)  
✅ **תיקון:** CORS headers בפונקציית הניסוי  
✅ **תיקון:** הסרת tokens פגומים מה-DB אוטומטית  
✅ **שיפור:** כפתור "בטל רישום" — המשתמש יכול לצאת מהמערכת  
✅ **שיפור:** הודעות שגיאה ברורות אם הרשאות נדחו  
✅ **שיפור:** שמירת מצב ה-session ב-localStorage  
✅ **שיפור:** שליחה ב-batches של 500 (מגבלת Firebase)  
✅ **שיפור:** `firebase-messaging-sw.js` נקי ומסודר  
