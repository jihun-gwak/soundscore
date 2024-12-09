import {z} from "zod";
import {neon} from "@neondatabase/serverless";

//get reviews between two dates
//function is POST because it has a body.
export async function POST (request) {
    let dateRange = await request.json();

    //validation
    const dateRangeSchema = z.object({
        start: z.string().nullish(), //date should be a string in yyyy-mm-dd format
        end: z.string().nullish() //date should be a string in yyyy-mm-dd format
    })
    try {
        dateRangeSchema.parse(dateRange);
    } catch (error) {
        return new Response(null, {status:406});
    }
    
    const dbUrl = process.env.DATABASE_URL || "";
    const sql = neon(dbUrl);

    const response = await sql`SELECT * FROM reviews WHERE review_date >= ${dateRange.start} AND review_date <= ${dateRange.end}`;

    return new Response(JSON.stringify(response), {status:200});
}