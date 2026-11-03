import type { GalleryItem } from "../../types/gallery";
import { SparkleIcon } from "../ui/icons";

interface PhotoStackProps {
  photos: GalleryItem[]; // עד 4 תמונות מהגלריה (החדשות קודם)
}

// המיקום והזווית של כל תמונה בערימה. delay – כל אחת "מרחפת" בזמן אחר, כדי שלא יזוזו יחד
const SLOTS = [
  { position: "left-[4%] top-[6%]", rotate: "-rotate-[8deg]", delay: "0s" },
  { position: "left-[40%] top-0", rotate: "rotate-[6deg]", delay: "1.5s" },
  { position: "left-[14%] top-[44%]", rotate: "rotate-[4deg]", delay: "3s" },
  { position: "left-[48%] top-[40%]", rotate: "-rotate-[5deg]", delay: "4.5s" },
];

// ערימת תמונות מוטות במסגרת לבנה, כמו תמונות מודפסות על שולחן.
// אם אין עדיין תמונות בגלריה – מסגרות ריקות בגרדיאנט, כדי שהחלק הזה לא יישאר ריק
function PhotoStack({ photos }: PhotoStackProps) {
  return (
    <div className="relative h-[26rem]">
      {SLOTS.map((slot, index) => {
        const photo = photos[index];
        return (
          // החיצוני מרחף (animate-float), הפנימי מוטה – כך ה־transform של שניהם לא מתנגש
          <div key={index} className={`absolute ${slot.position} animate-float hover:z-20`} style={{ animationDelay: slot.delay }}>
            <figure
              className={`${slot.rotate} rounded-lg bg-cream p-2.5 pb-9 shadow-2xl shadow-black/50 transition duration-500 hover:rotate-0 hover:scale-110`}
            >
              <div className="grid h-48 w-40 place-items-center overflow-hidden rounded bg-gradient-to-br from-sun/60 via-rose/50 to-violet/60 lg:h-52 lg:w-44">
                {photo ? (
                  <img src={photo.url} alt={photo.title} className="size-full object-cover" />
                ) : (
                  <SparkleIcon size={32} className="text-cream/80" />
                )}
              </div>
            </figure>
          </div>
        );
      })}
    </div>
  );
}

export default PhotoStack;
