"use client";

import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  completed?: boolean;
  nextChapterId?: string;
}

const CourseProgressButton = ({
  chapterId,
  courseId,
  completed,
  nextChapterId,
}: CourseProgressButtonProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.put(
        // update the progress
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        {
          completed: !completed, // json body with the opposite of the current completed value
        }
      );

      // Reach the end of the course: 
      // if the chapter is not completed and there is no next chapter, trigger the confetti
      if (!completed && !nextChapterId) {
        confetti.onOpen();
      }

      // if the chapter is not completed and there is a next chapter, redirect to the next chapter
      if (!completed && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }
      toast.success("Progress updated");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // if the chapter is completed, render the XCircle icon, else render the CheckCircle icon
  const Icon = completed ? XCircle : CheckCircle;

  return (
    <Button
      onClick={onClick}
      disabled={isLoading} // disable the button when the progress is updating
      type="button"
      variant={completed ? "outline" : "success"}
      className="w-full md:w-auto"
    >
      {completed ? "Mark as not completed" : "Mark as complete"} 
      <Icon className="h-4 w-4 ml-2" />
    </Button>
  );
};

export default CourseProgressButton;