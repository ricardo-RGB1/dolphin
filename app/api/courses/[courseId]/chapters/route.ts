import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(
    req: Request,
    {params}: { params: {courseId: string} } // params.courseId
){
    try {
        const { userId } = auth();
        const {title} = await req.json();

        if(!userId) return new NextResponse('Unauthorized', {status: 401})

        // check if course belongs to user
        const courseOwner = await db.course.findUnique({ // search for a course that matches the specified criteria.
            where: { // find course where courseId and userId matches
                id: params.courseId, 
                userId: userId
            },
        })

        // if course does not belong to user
        if(!courseOwner) return new NextResponse('Unauthorized', {status: 401})
        
        // befor creating a chapter, fetch the last chapter and get the last chapter number, so there is a way to know where to place the new chapter
        


    } catch (error) {
        console.log('[CHAPTERS]', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}