import { Category, Course } from "@prisma/client";
import CourseCard from "./course-card";

type CourseWithProgressAndCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface CoursesListProps {
  courses: CourseWithProgressAndCategory[];
}

const CoursesList = ({ courses }: CoursesListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4  gap-4">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            imageUrl={course.imageUrl!}
            chapters={course.chapters.length}
            price={course.price!}
            progress={course.progress}
            category={course.category?.name!}
          />
        ))}
      </div>
      {courses.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No courses found. Try a different search.
        </div>
      )}
    </div>
  );
};

export default CoursesList;
