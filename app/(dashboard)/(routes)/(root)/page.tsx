import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { CheckCircle, Clock } from "lucide-react";

import  getDashboardCourses  from "@/actions/get-dashboard-courses";
import  CoursesList  from "@/components/courses-list";

import { InfoCard } from "./_components/info-card";

/**
 * Renders the dashboard page with information about the user's completed and in-progress courses.
 * @returns The dashboard page JSX element.
 */
const Dashboard = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    userId
  );

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList courses={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
}

export default Dashboard;

