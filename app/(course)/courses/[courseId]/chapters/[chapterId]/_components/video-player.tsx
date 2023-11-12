/**
 * A component that renders a video player using MuxPlayer and handles updating the user's progress
 * when the video ends.
 *
 * @param playbackId - The Mux playback ID for the video.
 * @param courseId - The ID of the course that the video belongs to.
 * @param chapterId - The ID of the chapter that the video belongs to.
 * @param nextChapterId - The ID of the next chapter in the course, if any.
 * @param isLocked - Whether the chapter is locked and the video cannot be played.
 * @param completeOnEnd - Whether to mark the chapter as completed when the video ends.
 * @param title - The title of the video.
 * @returns A React component that renders a video player.
 */
"use client";

import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti-store";


interface VideoPlayerProps {
  playbackId: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
}

const VideoPlayer = ({
  playbackId,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  /**
   * Returns the endpoint for getting the progress of a chapter in a course.
   * @param courseId - The ID of the course.
   * @param chapterId - The ID of the chapter.
   * @returns The endpoint for getting the progress of a chapter in a course.
   */
  const getChapterProgressEndpoint = (courseId: string, chapterId: string) => { 
    return `/api/courses/${courseId}/chapters/${chapterId}/progress`;
  };

  
  const onEnd = async () => {
    try {
      if (completeOnEnd) {
         const endpoint = getChapterProgressEndpoint(courseId, chapterId);
         await axios.put(endpoint, {
           isCompleted: true,
         });

        if (!nextChapterId) {
          confetti.onOpen();
        }

        toast.success("Progress updated");
        router.refresh();

        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && ( // if the video is not ready and the chapter is not locked, show a loader
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && ( // if the chapter is locked, show a lock icon
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && "hidden")} // hide the video player until it's ready
          onCanPlay={() => setIsReady(true)} // set isReady to true when the video is ready
          onEnded={onEnd}
          autoPlay
          playbackId={playbackId}
        />
      )}
    </div>
  );
};


export default VideoPlayer;