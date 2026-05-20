import { NextResponse } from "next/server";

const API_HOST =
  process.env.RAPIDAPI_HOST || "deezerdevs-deezer.p.rapidapi.com";

export async function GET(request) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "RAPIDAPI_KEY is not configured" },
      { status: 500 }
    );
  }

  const query = request.nextUrl.searchParams.get("q");
  if (!query?.trim()) {
    return NextResponse.json({ error: "Missing search query" }, { status: 400 });
  }

  const response = await fetch(
    `https://${API_HOST}/search?q=${encodeURIComponent(query)}`,
    {
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": API_HOST,
      },
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Music search failed" },
      { status: response.status }
    );
  }

  const data = await response.json();
  const results = (data.data ?? []).map((song) => ({
    id: song.id,
    url: song.preview,
    title: song.title,
    singers: song.artist.name,
    image_url: song.album.cover_medium,
    album: song.album.title,
  }));

  return NextResponse.json(results);
}
