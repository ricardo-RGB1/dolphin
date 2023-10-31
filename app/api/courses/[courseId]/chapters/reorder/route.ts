import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";



export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth(); // get the user id from the session

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // check if course belongs to user
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    // if course does not belong to user
    if (!courseOwner) return new NextResponse("Unauthorized", { status: 401 });

    const { list } = await req.json(); // get the list of chapters from the request body

    // Use a for of loop through the list of chapters and update the position
    for (let chapter of list) { 
      await db.chapter.update({
        where: {
          id: chapter.id,
        },
        data: {
          position: chapter.position,
        },
      });
    }

    return new NextResponse("Success", { status: 200 }); 
  } catch (error) {
    console.log("[REORDER CHAPTERS]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
