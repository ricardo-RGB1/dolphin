"use client";

import qs from "query-string";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const SearchInput = () => {
  const [value, setValue] = useState(""); // for the search input value
  const debouncedValue = useDebounce(value); // debounced value

  const router = useRouter(); // router
  const searchParams = useSearchParams(); // search params
  const pathname = usePathname(); // pathname

  const currentCategoryId = searchParams.get("categoryId"); // current category id

  // useEffect to update the search params
    useEffect(() => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                categoryId: currentCategoryId,
                title: debouncedValue,
            }
        }, { skipEmptyString: true, skipNull: true });

        router.push(url) 
    }, [debouncedValue, currentCategoryId, router, pathname]);


  return (
    <div className="relative">
      <Search className="absolute h-4 w-4 left-3 top-3 text-slate-600" />
      <Input
        onChange={(e) => setValue(e.target.value)} // update the value
        value={value}
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder="Search for a course"
      />
    </div>
  );
};

export default SearchInput;
