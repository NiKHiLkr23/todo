"use client";

import { ListWithTodos } from "@/types";
import { ListHeader } from "./list-header";
import { ElementRef, useEffect, useRef, useState } from "react";
import { TodoForm } from "./todo-form";
import { cn } from "@/lib/utils";
import { TodoItem } from "./todo-item";
import { Draggable, Droppable } from "@hello-pangea/dnd";

interface ListItemProps {
  data: ListWithTodos;
  index: number;
}

export const ListItem = ({ data, index }: ListItemProps) => {
  const textareaRef = useRef<ElementRef<"textarea">>(null);

  const [isEditing, setIsEditing] = useState(false);

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 h-full w-full md:w-[272px] select-none "
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md bg-[#f1f2f4] dark:bg-black/60 shadow-md pb-2 "
          >
            <ListHeader data={data} onAddTodo={enableEditing} />
            <Droppable droppableId={data.id} type="todo">
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                    data?.todos?.length > 0 ? "mt-2" : "mt-0"
                  )}
                >
                  {data?.todos?.map((todo, index) => (
                    <TodoItem index={index} key={index} data={todo} />
                  ))}
                </ol>
              )}
            </Droppable>
            <TodoForm
              listId={data.id}
              ref={textareaRef}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
};
