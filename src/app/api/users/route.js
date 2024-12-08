import {z} from "zod";
import {neon} from "@neondatabase/serverless";

// get all users
export async function GET() {
    const dbUrl = process.env.DATABASE_URL || "";
    const sql = neon(dbUrl);

    const response = await sql`SELECT * FROM users`;

    return new Response(JSON.stringify(response), {status:200});
}

// create new user
export async function POST(request) {
    let newUser = await request.json();

    //validation
    const newUserSchema = z.object({
        email: z.string().min(1).max(100),
        display_name: z.string().min(1).max(100),
    })
    try {
        newUserSchema.parse(newUser);
    } catch (error) {
        return new Response(null, {status:406});
    }

    //add to database
    const dbUrl = process.env.DATABASE_URL || "";
    const sql = neon(dbUrl);
    const response = await sql`
    INSERT INTO users (email, display_name) VALUES (${newUser.email}, ${newUser.display_name})
    RETURNING *;
    `;

    return new Response(JSON.stringify(response), {status:201});
}