import { NextResponse } from "next/server";
import { searchDeezerTracks } from "@/services/deezer";

export async function GET(request) {
  const query = request.nextUrl.searchParams.get("q");

  if (!query?.trim()) {
    return NextResponse.json({ error: "Missing search query" }, { status: 400 });
  }

  try {
    const results = await searchDeezerTracks(query);
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Music search failed" },
      { status: 502 }
    );
  }
}
