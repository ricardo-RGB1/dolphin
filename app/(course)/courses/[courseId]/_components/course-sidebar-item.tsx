"use client";

import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

interface CourseSidebarItemProps {
  label: string;
  id: string;
  isCompleted: boolean;
  courseId: string;
  isLocked: boolean;
}

const CourseSidebarItem = ({
  label,
  id,
  isCompleted,
  courseId,
  isLocked,
}: CourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  // if the chapter is locked, show the Lock icon, if the chapter is completed, show the CheckCircle icon, otherwise show the PlayCircle icon
  // isLocked means it is not free and the user has not purchased the course
  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle;

  const isActive = pathname?.includes(id);

  // when the user clicks on the chapter, navigate to the chapter page
  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive &&
          "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700",
        isCompleted && "text-emerald-700 hover:text-emerald-700",
        isCompleted && isActive && "bg-emerald-200/20"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            "text-slate-500",
            isActive && "text-sky-700",
            isCompleted && "text-emerald-700"
          )}
        />
        {label}
      </div>
      {/* LEFT BORDER INDICATOR */}
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-sky-600 h-full transition-all",
          isActive && "opacity-100",
          isCompleted && "border-emerald-600"
        )}
      />
    </button>
  );
};

export default CourseSidebarItem;