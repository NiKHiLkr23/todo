"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useAction } from "@/lib/hooks/use-action";
import { ListWithTodos } from "@/types";
import { ListWrapper } from "./list-wrapper";
import { ListForm } from "./list-form";
import { ListItem } from "./list-item";

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
  // const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
  //   onSuccess: () => {
  //     toast.success("List reordered");
  //   },
  //   onError: (error) => {
  //     toast.error(error);
  //   },
  // });

  // const { execute: executeUpdateTodoOrder } = useAction(updateTodoOrder, {
  //   onSuccess: () => {
  //     toast.success("Todo reordered");
  //   },
  //   onError: (error) => {
  //     toast.error(error);
  //   },
  // });

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  console.log("list data", data);

  return (
    <ol className="flex gap-x-3 h-full">
      {orderedData.map((list, index) => {
        return <ListItem key={list.id} index={index} data={list} />;
      })}
      <ListForm />
    </ol>
  );
};
