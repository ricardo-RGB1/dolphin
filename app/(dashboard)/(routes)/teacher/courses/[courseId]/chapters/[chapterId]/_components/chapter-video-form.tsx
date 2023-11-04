"use client";

import * as z from "zod";
import toast from "react-hot-toast";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tooltip } from "react-tooltip";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { Chapter, MuxData } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

// create the form schema
const formSchema = z.object({
  videoUrl: z.string().min(1), 
});

// create the form types
interface ChapterVideoFormProps {
  chapter: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const ChapterVideoForm = ({ chapter, courseId, chapterId }: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  // toggle function to switch between editing and not editing
  const toggleEditing = () => {
    setIsEditing((current) => !current);
  };

  // create an onSubmit handler function
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values); // patch the chapter with the values
      toast.success("Video updated!");
      toggleEditing(); // toggle the editing state
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Video
        <Button variant="ghost" onClick={toggleEditing}>
          {isEditing && <>Cancel</>}

          {!isEditing &&
            !chapter.videoUrl && ( // if not editing and there is no videoUrl
              <>
                <button
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Add a video"
                  data-tooltip-place="top"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                </button>
                <Tooltip id="my-tooltip" />
              </>
            )}

          {!isEditing &&
            chapter.videoUrl && ( // if not editing but there is an videoUrl
              <>
                <button
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Edit video"
                  data-tooltip-place="top"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                </button>
                <Tooltip id="my-tooltip" />
              </>
            )}
        </Button>
      </div>

      {/* When not editing, render an icon or image depending if there is an imageUrl */}
      {!isEditing &&
        (!chapter.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer playbackId={chapter?.muxData?.playbackId || ""} />
          </div>
        ))}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => { 
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-sm text-muted-foreground mt-4"> 
            Upload this chapter video.
          </div>
        </div>
      )}
       {/* if there is a video and not editing, show message */}
      {!isEditing && chapter.videoUrl && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if video does not appear.
        </div>
      )}
    </div>
  );
};

export default ChapterVideoForm;
