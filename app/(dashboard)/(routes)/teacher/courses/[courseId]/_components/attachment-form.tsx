"use client";

import * as z from "zod";
import toast from "react-hot-toast";
import axios from "axios";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tooltip } from "react-tooltip";
import { Button } from "@/components/ui/button";
import { File, ImageIcon, PlusCircle } from "lucide-react";
import { Attachment, Course } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";

// create the form schema
const formSchema = z.object({
  url: z.string().min(1), // the url is a string and is required
});

// create the form types
interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  // toggle function to switch between editing and not editing
  const toggleEditing = () => {
    setIsEditing((current) => !current);
  };

  // create an onSubmit handler function
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values); // post the values to the api
      toast.success("Attachments updated!");
      toggleEditing(); // toggle the editing state
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Attachments
        <Button variant="ghost" onClick={toggleEditing}>
          {isEditing && <>Cancel</>}

          {!isEditing && (
            <>
              <button
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Add a file"
                data-tooltip-place="top"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
              </button>
              <Tooltip id="my-tooltip" />
            </>
          )}
        </Button>
      </div>

      {/* When not editing, render a message, "No attachments" */}
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments yet
            </p>
          )}
          {initialData.attachments.length > 0 && ( // if there are attachments
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => ( // map over the attachments and render a div for each one
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-sm line-clamp-1">{attachment.name}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div>
          <FileUpload // render the file upload component
            endpoint="courseAttachment" // the endpoint to upload the file to
            onChange={(url) => {
              // when the url changes, call the onChange function
              if (url) {
                // if the url exists
                onSubmit({ url: url }); // call the onSubmit function with the url as the value
              }
            }}
          />
          <div className="text-sm text-muted-foreground mt-4">
            Add anything your students might need to complete the course.
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;

// File Upload Component:
// Here's a breakdown of what's happening:

// The FileUpload component is being rendered with the following props:
// endpoint: A string that specifies the endpoint to upload the file to.
// onChange: A function that is called when the URL of the uploaded file changes.
// When the URL of the uploaded file changes, the onChange function is called with the new URL as its argument.
// If the URL exists (i.e., is truthy), the onSubmit function is called with an object that has a url property set to the URL of the uploaded file.
// Overall, this code is setting up a file upload component that will upload a file to a specified endpoint and call a function with the URL of the uploaded file when the upload is complete.
