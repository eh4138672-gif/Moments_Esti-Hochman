import type { AlbumStatus, Category, WorkStatus } from "../types/project";

export const categoryColors: Record<Category, string> = {
  Babies: "text-rose",
  FirstBirthday: "text-sun",
  Upsherin: "text-sky",
  Family: "text-violet",
  Albums: "text-berry",
};

export const workStatusColors: Record<WorkStatus, string> = {
  Photographed: "border-rose text-rose",
  Editing: "border-sun text-sun",
  Completed: "border-violet text-violet",
  Delivered: "border-sky text-sky",
};

export const albumStatusColors: Record<AlbumStatus, string> = {
  None: "border-line text-muted",
  SelectingPhotos: "border-rose text-rose",
  Designing: "border-sun text-sun",
  Ready: "border-sky text-sky",
};
