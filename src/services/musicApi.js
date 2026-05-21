import { fetchJson } from "@/lib/fetchJson";

export async function searchSongs(query) {
  return fetchJson(`/api/music/search?q=${encodeURIComponent(query)}`);
}

export async function getSongDetails(songId) {
  return fetchJson(`/api/music/track/${songId}`);
}

export async function getChartTracks(limit = 12) {
  return fetchJson(`/api/music/chart?limit=${limit}`);
}

export async function getSongReviews(songId) {
  return fetchJson(`/api/reviews/song/${songId}`);
}
