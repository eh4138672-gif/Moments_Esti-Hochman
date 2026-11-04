import { useEffect, useState } from "react";
import { useGallery } from "../../hooks/useGallery";

interface CameraSlideshowProps {
  startAt?: number;
}

const SLIDE_MS = 3000;

const SCREEN = { left: "25.85%", top: "40.75%", width: "34.4%", height: "34.3%" };

function CameraSlideshow({ startAt = 0 }: CameraSlideshowProps) {
  const { data: photos = [] } = useGallery();
  const [current, setCurrent] = useState(startAt);

  useEffect(() => {
    if (photos.length < 2) return;
    const timer = setInterval(() => setCurrent((i) => i + 1), SLIDE_MS);
    return () => clearInterval(timer);
  }, [photos.length]);

  const shown = photos.length > 0 ? current % photos.length : -1;

  return (
    <div className="relative aspect-[3/2] w-full">
      <img src="/images/camera.jpg" alt="מצלמה" className="absolute inset-0 size-full object-cover" />

      <div className="absolute overflow-hidden rounded-[3px] bg-black" style={SCREEN}>
        {photos.map((photo, index) => (
          <img
            key={photo.id}
            src={photo.url}
            alt=""
            className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ${index === shown ? "opacity-100" : "opacity-0"}`}
          />
        ))}

        <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
      </div>
    </div>
  );
}

export default CameraSlideshow;
