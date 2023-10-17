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


        // create attachment in database 
        const attachment = await db.attachment.create({ 
            data: { 
                url, // url of the file
                name: url.split("/").pop(), // get the name of the file
                courseId: params.courseId // id of the course
            }
        });
        
        return NextResponse.json(attachment);

    } catch (error) {
        console.log("COURSE_ID_ATTACHMENTS", error); 
        return new NextResponse("Internal server error", { status: 500 })
    }
}


// This code defines an asynchronous function called POST that handles a POST request to a specific route. The function receives a Request object and an object containing a courseId parameter. It then checks if the user is authorized to perform the action by verifying if they are the owner of the course. If the user is authorized, the function creates a new attachment in the database with the provided URL and returns the attachment as a JSON response. If there is an error, the function logs the error and returns an error response. 

// The attachment object:
// The attachment variable in the selected code is created by calling the create method on the db.attachment object. The create method creates a new attachment in the database with the provided data. In this case, the data object contains three properties:

// url: the URL of the file being attached
// name: the name of the file being attached, extracted from the URL
// courseId: the ID of the course to which the file is being attached
// The create method returns a Promise that resolves to the newly created attachment object, which is then assigned to the attachment variable using the await keyword.