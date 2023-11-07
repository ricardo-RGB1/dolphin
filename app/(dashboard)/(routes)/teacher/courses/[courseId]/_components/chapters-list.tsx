"use client";

import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";
import { Grip, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { Tooltip } from "react-tooltip";

interface ChaptersListProps {
  items: Chapter[];
  onReorder: (updateData: { id: string; position: number }[]) => void; // create an onReorder handler function that takes an updateData object as an argument
  onEdit: (id: string) => void;
}

const ChaptersList = ({ items, onReorder, onEdit }: ChaptersListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);

  // create an useEffect hook to update the chapters state when the items prop changes
  useEffect(() => {
    setChapters(items); // set the chapters state to the items prop
  }, [items]); // the useEffect hook will run when the items prop changes, and update the chapters state,This ensures that the chapters state of the component is always in sync with the items prop.

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // create an onDragEnd handler function
  const onDragEnd = (result: DropResult) => {
    // If the result does not have a destination property, return early
    if (!result.destination) return;

    // Create a copy of the chapters array
    const items = Array.from(chapters);

    // Remove the dragged item from its original position in the array
    const [reorderedItem] = items.splice(result.source.index, 1);

    // Insert the reordered item into its new position in the array
    items.splice(result.destination.index, 0, reorderedItem); // the splice method returns an array containing the removed item, which is assigned to the reorderedItem variable.

    // Calculate the range of items that have been updated in the array
    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    // Create a new array containing only the updated items
    const updatedChapters = items.slice(startIndex, endIndex + 1); // the slice method returns a new array containing only the items between the startIndex and endIndex, inclusive.

    // Update the state of the component with the new array
    setChapters(items);

    // Create an array of updateData objects representing the updated order of the chapters
    const bulkUpdateData = updatedChapters.map((chapter, index) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id),
    }));

    // Call the onReorder function with the updateData array
    onReorder(bulkUpdateData);
  };

  // dont render or display anything if the component is not mounted
  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable
                key={chapter.id}
                draggableId={chapter.id}
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                      chapter.isPublished &&
                        "bg-sky-100 border-sky-200 text-sky-700"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-lg-md transition",
                        chapter.isPublished &&
                          "border-r-sky-200 hover:bg-sky-200"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="w-5 h-5" />
                    </div>
                    {chapter.title}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      {chapter.isFree && (
                        <Badge className="bg-amber-600 hover:bg-amber-600">
                          Free
                        </Badge>
                      )}
                      <Badge
                        className={cn(
                          "bg-slate-500",
                          chapter.isPublished && "bg-sky-700 hover:bg-sky-700"
                        )}
                      >
                        {chapter.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Edit chapter"
                        data-tooltip-place="top"
                      >
                        <Pencil
                          onClick={() => onEdit(chapter.id)}
                          className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                        />
                      </button>
                      <Tooltip id="my-tooltip" />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ChaptersList;

// onDragEnd handler function: **************************************************************
// The onDragEnd handler function in the ChaptersList component is called when the user finishes dragging an item in the list. It takes a result object as its argument, which contains information about the drag-and-drop operation, such as the source and destination indexes of the dragged item.

// The onDragEnd function first checks if the result object has a destination property. If it does not, it returns early, which means that no action is taken.

// If the result object has a destination property, the function creates a copy of the chapters state array using the Array.from method. It then removes the dragged item from its original position in the array using the splice method, and inserts it into its new position using the splice method again.

// The first splice method is used to remove the dragged item from its original position in the array. It takes two arguments: the index of the item to remove (result.source.index) and the number of items to remove (in this case, 1). The splice method returns an array containing the removed item, which is assigned to the reorderedItem variable.

// The second splice method is used to insert the reorderedItem into its new position in the array. It takes three arguments: the index at which to insert the item (result.destination.index), the number of items to remove (in this case, 0), and the item to insert (reorderedItem).

// Together, these two splice methods allow the onDragEnd handler function to update the order of the items in the items array based on the drag-and-drop operation performed by the user.

// The function then calculates the range of items that have been updated in the array, and creates a new array containing only those items using the slice method. The chapters state is updated with the new array using the setChapters function.

// Finally, the function creates an array of updateData objects, where each object represents a chapter that has been moved to a new position in the list. The id property of each updateData object is the ID of the chapter being moved, and the position property is the new position of the chapter in the list. This array is passed to the onReorder prop of the component, which is responsible for handling the reordering of items in the list.
// *****************************************************************************************

// onReorder handler function:
// the updateData object (plain JavaScript object) is used in the onReorder handler function of a React component. The onReorder handler function takes an array of updateData objects as its argument, where each object represents a chapter that has been moved to a new position in the list. The id property of each updateData object is the ID of the chapter being moved, and the position property is the new position of the chapter in the list. It's a common pattern in React applications for handling drag-and-drop functionality or reordering of items in a list.

// when the 'use client' directive is used, that does not mean the server side rendering is skipped. The 'use client' still runs on the server, and then again executed on the client side, which can cause hydration errors. The hydration issues emerge from the drag and drop feature, which is not optimized by the server side rendering.

// hydration erros is when the server-rendered HTML doesn't match the client-rendered HTML. This can happen when the server renders a component with data that is different from the data that the client renders the component with. For example, if the server renders a component with an empty array of chapters, but the client renders the component with a non-empty array of chapters, then the server-rendered HTML will be different from the client-rendered HTML. This can cause hydration errors.
