import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const { title } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // create a new course
        const course = await db.course.create({
            data: {
                userId,
                title,
            }
        });

        return NextResponse.json(course);

    } catch (error) {
        console.log("[COURSES]", error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}


// create a new course - The selected code is creating a new course in a database using the create method of the db.course object. The create method takes an object with two properties: userId and title. The userId property is the ID of the user who created the course, and the title property is the title of the course. The await keyword is used to wait for the create method to finish before moving on to the next line of code.