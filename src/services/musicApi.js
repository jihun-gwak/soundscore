async function parseError(response, fallback) {
  try {
    const data = await response.json();
    return data.error || fallback;
  } catch {
    return fallback;
  }
}

export async function searchSongs(query) {
  const response = await fetch(
    `/api/music/search?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to search songs"));
  }

  return response.json();
}

export async function getSongDetails(songId) {
  const response = await fetch(`/api/music/track/${songId}`);

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to fetch song details"));
  }

  return response.json();
}
