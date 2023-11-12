import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CourseProgressProps {
  value: number;
  variantColor?: "default" | "success"; 
  size?: "default" | "sm";
}

// define the color for each variant
const colorByVariant = { 
  default: "text-slate-600", // default is blue
  success: "text-emerald-600", // success is green
};

// define the size for each variant
const sizeByVariant = {
  default: "text-sm", // default is small
  sm: "text-xs", // sm is extra small
};


const CourseProgress = ({
  value,
  variantColor,
  size,
}: CourseProgressProps) => {
  return (
    <div>
      <Progress className="h-2" value={value} variant={variantColor} />
      <p
        className={cn(
          "font-medium mt-2 text-sky-700",
          colorByVariant[variantColor || "default"], 
          sizeByVariant[size || "default"]
        )}
      >
        {Math.round(value)}% Complete
      </p>
    </div>
  );
};

export default CourseProgress;