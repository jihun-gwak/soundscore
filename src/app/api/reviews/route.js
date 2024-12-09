import {z} from "zod";
import {neon} from "@neondatabase/serverless";

// get all reviews
export async function GET() {
    const dbUrl = process.env.DATABASE_URL || "";
    const sql = neon(dbUrl);

    const response = await sql`SELECT * FROM reviews`;

    return new Response(JSON.stringify(response), {status:200});
}

// create new review
export async function POST(request) {
    let newReview = await request.json();

    //validation
    const newReviewSchema = z.object({
        user_id: z.number().int(),
        song_id: z.number().int(),
        title: z.string().min(0).max(100).nullish(),
        rating: z.number().int().min(0).max(10),
        date: z.string(), //date should be a string in yyyy-mm-dd format
        body: z.string().min(0).max(2000).nullish()
    })
    try {
        newReviewSchema.parse(newReview);
    } catch (error) {
        return new Response(null, {status:406});
    }

    //add to database
    const dbUrl = process.env.DATABASE_URL || "";
    const sql = neon(dbUrl);
    const response = await sql`
    INSERT INTO reviews (user_id, song_id, review_title, rating, review_date, review_body) 
    VALUES (${newReview.user_id}, ${newReview.song_id}, ${newReview.title}, ${newReview.rating}, ${newReview.date}, ${newReview.body})
    RETURNING *;
    `;

    return new Response(JSON.stringify(response), {status:201});
}