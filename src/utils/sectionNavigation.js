export function getCenteredSectionScrollTop({
  sectionTop,
  sectionHeight,
  viewportHeight,
  headerHeight = 0,
}) {
  const visibleHeaderHeight = Math.max(0, Math.min(headerHeight, viewportHeight));
  const availableHeight = Math.max(0, viewportHeight - visibleHeaderHeight);
  const sectionOffset = Math.max(0, (availableHeight - sectionHeight) / 2);

  return Math.max(0, sectionTop - visibleHeaderHeight - sectionOffset);
}
