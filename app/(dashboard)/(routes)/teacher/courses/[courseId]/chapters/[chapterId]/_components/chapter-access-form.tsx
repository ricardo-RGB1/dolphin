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
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Chapter } from "@prisma/client";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { Checkbox } from "@/components/ui/checkbox";

// create the form schema
const formSchema = z.object({
  isFree: z.boolean().default(false), // add the isFree field to the form schema
});

// create the form types
interface ChapterAccessFormProps {
  chapter: Chapter;
  courseId: string;
  chapterId: string;
}

const ChapterAccessForm = ({
  chapter,
  courseId,
  chapterId,
}: ChapterAccessFormProps) => {
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
      isFree: !!chapter.isFree, // set the default value of isFree to a boolean value
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
      toast.success("Access updated!");
      toggleEditing(); // toggle the editing state
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Access
        <Button variant="ghost" onClick={toggleEditing}>
          {isEditing ? (
            <>Cancel</> // if editing, show the cancel button
          ) : (
            <>
              <button
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Edit access"
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
        <p
          className={cn(
            "text-sm mt-2",
            !chapter.isFree && "text-slate-500 italic"
          )}
        >
          {chapter.isFree ? ( // if isFree is true
            <>This chapter is free for preview</>
          ) : (
            <>This chapter is not free.</>
          )
          }
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription>
                      Check this box if you want to make this chapter free for preview
                    </FormDescription>
                  </div>
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

export default ChapterAccessForm;
