import { LucideIcon } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";

interface InfoCardProps {
  numberOfItems: number;
  variant?: "default" | "success";
  label: string;
  icon: LucideIcon;
}

/**
 * Renders an info card component with an icon, label, and number of items.
 * @param variant - The variant of the icon badge.
 * @param icon - The icon component to display.
 * @param numberOfItems - The number of items to display.
 * @param label - The label to display.
 * @returns A React component representing the info card.
 */
export const InfoCard = ({
    variant,
    icon: Icon,
    numberOfItems,
    label,
}: InfoCardProps) => {
    return (
        <div className="border rounded-md flex items-center gap-x-2 p-3">
            <IconBadge variant={variant} icon={Icon} />
            <div>
                <p className="font-medium">{label}</p>
                <p className="text-gray-500 text-sm">
                    {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
                </p>
            </div>
        </div>
    );
};
