# Moments – Client

צד הלקוח (React) של **Moments**: מערכת לסטודיו לצילום ילדים ומשפחה. יש בה אתר תדמית פתוח לכולם, אזור אישי שבו הלקוח עוקב אחרי הצילום שלו, וממשק ניהול לצלמת.

**הטכנולוגיות:** React 19 · TypeScript · Vite · React Router 7 · TanStack React Query · React Hook Form + Zod · Context API · Axios · Tailwind CSS

| | קישור |
|---|---|
| 🌐 האתר החי | https://moments-esti-hochman.onrender.com |
| 🔌 השרת (API) | https://moments-api-1vth.onrender.com · [Swagger](https://moments-api-1vth.onrender.com/api-docs) |
| 💻 קוד השרת | https://github.com/eh4138672-gif/Moments_Esti-Hochman_backend |

> ⏰ האתר והשרת רצים במסלול החינמי של Render. אחרי זמן בלי שימוש השרת "נרדם", והבקשה הראשונה יכולה לקחת עד דקה.

---

## משתמשי דמו

| תפקיד | אימייל | סיסמה | מה רואים |
|---|---|---|---|
| מנהלת | admin@moments.test | Admin1234! | ממשק הניהול: כל הפרויקטים, הוספה, עריכה, מחיקה |
| לקוחה | dana@moments.test | Dana1234! | האזור האישי: 2 פרויקטים |
| לקוח | yossi@moments.test | Yossi1234! | האזור האישי: פרויקט אחד |

המשתמשים נוצרים ב־Seed של השרת, רק בסביבת פיתוח (הרצה מקומית).
באתר החי יש מנהלת אחת עם סיסמה פרטית, ואפשר להירשם כלקוח חדש דרך דף ההרשמה.

---

## הרצה מקומית

**דרישות:** Node.js 20 ומעלה, והשרת (`moments-backend`) רץ על פורט 3000.

```bash
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:3000/api
npm run dev              # http://localhost:5173
```

| פקודה | מה עושה |
|---|---|
| `npm run dev` | שרת פיתוח עם רענון אוטומטי |
| `npm run build` | בדיקת TypeScript ובניית האתר לתיקייה `dist` |
| `npm run lint` | בדיקת ESLint |

---

## מה יש באתר

### אורח (בלי התחברות)
- **דף הבית** – Hero, 5 עבודות נבחרות מהגלריה, "איך זה עובד", שתי החבילות והסבר על האזור האישי.
- **גלריית עבודות** – טאבים לפי קטגוריה (נשמרים בכתובת), רשת Masonry ומונה תמונות.
- **חבילות** – שני כרטיסים עם "מה כלול" וטבלת השוואה.
- **התחברות / הרשמה** – טאבים, ולידציה בכל שדה, שגיאות מהשרת ליד השדה המתאים.

### לקוח
- **הפרויקטים שלי** – מונים וכרטיס לכל פרויקט עם סטטוס עבודה וסטטוס אלבום.
- **דף פרויקט** – פרטים, שני Stepper־ים של סטטוס ותמונות. פרויקט של לקוח אחר מציג "אין הרשאה" (השרת מחזיר 403).

### מנהלת
- **כל הפרויקטים** – 3 מונים, חיפוש (debounce של 300ms), 4 סינונים ומיון. הכול נשמר בכתובת, כך שרענון וכפתור "חזרה" עובדים.
- **עדכון סטטוס מהיר** – לחיצה על תגית בטבלה, בחירה, ושמירה (`PATCH`).
- **מחיקה** – עם חלון אישור.
- **טופס פרויקט** – טופס אחד להוספה ולעריכה. בחירת חבילה ממלאת את העלות, וחבילת בסיס נועלת את סטטוס האלבום על "ללא אלבום". "תצוגת הלקוח" מתעדכנת חי.

### בכל האתר
- מצב טעינה (Skeleton / ספינר), הודעת שגיאה עם "נסו שוב", ומצב ריק.
- הודעות הצלחה (Toast) אחרי שמירה, מחיקה ועדכון סטטוס.
- התאמה לטלפון: בממשק הניהול סרגל הצד הופך לתפריט ☰.

---

## מבנה התיקיות

```
src/
├─ api/          axiosClient + פונקציה לכל Endpoint (auth, projects, packages, gallery)
├─ hooks/        useAuth, useToast, ו־hooks של React Query: useProjects, useProject,
│                useMyProjects, usePackages, useGallery, useProjectMutations
├─ context/      AuthContext (מי מחובר), ToastContext (הודעות)
├─ components/
│   ├─ layout/   SiteLayout, AdminLayout, Navbar, Sidebar, Footer, Logo
│   ├─ ui/       Button, Pill, FormField, StatusBadge, StatusStepper, Loader,
│   │            ErrorMessage, EmptyState, ConfirmDialog, icons
│   ├─ auth/     LoginForm, RegisterForm
│   ├─ projects/ ProjectCard, ProjectsTable, ProjectFilters, ProjectForm
│   ├─ gallery/  CategoryTabs, GalleryGrid
│   └─ packages/ PackageCard, ComparisonTable
├─ pages/        public/ client/ admin/ NotFoundPage
├─ routes/       AppRouter (כל הנתיבים), ProtectedRoute (לפי תפקיד)
├─ schemas/      loginSchema, registerSchema, projectSchema (zod)
├─ types/        user, project, package, gallery, api
└─ utils/        statusLabels, statusColors, formatDate, formatPrice, apiError, applyServerErrors
```

## נתיבים

| נתיב | מי |
|---|---|
| `/` · `/gallery` · `/packages` | כולם |
| `/login` · `/register` | אורח (מחובר מועבר לדף שלו) |
| `/my-projects` · `/my-projects/:id` | לקוח |
| `/admin/projects` · `/admin/projects/new` · `/admin/projects/:id/edit` | מנהלת |
| `*` | דף 404 |

---

## איך המידע זורם

- **התחברות:** `AuthContext` שומר את הטוקן ב־`localStorage`, ובעליית האתר בודק אותו מול `GET /auth/me`. ה־interceptor של axios מוסיף `Authorization: Bearer` לכל בקשה. בשגיאת 401 הוא מנתק ומעביר ל־`/login`.
- **הבאת מידע:** React Query. כל רשימה נשמרת לפי מפתח (למשל `["projects", filters]`). אחרי שמירה, `invalidateQueries` מסמן את הרשימות כישנות, והמסך מתעדכן לבד.
- **טפסים:** React Hook Form עם zod, באותם כללים כמו בשרת. שגיאות 400 מהשרת נכנסות לשדה המתאים עם `setError`.
- **הרשאות:** `ProtectedRoute` מסתיר דפים לפי תפקיד, אבל זו רק נוחות. השרת בודק את ההרשאות בכל בקשה.

---

## הערות

- **Tailwind CSS** נטען מהקובץ `public/vendor/tailwind-3.4.17.js`, שהוא Tailwind הרשמי מ־`cdn.tailwindcss.com`. הצבעים והגופנים מוגדרים ב־`index.html` (`tailwind.config`). כך נעשה כי npm היה חסום ברשת בזמן הפיתוח. כשיהיה אפשר, מומלץ להחליף להתקנה רגילה (`npm install -D tailwindcss`).
- **האייקונים** ב־`components/ui/icons.tsx` הם הצורות של ספריית [Lucide](https://lucide.dev) (רישיון ISC), כ־SVG פשוט.
- **העלאת תמונות** (לפרויקט ולגלריה) עוברת דרך השרת ל־Cloudinary, ודורשת את מפתחות `CLOUDINARY_*` ב־`.env` של השרת. ברשת עם סינון שבודק HTTPS (כמו נטפרי) צריך להריץ את השרת עם `NODE_OPTIONS=--use-system-ca`, אחרת Node לא מזהה את התעודה של הסינון ומחזיר 502.
- **תמונות קבועות** של האתר (למשל `public/images/auth.jpg`) נמצאות בתיקייה `public`, ונכנסות לאתר יחד עם הקוד. תמונות שהמנהלת מעלה נשמרות ב־Cloudinary דרך השרת.
