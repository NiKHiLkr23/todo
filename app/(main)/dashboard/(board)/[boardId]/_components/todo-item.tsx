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
          className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm"
        >
          {data.title}
        </div>
      )}
    </Draggable>
  );
};
