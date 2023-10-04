import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    {params}: {params: {courseId: string}} // destructuring the params object from the request object
) {
    try {
        const { userId } = auth();
        const { courseId } = params; // destructuring the courseId from the params object
        const { values } = await req.json(); // receives the title from the request body

        // check if the user is authenticated
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // update the course in the database
        const course = await db.course.update({
            where: {
                id: courseId,
            },
            data: {
                ...values,
            }
        });

        return NextResponse.json(course);

    } catch (error) {
        console.log("[COURSE_ID]", error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
