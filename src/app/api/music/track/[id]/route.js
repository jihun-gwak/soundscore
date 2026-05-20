import { NextResponse } from "next/server";

const API_HOST =
  process.env.RAPIDAPI_HOST || "deezerdevs-deezer.p.rapidapi.com";

export async function GET(_request, { params }) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "RAPIDAPI_KEY is not configured" },
      { status: 500 }
    );
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing track id" }, { status: 400 });
  }

  const response = await fetch(`https://${API_HOST}/track/${id}`, {
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": API_HOST,
    },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch track" },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json({
    audio_url: data.preview,
    title: data.title,
    singers: data.artist.name,
    image_url: data.album.cover_medium,
    album: data.album.title,
  });
}
