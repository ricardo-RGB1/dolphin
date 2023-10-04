import { LucideIcon } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// create background variants for the icon badge (color and size)
const backgroundVariants = cva(
    "rounded-full flex items-center justify-center",
    {
        variants: {
            variant: {
                default: "bg-sky-100",
                success: "bg-emerald-100",
            },
            size: {
                default: 'p-2',
                sm: 'p-1',
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        }
    }

);

// create variants for the icon itself (color and size)
const iconVariants = cva(
    "",
    {
        variants: {
            variant: {
                default: "text-sky-700",
                success: "text-emerald-700",
            },
            size: {
                default: 'w-8 h-8',
                sm: 'w-4 h-4',
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        }
    }
)

// write types using the cva variables above
type BackgroundVariantsProps = VariantProps<typeof backgroundVariants>;
type IconVariantsProps = VariantProps<typeof iconVariants>;



// create an interface that extends the types above
interface IconBadgeProps extends BackgroundVariantsProps, IconVariantsProps {
    icon: LucideIcon;
}


// Now create the component that returns the classnames based on the variants
export const IconBadge = ({
    icon: Icon,
    size,
    variant,
}: IconBadgeProps) => {
    return (
        <div className={cn(backgroundVariants({ variant, size }))}>
            <Icon className={cn(iconVariants({ variant, size }))} />
        </div>
    )
}