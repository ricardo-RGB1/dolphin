/**
 * Retrieves the courses that a user has purchased and their progress for the dashboard.
 * @param userId - The ID of the user whose courses to retrieve.
 * @returns An object containing the completed courses and courses in progress.
 */

import { Category, Chapter, Course } from "@prisma/client";

import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";

/**
 * Represents a course with its category, chapters, and progress.
 */
type CourseWithProgressWithCategory = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
};

// DashboardCourses is an object type definition. This object has two properties: completedCourses and coursesInProgress. Both properties are arrays of objects that conform to the CourseWithProgressWithCategory type.
type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  coursesInProgress: CourseWithProgressWithCategory[];
};

/**
 * Retrieves the courses that a user has purchased and their progress for the dashboard.
 * @param userId - The ID of the user whose courses to retrieve.
 * @returns An object containing the completed courses and courses in progress.
 */
const getDashboardCourses = async (
  userId: string
): Promise<DashboardCourses> => {
  try {
    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId: userId,
      },
      // select is used to specify which fields to include in the response. In this case, we want to include the course and its category and chapters.
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    // purchasedCourses is an array of objects that contain the course and its category and chapters. We want to extract the course from each object and add it to a new array.
    // We use type assertion to tell TypeScript that the array contains objects that conform to the CourseWithProgressWithCategory type.
    const courses = purchasedCourses.map(
      (purchase) => purchase.course
    ) as CourseWithProgressWithCategory[];

    // We want to add the progress for each course to the course object.
    for (let course of courses) {
      const progress = await getProgress(userId, course.id);
      course["progress"] = progress; // We use bracket notation to add the progress property to the course object.
    }

    /**
     * Filters the given array of courses to only include those that have a progress of 100.
     * @param courses - The array of courses to filter.
     * @returns An array of courses that have a progress of 100.
     */
    const completedCourses = courses.filter(
      (course) => course.progress === 100
    );

    /**
     * Filters an array of courses to only include those that are in progress (i.e. have not yet reached 100% progress). Uses the nullish coalescing operator (??) to check if a course's progress is null.
     * If a course's progress is null, it is treated as 0.
     * @param courses An array of courses to filter.
     * @returns An array of courses that are in progress.
     */
    const coursesInProgress = courses.filter(
      (course) => (course.progress ?? 0) < 100 // If course.progress is null, it is treated as 0.
    );

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.log("[GET_DASHBOARD_COURSES]", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};

export default getDashboardCourses;
