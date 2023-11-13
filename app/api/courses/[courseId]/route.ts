import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
// import { isTeacher } from "@/lib/teacher";

// For also deleting the Mux data when a course is deleted
// You don't want to leave orphaned Mux data in your account
const { Video } = new Mux(
    process.env.MUX_TOKEN_ID!,
    process.env.MUX_TOKEN_SECRET!
);

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();

        if(!userId) { // if the userId is not present or the user is not a teacher
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Query the course and user with the findUnique method
        // Include the chapters and muxData
        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    }
                }
            }
        });

        // if there is no course
        if(!course) {
            return new NextResponse("Not Found", { status: 404 });
        }


        // Loop through the chapters and delete the mux data
        for(const chapter of course.chapters) {
            // if there is mux data
            if(chapter.muxData) {
                // delete the mux data
                await Video.Assets.del(chapter.muxData.assetId);
            }
        }

        // delete the course
        const deletedCourse = await db.course.delete({ 
            where: {
                id: params.courseId,
            }
        });

        return  NextResponse.json(deletedCourse); // return the deleted course

    } catch (error) {
        console.log("[COURSE_ID_DELETE]", error );
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    {params}: {params: {courseId: string}} // destructuring the params object from the request object
) {
    try {
        const { userId } = auth();
        const { courseId } = params; // destructuring the courseId from the params object
        const  values  = await req.json();

        // check if the user is authenticated
        if (!userId) { // if the userId is not present or the user is not a teacher
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
