import {z} from "zod";
import {neon} from "@neondatabase/serverless";

//delete song
export async function DELETE (request, {params}) {
    const {id} = await params;
    const idNum = Number(id);
    const dbUrl = process.env.DATABASE_URL || "";
    const sql = neon(dbUrl);

    //delete song from database
    await sql`DELETE FROM songs WHERE song_id = ${idNum}`
    return new Response (null, {status:204});
}

//get single song
export async function GET (request, {params}) {
    const {id} = await params;
    const idNum = Number(id);
    const dbUrl = process.env.DATABASE_URL || "";
    const sql = neon(dbUrl);

    //get single song record
    const response = await sql`SELECT * FROM songs WHERE song_id = ${idNum}`;

    return new Response(JSON.stringify(response), {status:200});
}

//update song
export async function POST (request, {params}) {
    const {id} = await params;
    const idNum = Number(id);
    const song = await request.json();
    const dbUrl = process.env.DATABASE_URL || "";
    const sql = neon(dbUrl);

    //validation
    const newSongSchema = z.object({
        song_name: z.string().min(1).max(100),
        artist: z.string().min(1).max(100).nullish(),
        album: z.string().min(1).max(100).nullish(),
        date: z.string().nullish(), //date should be a string in yyyy-mm-dd format
    })
    try {
        newSongSchema.parse(song);
    } catch (error) {
        return new Response(null, {status:406});
    }

    //update song in database
    const response = await sql`
    UPDATE songs 
        SET song_name = ${song.song_name}, 
            artist = ${song.artist},
            album = ${song.album},
            release_date = ${song.date}
        WHERE song_id = ${idNum} 
        RETURNING *`;
    return new Response(JSON.stringify(response), {status:200});
}