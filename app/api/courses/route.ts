import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


// API route for creating a new course in the database ********

export async function POST(req: Request) {
    try {
        const { userId } = auth(); // gets the userId from the auth() function
        const { title } = await req.json(); // receives the title from the request body

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // create a new course in the database
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


// ****** Explanation ******

// This is a TypeScript function that handles a POST request to create a new course. The function takes in a Request object as an argument and returns a NextResponse object.

// The function first extracts the userId and title properties from the request body using destructuring assignment. The userId is obtained from the auth() function, which presumably checks the user's authentication status. If the userId is not present, the function returns a NextResponse object with a status code of 401 (Unauthorized).

// If the userId is present, the function creates a new course in the database using the db.course.create() method. The create() method takes an object with a data property that contains the course data to be created. In this case, the data object contains the userId and title properties obtained from the request body.

// If the course creation is successful, the function returns a NextResponse object with a JSON representation of the newly created course. If there is an error during the course creation, the function logs the error to the console and returns a NextResponse object with a status code of 500 (Internal Server Error).


// create a new course - This is creating a new course in a database using the create method of the db.course object. The create method takes an object with two properties: userId and title. The userId property is the ID of the user who created the course, and the title property is the title of the course. The await keyword is used to wait for the create method to finish before moving on to the next line of code.