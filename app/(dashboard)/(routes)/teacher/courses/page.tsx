import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";



const CoursesPage = async () => {
    const { userId } = auth();

    if(!userId) {
        return redirect('/'); // redirect to home page
    }

    // import Course from db here and pass it to the DataTable component
    const courses = await db.course.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });



    return (
      <div className="p-6">
        <DataTable columns={columns} data={courses} />
      </div>
    );
}


export default CoursesPage;