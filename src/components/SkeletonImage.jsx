import { useRef, useState } from "react";
import { getImageLoadState } from "../utils/imageLoading";
import "./SkeletonImage.css";

function SkeletonImage({ src, alt = "Imagen no disponible" }) {
  const imageRef = useRef(null);
  const [imageStatus, setImageStatus] = useState(() => ({
    src,
    state: src ? "loading" : "error",
  }));
  const state = imageStatus.src === src ? imageStatus.state : src ? "loading" : "error";

  const updateStateFromEvent = (event) => {
    if (imageRef.current !== event.currentTarget) return;
    setImageStatus({
      src,
      state: getImageLoadState(event.currentTarget),
    });
  };

  const hasImageSource = Boolean(src);
  const isError = state === "error" || !hasImageSource;

  return (
    <span
      className="skeleton-image"
      data-image-state={isError ? "error" : state}
      aria-busy={state === "loading"}
    >
      {state === "loading" && hasImageSource && (
        <span className="skeleton-image__placeholder" aria-hidden="true" />
      )}
      {isError ? (
        <span className="skeleton-image__fallback" role="img" aria-label={alt}>
          Imagen no disponible
        </span>
      ) : (
        <img
          key={src}
          ref={imageRef}
          className="skeleton-image__asset"
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={updateStateFromEvent}
          onError={updateStateFromEvent}
        />
      )}
    </span>
  );
}

export default SkeletonImage;
