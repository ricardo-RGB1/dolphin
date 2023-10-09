"use client";

import * as z from "zod";
import toast from "react-hot-toast";
import axios from "axios";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tooltip } from "react-tooltip";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { Course } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

// create the form schema
const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

// create the form types
interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  // toggle function to switch between editing and not editing
  const toggleEditing = () => {
    setIsEditing((current) => !current);
  };

  // create an onSubmit handler function
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values); // send a PATCH request to the /api/courses/:courseId endpoint with the form values
      toast.success("Course image updated");
      toggleEditing(); // toggle the editing state
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Image
        <Button variant="ghost" onClick={toggleEditing}>
          {isEditing && <>Cancel</>}

          {!isEditing &&
            !initialData.imageUrl && ( // if not editing and there is no imageUrl
              <>
                <button
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Add an image"
                  data-tooltip-place="top"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                </button>
                <Tooltip id="my-tooltip" />
              </>
            )}

          {!isEditing &&
            initialData.imageUrl && ( // if not editing but there is an imageUrl
              <>
                <button
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Add an image"
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
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={initialData.imageUrl}
            />
          </div>
        ))}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage" // pass in the endpoint prop from the FileUpload component
            onChange={(url) => { // when the upload is complete, call the onChange function with the url
              if (url) {
                onSubmit({ imageUrl: url }); // call the onSubmit function with the url
              }
            }}
          />
          <div className="text-sm text-muted-foreground mt-4">
            16:9 aspect ratio recommended.
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageForm;
