import {z} from "zod";
import {neon} from "@neondatabase/serverless";

//get single review by user and song id
export async function GET (request, {params}) {
    const {id, songid} = await params;
    const idNum = Number(id);
    const songIdNum = Number(songid);
    const dbUrl = process.env.DATABASE_URL || "";
    const sql = neon(dbUrl);

    //get single review record
    const response = await sql`SELECT * FROM reviews WHERE user_id = ${idNum} AND song_id = ${songIdNum}`;

    return new Response(JSON.stringify(response), {status:200});
}


//delete single review by user and song id
export async function DELETE (request, {params}) {
    const {id, songid} = await params;
    const idNum = Number(id);
    const songIdNum = Number(songid);
    const dbUrl = process.env.DATABASE_URL || "";
    const sql = neon(dbUrl);

    //delete single review record
    const response = await sql`DELETE FROM reviews WHERE user_id = ${idNum} AND song_id = ${songIdNum}`;

    return new Response(null, {status:204});
}


//update single review by user and song id
export async function POST (request, {params}) {
    const {id, songid} = await params;
    const idNum = Number(id);
    const songIdNum = Number(songid);
    const review = await request.json();
    const dbUrl = process.env.DATABASE_URL || "";
    const sql = neon(dbUrl);

    //validation
    const reviewSchema = z.object({
        title: z.string().min(0).max(100).nullish(),
        rating: z.number().int().min(0).max(10),
        date: z.string(), //date should be a string in yyyy-mm-dd format
        body: z.string().min(0).max(2000).nullish()
    })
    try {
        reviewSchema.parse(review);
    } catch (error) {
        return new Response(null, {status:406});
    }

    //update user in database
    const response = await sql`
    UPDATE reviews 
        SET review_title = ${review.title}, 
            rating = ${review.rating},
            review_date = ${review.date},
            review_body = ${review.body}
        WHERE user_id = ${idNum} AND song_id = ${songIdNum}
        RETURNING *`;
    return new Response(JSON.stringify(response), {status:200});
}