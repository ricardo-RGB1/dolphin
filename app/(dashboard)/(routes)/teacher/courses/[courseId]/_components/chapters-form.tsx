"use client";

import * as z from "zod";
import toast from "react-hot-toast";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Tooltip } from "react-tooltip";
import  ChaptersList  from "./chapters-list";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle } from "lucide-react";
import { Course, Chapter } from "@prisma/client";
import { Input } from "@/components/ui/input";

// create the form schema
const formSchema = z.object({
  title: z.string().min(1), // the title field is required
});

// create the form types
interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] }; // the initial data is a Course object with a chapters property of type Chapter[]
  courseId: string;
}

const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
  const [isCreating, setIsCreating] = useState(false); // create a state to keep track of whether the user is creating a new chapter or not
  const [isUpdating, setIsUpdating] = useState(false);

  const router = useRouter();

  // create a toggleCreating function to toggle the isCreating state
  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  // useForm hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // use zod to validate the form
    defaultValues: {
      title: "", //
    },
  });

  // extract the isSumitting and isValid properties from the form
  const { isSubmitting, isValid } = form.formState;

  // create an onSubmit handler function
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values); // post the values to the api endpoint
      toast.success("Chapter created!");
      toggleCreating(); // toggle the editing state
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // create an onReorder handler function
  // updateData is an array of objects with an id and position property
  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {list: updateData}); // put the updateData to the api endpoint
      router.refresh(); 
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  }


  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapters
        <Button variant="ghost" onClick={toggleCreating}>
          {isCreating ? (
            <>Cancel</> // if creating, show the cancel button
          ) : (
            <>
              <button
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Add a chapter"
                data-tooltip-place="top"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
              </button>
              <Tooltip id="my-tooltip" />
            </>
          )}
        </Button>
      </div>

      {isCreating && ( // if creating is true
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
                      placeholder="e.g. Chapter 1: Introduction"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}

      {/* if not creating... */}
      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.chapters.length && "text-slate-500 italic"
          )}
        >
          {!initialData.chapters.length && "No chapters yet"}
          <ChaptersList 
            onEdit={() => {}}
            onReorder={onReorder}
            items={initialData.chapters || []}
          />
        </div>
      )}

  
      {!isCreating && ( // if not creating
        <p className="text-sm text-muted-foreground mt-4">
          Drag and drop to reorder the chapters.
        </p>
      )}
    </div>
  );
};

export default ChaptersForm;
