'use client';

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";


interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    href: string;
}


const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
    const pathName = usePathname();
    const router = useRouter();


    // isActive is a boolean that determines whether or not the sidebar item is active.
    const isActive =
        (pathName === "/" && href === "/") ||
        pathName === href ||
        pathName?.startsWith(`${href}/`);

    const onClick = () => {
        router.push(href);
    }

    return (
        <button onClick={onClick} type='button' className={cn("flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20", isActive && 'text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700')}>
            <div className="flex items-center gap-x-2 py-4">
                <Icon size={22} className={cn("text-slate-500", isActive && "text-sky-700")} />
                {label}
            </div>
            <div className={cn("ml-auto opacity-0 border-2 border-sky-600 h-full transition-all", isActive && 'opacity-100')} />
        </button>
    )
}

export default SidebarItem;

//*********************************** */

/* isActive:
1. If the current path is the root path ("/") and the href of the sidebar item is also the root path, then the item is active.
2. If the current path matches the href of the sidebar item exactly, then the item is active.
3. If the current path starts with the href of the sidebar item followed by a forward slash (/), then the item is active.
*/


// icon: Icon is for using the Icon as a component inside the SidebarItem component.