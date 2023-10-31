import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import ChapterTitleForm from "./_components/chapter-title-form";
import ChapterDescriptionForm from "./_components/chapter-description-form";


const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string }; 
}) => {

  
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }


  // Find the chapter with the given id and courseId and include the muxData relationship
  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) return redirect("/");

  // create a requiredFields array
  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  // get the total number of required fields
  const totalRequiredFields = requiredFields.length;
  // filter out the empty fields
  const completedRequiredFields = requiredFields.filter(Boolean).length;
  // create a completed string
  const completed = `(${completedRequiredFields}/${totalRequiredFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/teacher/courses/${params.courseId}`}
            className="flex items-center text-sm hover:opacity-75 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to course setup
          </Link>
          <div className="flex items-center justify-between  w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Create Chapter</h1>
              <span className="text-sm text-slate-700">
                Complete all fields {completed}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
            <div>
                <div className="flex items-center gap-x-2">
                    <IconBadge icon={LayoutDashboard} />
                    <h2 className="text-xl">Customize Your Chapter</h2>
                </div>
                <ChapterTitleForm 
                  initialData={chapter}
                  courseId={params.courseId}
                  chapterId={params.chapterId}
                />
                <ChapterDescriptionForm
                  initialData={chapter}
                  courseId={params.courseId}
                  chapterId={params.chapterId}
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;

// const chapter:
// This code is using the Prisma client to query the database for a single Chapter record that matches the specified id and courseId values.

// The findUnique method is called on the db.chapter object, which represents the Chapter table in the database. The findUnique method takes an object as its argument that specifies the search criteria for the query. In this case, the where property of the object is an object that contains two properties: id and courseId. These properties are used to filter the records in the Chapter table and find the record that matches the specified id and courseId values.

// The include property of the object is an object that specifies the related records to be included in the query. In this case, the muxData property is set to true, which means that the related muxData record will be included in the query result.

// Overall, this code is used to fetch a single Chapter record from the database that matches the specified id and courseId values, along with its related muxData record - to display information about the chapter and its associated video in the UI.

