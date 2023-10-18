import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";
import CategoryForm from "./_components/category-form";
import { IconBadge } from "@/components/icon-badge";
import PriceForm from "./_components/price-form";
import AttachmentForm from "./_components/attachment-form";
import ChaptersForm from "./_components/chapters-form";

// the courseId is passed in as a parameter to the page
// the params is a type of {courseId: string} - an object with a courseId property of type string
const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth(); // to keep track of which user created which course

  if (!userId) {
    return redirect("/");
  }

  // Find the course with the given id
  const course = await db.course.findUnique({
    where: {
      id: params.courseId, // find the course with the given id
      userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc", // order the chapters by position in ascending order
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  // Query the database for the categories
  // -- this is used to populate the select input for the category field
  // -- create a scripts folder at the root of the project and add a seed.ts file to populate the database with categories
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc", // order the categories by name in ascending order
    },
  });

  if (!course) {
    return redirect("/"); // if there is no course with that id, redirect to courses page
  }

  // List the required fields for creating the course
  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished), // check if any of the chapters are published, at least one chapter must be published
  ];

  const totalRequiredFields = requiredFields.length; // total number of required fields
  const completedRequiredFields = requiredFields.filter(Boolean).length; // filter out the empty fields
  const completed = `(${completedRequiredFields}/${totalRequiredFields})`; // ratio of completed fields

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course Setup</h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completed}{" "}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize Your Course</h2>
          </div>
          <TitleForm
            initialData={course} // pass in the initialData prop to the TitleForm component
            courseId={course.id}
          />
          <DescriptionForm initialData={course} courseId={course.id} />
          <ImageForm initialData={course} courseId={course.id} />
          <CategoryForm
            initialData={course}
            courseId={course.id}
            options={categories.map((category) => ({
              // map over the categories and return an object with the label and value
              label: category.name,
              value: category.id,
            }))}
          />
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">Course Chapters</h2>
            </div>
            <ChaptersForm initialData={course} courseId={course.id} />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className="text-xl">Sell Your Course</h2>
            </div>
            <PriceForm initialData={course} courseId={course.id} />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-xl">Resources and Attachments</h2>
            </div>
            <AttachmentForm initialData={course} courseId={course.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;
