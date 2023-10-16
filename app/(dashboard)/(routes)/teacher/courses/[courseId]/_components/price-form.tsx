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
import formatPrice from "@/lib/format";
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
import { Input } from "@/components/ui/input";

// create the form schema
const formSchema = z.object({
  price: z.coerce.number(),
});

interface PriceFormProps {
  initialData: Course;
  courseId: string;
}

const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
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
      price: initialData?.price || undefined,
    },
  });

  // extract the isSumitting and isValid properties from the form
  const { isSubmitting, isValid } = form.formState;

  // create an onSubmit handler function
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values); // send a PATCH request to the /api/courses/:courseId endpoint with the form values
      toast.success("Price updated!");
      toggleEditing(); // toggle the editing state
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Price
        <Button variant="ghost" onClick={toggleEditing}>
          {isEditing ? (
            <>Cancel</> // if editing, show the cancel button
          ) : (
            <>
              <button
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Edit price"
                data-tooltip-place="top"
              >
                <Pencil className="h-4 w-4 mr-2" />
              </button>
              <Tooltip id="my-tooltip" />
            </>
          )}
        </Button>
      </div>

      {/* if not editing, show the price */}
      {!isEditing && ( // if not editing
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.price && "text-slate-500 italic"
          )}
        >
          {initialData.price ? formatPrice(initialData.price) : "No price"}
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      disabled={isSubmitting}
                      placeholder="Set a price for your course"
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

export default PriceForm;
