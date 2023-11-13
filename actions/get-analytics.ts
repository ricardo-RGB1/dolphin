import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

type PurchaseWithCourse = Purchase & {
  course: Course;
};

/**
 * Groups purchases by course title and calculates the total price for each course.
 * @param purchases An array of purchases with course information.
 * @returns An object with course titles as keys and total price as values.
 */
const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {}; // { 'course title': total price }

  // purchase = { id: 1, courseId: 1, course: { id: 1, title: 'course title', price: 100 } }
  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title; 
    if (!grouped[courseTitle]) { // if course title is not in grouped object, add it
      grouped[courseTitle] = 0; // initialize total price to 0
    }
    grouped[courseTitle] += purchase.course.price!; 
  }); // add course price to total price

  return grouped;
};

/**
 * Retrieves analytics data for a given user.
 * @param userId - The ID of the user to retrieve analytics for.
 * @returns An object containing analytics data, including course earnings and sales.
 */
export const getAnalytics = async (userId: string) => {
  try {
    const purchases = await db.purchase.findMany({
      where: {
        course: {
          userId: userId,
        },
      },
      include: {
        course: true,
      },
    });

    const groupedEarnings = groupByCourse(purchases);  // { 'course title': total price }
    /**
     * Returns an array of objects containing the course title and its total earnings.
     * @param groupedEarnings - An object containing the total earnings for each course.
     * @returns An array of objects containing the course title and its total earnings.
     */
    const data = Object.entries(groupedEarnings).map( 
      ([courseTitle, total]) => ({
        name: courseTitle,
        total: total,
      })
    );

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0); // sum of all course earnings
    const totalSales = purchases.length; // number of purchases

    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.log("[GET_ANALYTICS]", error);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};
