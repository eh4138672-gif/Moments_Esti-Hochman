// משתמש מחובר – כפי שהשרת מחזיר מ־login / register / me
export type Role = "Admin" | "Client";

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  createdAt: string;
}

// התשובה של POST /auth/login ו־POST /auth/register
export interface AuthResponse {
  token: string;
  user: User;
}

// מה ששולחים בטופס ההתחברות
export interface LoginInput {
  email: string;
  password: string;
}

// מה ששולחים בטופס ההרשמה ("אימות סיסמה" נבדק רק ב־React ולא נשלח)
export interface RegisterInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}
