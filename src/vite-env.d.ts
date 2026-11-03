/// <reference types="vite/client" />

// משתני הסביבה מקובץ .env (רק משתנים שמתחילים ב־VITE_ זמינים בדפדפן)
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
