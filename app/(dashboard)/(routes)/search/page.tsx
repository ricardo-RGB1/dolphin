import { db } from "@/lib/db";
import Categories from "./_components/categories";
import SearchInput from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import CoursesList from "@/components/courses-list";


// query parameters can be accessed in the server component props.
interface SearchPageProps {
  searchParams: {
    title: string;
    category: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  // db.category.findMany function returns a promise that resolves to an array of categories ordered by name in ascending order
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // getCourses function returns a promise that resolves to an array of courses
  const courses = await getCourses({
    userId,
    ...searchParams,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-5">
        <Categories items={categories} />
        <CoursesList courses={courses} /> 
      </div>
    </>
  );
};

export default SearchPage;
