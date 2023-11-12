/**
 * Updates the progress of a user for a specific chapter in a course.
 * @param req - The request object.
 * @param params - The parameters object containing the courseId and chapterId.
 * @returns A JSON response containing the updated user progress.
 */
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { completed } = await req.json(); // req.json() = body of the request

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    
    const userProgress = await db.userProgress.upsert({ // upsert = update or create
      where: {
        userId_chapterId: {
          userId,
          chapterId: params.chapterId,
        },
      },
      update: {
        completed,
      },
      create: {
        userId,
        chapterId: params.chapterId,
        completed,
      },
    });

    return NextResponse.json(userProgress);
  } catch (error) {
    console.log("[CHAPTER_ID_PROGRESS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
