import { db } from "@/lib/db";

// This function retrieves the progress of a user in a course
async function getProgress(userId: string, courseId: string): Promise<number> {
  try {
    // Retrieve the published chapters of the course from the database
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    // Extract the IDs of the published chapters
    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

    // Count the number of completed chapters of the user that are also published
    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId: userId,
        chapterId: {
          in: publishedChapterIds,
        },
        completed: true,
      },
    });

    // Calculate the progress percentage based on the number of completed chapters
    const progressPercentage =
      (validCompletedChapters / publishedChapters.length) * 100;

    return progressPercentage;

  } catch (error) {
    // If an error occurs during the process, log the error and return 0
    console.error(error);
    return 0;
  }
}
