import { fetchDeezerTrack } from "@/services/deezer";

export async function getSongDetailsServer(songId) {
  const track = await fetchDeezerTrack(songId);
  return {
    title: track.title,
    singers: track.singers,
    album: track.album,
  };
}
