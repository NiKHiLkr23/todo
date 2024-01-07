"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

import { useAction } from "@/lib/hooks/use-action";
import { ListWithTodos } from "@/types";
import { ListWrapper } from "./list-wrapper";
import { ListForm } from "./list-form";
import { ListItem } from "./list-item";
import { updateListOrder } from "@/actions/update-list-order";
import { updateTodoOrder } from "@/actions/update-todo-order";

interface ListContainerProps {
  data: ListWithTodos[];
  boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);
  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success("List reordered");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeUpdateTodoOrder } = useAction(updateTodoOrder, {
    onSuccess: () => {
      toast.success("Todo reordered");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    // if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    // User moves a list
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );

      setOrderedData(items);
      executeUpdateListOrder({ items, boardId });
    }

    // User moves a todo
    if (type === "todo") {
      let newOrderedData = [...orderedData];

      // Source and destination list
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destList) {
        return;
      }

      // Check if todos exists on the sourceList
      if (!sourceList.todos) {
        sourceList.todos = [];
      }

      // Check if todos exists on the destList (destination_List)
      if (!destList.todos) {
        destList.todos = [];
      }

      // Moving the todo in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedTodos = reorder(
          sourceList.todos,
          source.index,
          destination.index
        );

        reorderedTodos.forEach((todo, idx) => {
          todo.order = idx;
        });

        sourceList.todos = reorderedTodos;

        setOrderedData(newOrderedData);
        //eslint-disable
        executeUpdateTodoOrder({
          items: reorderedTodos,
          boardId: boardId,
        });
        // User moves the todo to another list
      } else {
        // Remove todo from the source list
        const [movedTodo] = sourceList.todos.splice(source.index, 1);

        // Assign the new listId to the moved todo
        if (movedTodo.list) {
          movedTodo.list.id = destination.droppableId;
        }

        // Add todo to the destination list
        destList.todos.splice(destination.index, 0, movedTodo);

        sourceList.todos.forEach((todo, idx) => {
          todo.order = idx;
        });

        // Update the order for each todo in the destination list
        destList.todos.forEach((todo, idx) => {
          todo.order = idx;
        });

        setOrderedData(newOrderedData);
        executeUpdateTodoOrder({
          items: destList.todos,
          boardId: boardId,
        });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, index) => {
              return <ListItem key={list.id} index={index} data={list} />;
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
