import { axiosClient } from "./axiosClient";
import type { AuthResponse, LoginInput, RegisterInput, User } from "../types/user";

// POST /auth/login → { token, user }
export async function login(data: LoginInput): Promise<AuthResponse> {
  const response = await axiosClient.post<AuthResponse>("/auth/login", data);
  return response.data;
}

// POST /auth/register → { token, user } (נרשם תמיד כלקוח)
export async function register(data: RegisterInput): Promise<AuthResponse> {
  const response = await axiosClient.post<AuthResponse>("/auth/register", data);
  return response.data;
}

// GET /auth/me → המשתמש המחובר (לפי הטוקן השמור)
export async function getMe(): Promise<User> {
  const response = await axiosClient.get<User>("/auth/me");
  return response.data;
}
