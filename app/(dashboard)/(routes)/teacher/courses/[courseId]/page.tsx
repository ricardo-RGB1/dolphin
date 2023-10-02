import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./_components/title-form";

const CourseIdPage = async ({params}:{params: {courseId: string}}) => {
    const { userId } = auth(); // to keep track of which user created which course

    if(!userId) {
        return redirect('/');
    }

    // Check if the course exists in the database
    const course = await db.course.findUnique({
        where: {
            id: params.courseId
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
    const ratioCompleted = `(${completedRequiredFields}/${totalRequiredFields})` // ratio of completed fields



    return ( 
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">Course Setup</h1>
                    <span className="text-sm text-slate-700">Complete all fields {ratioCompleted} </span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl">Customize your course</h2>
                    </div>
                    <TitleForm
                        initialData={course}
                        courseId={course.id} />
                </div>
            </div>
        </div>
     );
}
 
export default CourseIdPage;