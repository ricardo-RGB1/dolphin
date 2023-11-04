"use client";

import * as z from "zod";
import toast from "react-hot-toast";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Tooltip } from "react-tooltip";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Chapter } from "@prisma/client";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";

// create the form schema
const formSchema = z.object({
  description: z.string().min(1),
});

// create the form types
interface ChapterDescriptionFormProps {
  chapter: Chapter;
  courseId: string;
  chapterId: string;
}

const ChapterDescriptionForm = ({
  chapter,
  courseId,
  chapterId,
}: ChapterDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  // toggle function to switch between editing and not editing
  const toggleEditing = () => {
    setIsEditing((current) => !current);
  };

  // useForm hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // use zod to validate the form
    defaultValues: {
      description: chapter?.description || "",
    },
  });

  // extract the isSumitting and isValid properties from the form
  const { isSubmitting, isValid } = form.formState;

  // create an onSubmit handler function
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      ); // send a PATCH request to the /api/courses/:courseId endpoint with the form values
      toast.success("Chapter updated!");
      toggleEditing(); // toggle the editing state
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Description
        <Button variant="ghost" onClick={toggleEditing}>
          {isEditing ? (
            <>Cancel</> // if editing, show the cancel button
          ) : (
            <>
              <button
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Edit description"
                data-tooltip-place="top"
              >
                <Pencil className="h-4 w-4 mr-2" />
              </button>
              <Tooltip id="my-tooltip" />
            </>
          )}
        </Button>
      </div>

      {/* if not editing, show the title */}
      {!isEditing && ( // if not editing
        <div
          className={cn(
            "text-sm mt-2",
            !chapter.description && "text-slate-500 italic"
          )}
        >
          {!chapter.description || "No description"}
          {/* // if there is a description show the preview */}
          {chapter.description && (
            <Preview value={chapter.description} />
          )}
        </div>
      )}

      {isEditing && (                                 
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor {...field} />
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

export default ChapterDescriptionForm;
