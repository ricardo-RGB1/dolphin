import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";


// the courseId is passed in as a parameter to the page
// the params is a type of {courseId: string} - an object with a courseId property of type string
const CourseIdPage = async ({params}:{params: {courseId: string}}) => {

    const { userId } = auth(); // to keep track of which user created which course

    if(!userId) {
        return redirect('/');
    }

    // Find the course with the given id
    const course = await db.course.findUnique({
        where: { 
            id: params.courseId // find the course with the given id
        }
    })

    if(!course) {
        return redirect('/'); // if there is no course with that id, redirect to courses page
    }

    // List the required fields for creating the course
    const requiredFields = [
        course.title, 
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId
    ]

    const totalRequiredFields = requiredFields.length; // total number of required fields
    const completedRequiredFields = requiredFields.filter(Boolean).length; // filter out the empty fields
    const completed = `(${completedRequiredFields}/${totalRequiredFields})` // ratio of completed fields



    return ( 
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">Course Setup</h1>
                    <span className="text-sm text-slate-700">Complete all fields {completed} </span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl">Customize your course</h2>
                    </div>
                    <TitleForm
                        initialData={course} // pass in the initialData prop to the TitleForm component
                        courseId={course.id} 
                    />
                    <DescriptionForm
                        initialData={course}
                        courseId={course.id} 
                    />
                     <ImageForm
                        initialData={course} 
                        courseId={course.id} 
                    />
                </div>
            </div>
        </div>
     );
}
 
export default CourseIdPage;