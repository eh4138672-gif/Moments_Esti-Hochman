import { useEffect, useState } from "react";
import { useGallery } from "../../hooks/useGallery";

interface CameraSlideshowProps {
  startAt?: number; // מאיזו תמונה להתחיל – כדי ששתי מצלמות זו ליד זו לא יראו אותה תמונה
}

const SLIDE_MS = 3000; // כל כמה זמן מתחלפת התמונה

// המיקום של המסך בתוך public/images/camera.jpg, באחוזים מגודל התמונה
// (נמדד לפי הפיקסלים: המסך השחור נמצא בין x=396–925 ו־y=416–768 מתוך 1536×1024)
const SCREEN = { left: "25.85%", top: "40.75%", width: "34.4%", height: "34.3%" };

// תמונה אמיתית של מצלמה על רקע טבע, ובמסך שלה מתחלפות תמונות מהגלריה – לכרטיסי החבילות.
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
    // aspect-[3/2] – אותו יחס כמו של תמונת המצלמה, כך שהאחוזים של המסך נשארים מדויקים בכל גודל
    <div className="relative aspect-[3/2] w-full">
      <img src="/images/camera.jpg" alt="מצלמה" className="absolute inset-0 size-full object-cover" />

      {/* המסך – כל התמונות אחת על השנייה, רק הנוכחית גלויה (opacity). אם אין תמונות – המסך נשאר שחור */}
      <div className="absolute overflow-hidden rounded-[3px] bg-black" style={SCREEN}>
        {photos.map((photo, index) => (
          <img
            key={photo.id}
            src={photo.url}
            alt=""
            className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ${index === shown ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        {/* ברק עדין על הזכוכית */}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
      </div>
    </div>
  );
}

export default CameraSlideshow;
