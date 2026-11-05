export function getImageLoadState(image) {
  if (!image || typeof image !== "object" || image.complete !== true) {
    return "loading";
  }

  const naturalWidth = Number(image.naturalWidth);
  return Number.isFinite(naturalWidth) && naturalWidth > 0 ? "loaded" : "error";
}
