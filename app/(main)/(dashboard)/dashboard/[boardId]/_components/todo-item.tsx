"use client";

import { useTodoModal } from "@/lib/hooks/use-todo-modal";
import { Todo } from "@/lib/utils/xata";
import { Draggable } from "@hello-pangea/dnd";

interface TodoItemProps {
  data: Todo;
  index: number;
}

export const TodoItem = ({ data, index }: TodoItemProps) => {
  const todoModal = useTodoModal();

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          onClick={() => todoModal.onOpen(data.id)}
          className="truncate border-2 border-black/20 hover:border-black/60 active:text-slate-900 dark:active:text-gray-300 dark:active:bg-black/80 active:scale-95 py-2 px-3 text-sm bg-gray-100 dark:hover:border-gray-400/60 dark:bg-black/20 rounded-md shadow-sm"
        >
          {data.title}
        </div>
      )}
    </Draggable>
  );
};
