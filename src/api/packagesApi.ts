import { axiosClient } from "./axiosClient";
import type { Package } from "../types/package";

// GET /packages → שתי החבילות, ממוינות לפי מחיר (פתוח לכולם)
export async function getPackages(): Promise<Package[]> {
  const response = await axiosClient.get<Package[]>("/packages");
  return response.data;
}
