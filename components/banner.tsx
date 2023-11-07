import { AlertTriangle, CheckCircleIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";


import { cn } from "@/lib/utils";

const bannerVariants = cva(
    "border text-center p-4 text-sm flex items-center w-full",
    {
        variants: {
            variant: {
                warning: "bg-yellow-200/80 border-yellow-30 text-primary",
                success: "bg-emerald-700 border-emerald-700 text-secondary",
            }
        },
        defaultVariants: {
            variant: "warning",
        }
    }
); 

interface BannerProps extends VariantProps<typeof bannerVariants> {
    label: string;
}

// Create an icon map
const iconMap = {
    warning: AlertTriangle, // if variant is warning, use the AlertTriangle icon
    success: CheckCircleIcon, // if variant is success, use the CheckCircleIcon icon
}

const Banner = ({
    label,
    variant,
}: BannerProps ) => {
  // if variant is undefined, use warning as the default
  const Icon = iconMap[variant || "warning"];

  return (
    // Use the bannerVariants function to get the className
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </div>
  );
}
 
export default Banner;