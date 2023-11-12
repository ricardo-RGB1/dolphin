import { Category, Course } from "@prisma/client";

import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";

// Define a custome type used to represent a course with its category, chapters, and progress.
// This type extends the Course type and adds three additional properties:
type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({ 
  userId, 
  title,
  categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => { 
  try {
    const courses = await db.course.findMany({ 
      // filter courses by title and category ID
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        // include the category, chapters, and purchases of each course
        category: true,
        chapters: {
          where: {
            // only include published chapters
            isPublished: true,
          },
          select: {
            // only include the ID of each chapter
            id: true,
          },
        },
        purchases: {
          // include the purchases of the user
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });


    // Retrieve the courses with progress and category for a user
    // Map over the courses and return a new array of courses with progress and category
    const coursesWithProgress: CourseWithProgressWithCategory[] =
      await Promise.all(
        courses.map(async (course) => {
          if (course.purchases.length === 0) {
            return {
              ...course,
              progress: null,
            };
          }

          const progressPercentage = await getProgress(userId, course.id);

          return {
            ...course,
            progress: progressPercentage,
          };
        })
      );

    return coursesWithProgress;

  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};


// coursesWithProgress:
// This code retrieves the courses with progress and category for a user. It first maps over the courses array and returns a new array of courses with progress and category. If a course has no purchases, it returns the course with null progress. Otherwise, it retrieves the progress percentage for the user in the course using the getProgress function. Finally, it returns the course with progress and category. The Promise.all function is used to wait for all the promises to resolve before returning the final array of courses with progress and category.