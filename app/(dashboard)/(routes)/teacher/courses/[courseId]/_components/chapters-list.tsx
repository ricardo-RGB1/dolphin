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

interface ChaptersListProps {
  items: Chapter[];
  onReorder: (updateData: { id: string; position: number }[]) => void; // create an onReorder handler function that takes an updateData object as an argument
  onEdit: (id: string) => void;
}

const ChaptersList = ({ items, onReorder, onEdit }: ChaptersListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    // create an useEffect hook to update the chapters state when the items prop changes
    setChapters(items); // set the chapters state to the items prop
  }, [items]); // the useEffect hook will run when the items prop changes, and update the chapters state,This ensures that the chapters state of the component is always in sync with the items prop.

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // dont render or display anything if the component is not mounted
  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={() => {}}>
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
                        <Badge>
                          Free
                        </Badge>
                      )}
                      <Badge
                        className={cn(
                          "bg-slate-500",
                          chapter.isPublished && "bg-sky-700"
                        )}
                      >
                        {chapter.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <Pencil onClick={() => onEdit(chapter.id)} className="w-4 h-4 cursor-pointer hover:opacity-75 transition"/>
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

// onReorder handler function:
// the updateData object (plain JavaScript object) is used in the onReorder handler function of a React component. The onReorder handler function takes an array of updateData objects as its argument, where each object represents a chapter that has been moved to a new position in the list. The id property of each updateData object is the ID of the chapter being moved, and the position property is the new position of the chapter in the list. It's a common pattern in React applications for handling drag-and-drop functionality or reordering of items in a list.

// when the 'use client' directive is used, that does not mean the server side rendering is skipped. The 'use client' still runs on the server, and then again executed on the client side, which can cause hydration errors. The hydration issues emerge from the drag and drop feature, which is not optimized by the server side rendering.

// hydration erros is when the server-rendered HTML doesn't match the client-rendered HTML. This can happen when the server renders a component with data that is different from the data that the client renders the component with. For example, if the server renders a component with an empty array of chapters, but the client renders the component with a non-empty array of chapters, then the server-rendered HTML will be different from the client-rendered HTML. This can cause hydration errors.
