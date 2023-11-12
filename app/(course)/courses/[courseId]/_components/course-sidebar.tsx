import { auth } from "@clerk/nextjs";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import CourseProgress from "@/components/course-progress";

import CourseSidebarItem from "./course-sidebar-item";

interface CourseSidebarProps {
  course: Course & { // include chapters and userProgress
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}


const CourseSidebar = async ({
  course,
  progressCount,
}: CourseSidebarProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  // get the purchase for the signed in user and the course
  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: { // find the purchase by userId and courseId
        userId,
        courseId: course.id,
      },
    },
  });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-7 flex flex-col border-b"> 
        <h1 className="font-semibold">{course.title}</h1>
        {purchase && (
          <div className="mt-10">
            {/* dont give it a variantColor or size props */}
            <CourseProgress value={progressCount} /> 
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.completed} // if the userProgress is not null, the chapter is completed
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase} // if the chapter is not free and the user has not purchased the course, lock the chapter
          />
        ))}
      </div>
    </div>
  );
};

export default CourseSidebar;