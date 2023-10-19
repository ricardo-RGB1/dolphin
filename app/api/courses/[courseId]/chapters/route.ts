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
        

        // befor creating a new chapter, fetch the last chapter to get the position, so there is a way to know where to place the new chapter
        const lastChapter = await db.chapter.findFirst({ // find the first chapter that matches the specified criteria.
            where: {
                courseId: params.courseId
            },
            orderBy: {
                position: 'desc' // descending order
            }
        })

        const newPosition = lastChapter ? lastChapter.position + 1 : 1 // if there is a last chapter, increment the position by 1, else set position to 1

        
        const chapter = await db.chapter.create({ // create a new chapter
            data: { 
                title,
                courseId: params.courseId,
                position: newPosition
            }
        })


        // return the chapter
        return NextResponse.json(chapter);

    } catch (error) {
        console.log('[CHAPTERS]', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}