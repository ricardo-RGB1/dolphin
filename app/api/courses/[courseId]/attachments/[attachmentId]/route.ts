import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; attachmentId: string } } // get the courseId and attachmentId from the params
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // Query the database for the course owner
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    // If the course owner is not found, return a 404
    if (!courseOwner) return new NextResponse("Unathorized", { status: 401 });

    // Delete the attachment from the database and store it in a variable called deletedAttachment
    const deletedAttachment = await db.attachment.delete({
      where: {
        courseId: params.courseId,
        id: params.attachmentId,
      },
    });

    // Return the deleted attachment
    return NextResponse.json(deletedAttachment);
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
