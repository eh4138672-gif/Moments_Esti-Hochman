import { useEffect, useState } from "react";
import { useGallery } from "../../hooks/useGallery";
import { SparkleIcon } from "../ui/icons";

interface CameraSlideshowProps {
  startAt?: number; // מאיזו תמונה להתחיל – כדי ששתי מצלמות זו ליד זו לא יראו אותה תמונה
}

const SLIDE_MS = 3000; // כל כמה זמן מתחלפת התמונה

// מצלמה (מבט מאחור) שבמסך שלה מתחלפות תמונות מהגלריה – לכרטיסי החבילות.
// useGallery() משתמש באותו מפתח כמו בדף הבית, כך שלא נשלחת בקשה נוספת לשרת
function CameraSlideshow({ startAt = 0 }: CameraSlideshowProps) {
  const { data: photos = [] } = useGallery();
  const [current, setCurrent] = useState(startAt);

  // כל 3 שניות – התמונה הבאה. כשהקומפוננטה יוצאת מהמסך, הטיימר נעצר
  useEffect(() => {
    if (photos.length < 2) return;
    const timer = setInterval(() => setCurrent((i) => i + 1), SLIDE_MS);
    return () => clearInterval(timer);
  }, [photos.length]);

  const shown = photos.length > 0 ? current % photos.length : -1;

  return (
    <div className="grid size-full place-items-center p-6 pt-12">
      <div className="relative w-4/5 max-w-sm">
        {/* כפתור הצילום וגלגל המצבים – בולטים מעל הגוף */}
        <span className="absolute -top-2 end-8 h-3 w-10 rounded-t-md bg-[#3a3942]" />
        <span className="absolute -top-3 end-20 size-6 rounded-full border-2 border-[#4a4952] bg-[#2e2d35]" />

        {/* גוף המצלמה */}
        <div className="flex gap-4 rounded-3xl border border-white/10 bg-gradient-to-b from-[#34333b] to-[#1f1e24] p-4 shadow-2xl shadow-black/60">
          {/* המסך – כל התמונות אחת על השנייה, רק הנוכחית גלויה (opacity) */}
          <div className="relative aspect-[4/3] flex-1 overflow-hidden rounded-xl border-4 border-black bg-gradient-to-br from-sun/40 via-rose/30 to-violet/40">
            {shown === -1 && (
              <div className="grid size-full place-items-center">
                <SparkleIcon size={28} className="text-cream/80" />
              </div>
            )}
            {photos.map((photo, index) => (
              <img
                key={photo.id}
                src={photo.url}
                alt=""
                className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ${index === shown ? "opacity-100" : "opacity-0"}`}
              />
            ))}
            {/* ברק עדין על הזכוכית */}
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent" />
          </div>

          {/* הכפתורים מימין למסך */}
          <div className="flex w-14 flex-col items-center justify-between py-1">
            <span className="bg-gradient-to-r from-sun via-rose to-violet bg-clip-text font-display text-[0.6rem] font-extrabold text-transparent">
              moments
            </span>
            <span className="grid size-11 place-items-center rounded-full border-2 border-[#4a4952] bg-[#26252c]">
              <span className="size-3 rounded-full bg-[#4a4952]" />
            </span>
            <span className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-[#4a4952]" />
              <span className="size-2.5 rounded-full bg-rose/70" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CameraSlideshow;
