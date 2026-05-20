export async function searchSongs(query) {
  const response = await fetch(
    `/api/music/search?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Failed to search songs");
  }

  return response.json();
}

export async function getSongDetails(songId) {
  const response = await fetch(`/api/music/track/${songId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch song details");
  }

  return response.json();
}
