"use client";

import { Todo } from "@/lib/utils/xata";

interface TodoItemProps {
  data: Todo;
  index: number;
}

export const TodoItem = ({ data, index }: TodoItemProps) => {
  // const cardModal = useCardModal();

  return (
    <div
      // {...provided.draggableProps}
      // {...provided.dragHandleProps}
      // ref={provided.innerRef}
      role="button"
      // onClick={() => cardModal.onOpen(data.id)}
      className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm"
    >
      {data.title}
    </div>
  );
};
