/**
 * Checks if a given user ID belongs to a teacher.
 * @param userId - The user ID to check.
 * @returns Whether the user ID belongs to a teacher.
 */
export const isTeacher = (userId?: string | null) => {
  return userId === process.env.NEXT_PUBLIC_TEACHER_ID;
};
