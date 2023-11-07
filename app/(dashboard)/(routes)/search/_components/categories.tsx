"use client";

import { Category } from "@prisma/client";
import {
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
  FcAdvertising,
} from "react-icons/fc";

import { IconType } from "react-icons";
import CategoryItem from "./category-item";


// CategoriesProps is an object type that has a property, items, that is an array of Category objects
interface CategoriesProps { 
  items: Category[];
}

// Record is a utility type that takes two arguments, a string and a type, and constructs an object type whose property keys are taken from the string and whose property values are taken from the type.
const iconMap: Record<Category["name"], IconType> = {
  "Music": FcMusic,
  "Photography": FcOldTimeCamera,
  "Fitness": FcSportsMode,
  "Accounting": FcSalesPerformance,
  "Computer Science": FcMultipleDevices,
  "Filming": FcFilmReel,
  "Engineering": FcEngineering,
  "Marketing": FcAdvertising,
};


 const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id} // value is the id of the category
        />
      ))}
    </div>
  );
};

export default Categories;