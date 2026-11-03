// חבילת צילום – GET /packages
export type PackageTier = "Basic" | "Premium";

export interface Package {
  id: number;
  name: string;
  tier: PackageTier;
  description: string;
  price: number;
  includesAlbum: boolean; // בסיס = false → אין אלבום
  features: string[]; // רשימת "מה כלול"
  imageUrl: string | null;
}
