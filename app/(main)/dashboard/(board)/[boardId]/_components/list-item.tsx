"use client";

import { ListWithTodos } from "@/types";
import { ListHeader } from "./list-header";
import { ElementRef, useEffect, useRef, useState } from "react";
import { TodoForm } from "./todo-form";
import { cn } from "@/lib/utils";
import { TodoItem } from "./todo-item";

interface ListItemProps {
  data: ListWithTodos;
  index: number;
}

export const ListItem = ({ data, index }: ListItemProps) => {
  const textareaRef = useRef<ElementRef<"textarea">>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [todos, setTodos] = useState([]);

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  useEffect(() => {
    const fetData = async () => {
      const response = await fetch(
        `http://localhost:3000/api/todos/${data.id}`
      );
      const todos = await response.json();
      console.log(todos);
      setTodos(todos);
    };
    fetData();
  }, [data.id]);
  return (
    <li className="shrink-0 h-full w-[272px] select-none ">
      <div className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2 ">
        <ListHeader data={data} onAddTodo={enableEditing} />
        <ol
          className={cn(
            "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
            todos?.length > 0 ? "mt-2" : "mt-0"
          )}
        >
          {todos?.map((todo, index) => (
            <TodoItem index={index} key={index} data={todo} />
          ))}
        </ol>
        <TodoForm
          listId={data.id}
          ref={textareaRef}
          isEditing={isEditing}
          enableEditing={enableEditing}
          disableEditing={disableEditing}
        />
      </div>
    </li>
  );
};
