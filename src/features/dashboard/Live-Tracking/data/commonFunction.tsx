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

// user icon
export function getUserIconMarker() {
  const svg = `
    <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" fill="none">
       <!-- Green circular background -->
       <circle cx="30" cy="30" r="30" fill="#00AD34"/>
      
      <!-- Inner translucent ring -->
      <circle cx="30" cy="30" r="24" fill="#ffffff" fill-opacity="0.2"/>
      
      <!-- Static Lucide-style user icon -->
      <path d="M30 28c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7 3.582 7 8 7Zm0 3c-5.33 0-16 2.667-16 8v3h32v-3c0-5.333-10.67-8-16-8Z"
            fill="#ffffff"/>
    </svg>
  `;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new window.google.maps.Size(30, 30),
    anchor: new window.google.maps.Point(20, 20),
  };
}

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

/**
 * Calculates the great-circle distance between two points on the Earth using the Haversine formula.
 * @param lat1 Latitude of the first point.
 * @param lon1 Longitude of the first point.
 * @param lat2 Latitude of the second point.
 * @param lon2 Longitude of the second point.
 * @returns The distance between the two points in kilometers.
 */
export function getHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
    return 0;
  }

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km

  return distance;
} 