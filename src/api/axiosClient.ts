import axios from "axios";

// ---------- שמירת הטוקן ב־localStorage ----------
// ה־AuthContext ישתמש בפונקציות האלה (שמירה בהתחברות, מחיקה בהתנתקות).
const TOKEN_KEY = "moments_token";

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// ---------- מופע axios אחד לכל האפליקציה ----------
// הכתובת מגיעה מקובץ .env (VITE_API_URL). אחרי שינוי ב־.env צריך להפעיל מחדש את npm run dev.
export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// לפני שכל בקשה יוצאת: אם יש טוקן – מוסיפים "Authorization: Bearer <token>"
axiosClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// בקשות שבהן 401 הוא תשובה "רגילה" ולא סימן שהטוקן פג:
// - login: סיסמה שגויה מחזירה 401 – צריך להציג הודעה, לא לרענן את הדף
// - me: נקרא בעליית האפליקציה; ה־AuthContext מטפל בזה בעצמו (משתמש = לא מחובר)
const NO_REDIRECT_ON_401 = ["/auth/login", "/auth/me"];

// כשתשובה חוזרת עם שגיאה
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url: string = error.config?.url ?? "";

    if (status === 401 && !NO_REDIRECT_ON_401.some((path) => url.startsWith(path))) {
      // הטוקן פג או לא תקין → מנתקים ושולחים להתחברות
      tokenStorage.clear();
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    // ממשיכים "לזרוק" את השגיאה כדי שהמסך יוכל להציג אותה
    return Promise.reject(error);
  },
);
