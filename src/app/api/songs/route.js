import {z} from "zod";
import {neon} from "@neondatabase/serverless";

//get all songs
export async function GET() {
    const dbUrl = process.env.DATABASE_URL || "";
    const sql = neon(dbUrl);

    const response = await sql`SELECT * FROM songs`;

    return new Response(JSON.stringify(response), {status:200});
}

//add song
export async function POST(request) {
    let newSong = await request.json();

    //validation
    const newSongSchema = z.object({
        song_name: z.string().min(1).max(100),
        artist: z.string().min(1).max(100).nullish(),
        album: z.string().min(1).max(100).nullish(),
        date: z.string().nullish(), //date should be a string in yyyy-mm-dd format
    })
    try {
        newSongSchema.parse(newSong);
    } catch (error) {
        return new Response(null, {status:406});
    }

    //add to database
    const dbUrl = process.env.DATABASE_URL || "";
    const sql = neon(dbUrl);
    const response = await sql`
    INSERT INTO songs (song_name, artist, album, release_date) VALUES (${newSong.song_name}, ${newSong.artist}, ${newSong.album}, ${newSong.date})
    RETURNING *;
    `;

    return new Response(JSON.stringify(response), {status:201});
}