import type { Point } from 'geojson';

export function pointToLatLng(
  p: Point | undefined | null,
): { latitude: number; longitude: number } | null {
  if (!p?.coordinates || p.coordinates.length < 2) {
    return null;
  }
  const [longitude, latitude] = p.coordinates;
  return { latitude, longitude };
}
