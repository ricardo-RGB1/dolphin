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
import { Course } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";

// create the form types
interface CategoryFormProps {
  initialData: Course;
  courseId: string;
  options: { label: string; value: string }[]; // the options for the select input
}

// create the form schema using zod to validate the form fields. It should have a categoryId field that is a string with a minimum length of 1
const formSchema = z.object({
  categoryId: z.string().min(1),
});

const CategoryForm = ({
  initialData,
  courseId,
  options,
}: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  // toggle function to switch between editing and not editing
  const toggleEditing = () => {
    setIsEditing((current) => !current);
  };

  // create the form using react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    // the form data object should match the form schema
    resolver: zodResolver(formSchema), // use zod to validate the form
    defaultValues: {
      categoryId: initialData?.categoryId || "", // set the default value of the categoryId field to the initialData.categoryId or an empty string
    },
  });

  // extract the isSumitting and isValid properties from the form
  const { isSubmitting, isValid } = form.formState;

  // create an onSubmit handler function
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values); // send a PATCH request to the /api/courses/:courseId endpoint with the form values
      toast.success("Description updated!");
      toggleEditing(); // toggle the editing state
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // find the selected option from the options array
  // -- the selected option is the option with the same value as the initialData.categoryId
  const selectedOption = options.find(
    (option) => option.value === initialData.categoryId
  );

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Category
        <Button variant="ghost" onClick={toggleEditing}>
          {isEditing ? (
            <>Cancel</> // if editing, show the cancel button
          ) : (
            <>
              <button
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Edit category"
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
            !initialData.categoryId && "text-slate-500 italic"
          )}
        >
          {selectedOption?.label || "No category selected"}
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
              name="categoryId" // the name of the field in the form data object
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      {...field} // pass in the field object
                      options={options} // pass in the options array
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

export default CategoryForm;
