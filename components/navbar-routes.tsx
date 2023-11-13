'use client';

import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import SearchInput from "./search-input";
import { isTeacher } from "@/lib/teacher";


const NavbarRoutes = () => {
    const { userId } = useAuth();
    const pathName = usePathname();

    const isTeacherPage = pathName?.startsWith('/teacher'); 
    const isCoursePage = pathName?.includes('/courses');
    const isSearchPage = pathName?.startsWith('/search'); // 

    return (
      <>
        {isSearchPage && (
          <div className="hidden md:block">
            <SearchInput />
          </div>
        )}
        <div className="flex gap-x-2 ml-auto">
          {isTeacherPage || isCoursePage ? ( // If the current page is a teacher or course page, render a Link component that points to the root URL ("/") and contains a Button component with a LogOut icon and the text "Exit"
            <Link href="/">
              <Button size="sm" variant="ghost">
                <LogOut className="h-4 w-4 mr-2" />
                Exit
              </Button>
            </Link>
          ) : isTeacher(userId) ? (
            // If the current page is not a teacher or course page, render a Link component that points to the teacher courses page
            <Link href="/teacher/courses">
              <Button size="sm" variant="outline">
                Teacher Mode
              </Button>
            </Link>
          ) : // If the current user is not a teacher, render nothing 
          null }
          <UserButton afterSignOutUrl="/" />
        </div>
      </>
    );
}

export default NavbarRoutes;