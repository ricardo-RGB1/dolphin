import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
    try {
        const {userId} = auth();
        const { url } = await req.json();

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const courseOwnder = await db.course.findUnique({ // check if user is course owner
            where: {
                id: params.courseId,
                userId: userId
            }
        })

        
        if(!courseOwnder) { // if user is not course owner
            return new NextResponse("Unauthorized", { status: 401 }) //
        }


        // create attachment
        const attachment = await db.attachment.create({ 
            data: {
                url,
                name: url.split("/").pop(),
                courseId: params.courseId
            }
        });
        
        return NextResponse.json(attachment);

    } catch (error) {
        console.log("COURSE_ID_ATTACHMENTS", error); 
        return new NextResponse("Internal server error", { status: 500 })
    }
}
