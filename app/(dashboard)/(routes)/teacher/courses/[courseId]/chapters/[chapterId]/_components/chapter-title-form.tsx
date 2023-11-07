"use client";

import * as z from "zod";
import toast from "react-hot-toast";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tooltip } from "react-tooltip";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";

// create the form schema
const formSchema = z.object({
  title: z.string().min(1),
});

// create the form types
interface ChapterTitleFormProps {
  chapter: {
    title: string;
  };
  courseId: string;
  chapterId: string;
}

const ChapterTitleForm = ({ chapter, courseId, chapterId }: ChapterTitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  // toggle function to switch between editing and not editing
  const toggleEditing = () => {
    setIsEditing((current) => !current);
  };

  // useForm hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // use zod to validate the form
    defaultValues: chapter, // set the default values of the form to the chapter
  });

  // extract the isSumitting and isValid properties from the form
  const { isSubmitting, isValid } = form.formState;


  // create an onSubmit handler function
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // patch the chapter with the new title ********
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values); 
      toast.success("Chapter title updated!");
      toggleEditing(); // toggle the editing state
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
         Chapter Title
        <Button variant="ghost" onClick={toggleEditing}>
        {isEditing ? (
            <>Cancel</>  // if editing, show the cancel button
          ) : (
            <>
                <button
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Edit title"
                data-tooltip-place="top"
              >
                <Pencil className="h-4 w-4 mr-2" />
              </button><Tooltip id="my-tooltip" />
            </>
          )}
        </Button>
      </div>
      {/* if not editing, show the title */}
      {!isEditing && <p className="text-sm mt-2">{chapter.title}</p>}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. Introduction to the Course"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ChapterTitleForm;



// onSubmit ********
// This code is using the Axios library to send a PATCH request to the server to update a specific chapter title in a course.

// The axios.patch method is called with a URL string as its first argument, which is constructed using template literals to include the courseId and chapterId variables. This URL string specifies the endpoint on the server that should handle the PATCH request.

// The values object is passed as the second argument to the axios.patch method. This object contains the new values to be set for the chapter title. The axios.patch method will serialize this object as JSON and include it in the request body.

// The await keyword is used to wait for the response from the server before continuing execution of the code. The response from the server is not used in this code, but it could be used to handle errors or update the UI with the new chapter title.

// Overall, this code is used to update the title of a specific chapter in a course by sending a PATCH request to the server with the new title data.