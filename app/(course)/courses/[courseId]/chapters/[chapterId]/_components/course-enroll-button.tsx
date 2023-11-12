"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import  formatPrice from "@/lib/format";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
}

const CourseEnrollButton = ({
  price,
  courseId,
}: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true); 

      // create a POST request to the checkout session for the course
      const response = await axios.post(`/api/courses/${courseId}/checkout`); // returns a promise

      // Redirect the user to the Stripe checkout page:
      window.location.assign(response.data.url); // JSON object - the url that Stripe returns back
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={isLoading} // if isLoading is true, then the button is disabled
      size="sm"
      className="w-full md:w-auto"
    >
      Enroll for {formatPrice(price)}
    </Button>
  );
};

export default CourseEnrollButton;