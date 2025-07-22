export function getPingMarkerIcon(name: string) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const svg = `
    <svg width="30" height="42" viewBox="0 0 50 70" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 0C11.2 0 0 11.2 0 25c0 15 21.5 42.7 23.1 44.9a2.5 2.5 0 0 0 3.8 0C28.5 67.7 50 40 50 25 50 11.2 38.8 0 25 0z" fill="#FF7979"/>
      <circle cx="25" cy="25" r="13" fill="#ffffff"/>
      <text x="25" y="31" text-anchor="middle" font-size="14" font-family="Arial, sans-serif" fill="#000000" font-weight="900">${initials}</text>
    </svg>`;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new window.google.maps.Size(30, 42),
    anchor: new window.google.maps.Point(15, 42),
  };
}

// Validate coordinates
export function isValidLatLng(
  point: any
): point is { lat: number; lng: number } {
  return (
    point &&
    typeof point === "object" &&
    typeof point.lat === "number" &&
    typeof point.lng === "number" &&
    isFinite(point.lat) &&
    isFinite(point.lng)
  );
}

// Bike icon
export const getBikeIcon = () => ({
  url: "https://maps.google.com/mapfiles/kml/shapes/motorcycling.png",
  scaledSize: new window.google.maps.Size(30, 30),
});

// Trail dot icon
export const getSmallDotIcon = () => ({
  path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
  scale: 5,
  fillColor: "#0000FF",
  fillOpacity: 1,
  strokeWeight: 1,
  strokeColor: "#fff",
});

export function getStartPointMarkerIcon(name: string) {
  const initials = name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const svg = `
    <svg width="30" height="42" viewBox="0 0 50 70" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 0C11.2 0 0 11.2 0 25c0 15 21.5 42.7 23.1 44.9a2.5 2.5 0 0 0 3.8 0C28.5 67.7 50 40 50 25 50 11.2 38.8 0 25 0z" fill="#00AD34"/>
      <circle cx="25" cy="25" r="13" fill="#ffffff"/>
      <text x="25" y="31" text-anchor="middle" font-size="14" font-family="Arial, sans-serif" fill="#000000" font-weight="900">${initials}</text>
    </svg>`;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new window.google.maps.Size(30, 42),
    anchor: new window.google.maps.Point(15, 42),
  };
}
