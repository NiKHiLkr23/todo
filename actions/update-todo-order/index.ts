"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { getXataClient } from "@/lib/utils/xata";
import { UpdateTodoOrder } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();
  const xata = getXataClient();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }
  const { items, boardId } = data;
  let updatedTodos;

  try {
    const transaction = items.map((todo) => {
      return {
        update: {
          table: "Todo",
          id: todo.id,
          fields: { order: todo.order, list: todo?.list?.id },
        },
      };
    });

    updatedTodos = await xata.transactions.run(
      JSON.parse(JSON.stringify(transaction))
    );
  } catch (error) {
    return {
      error: "Failed to reorder.",
    };
  }

  revalidatePath(`/dashboard/${boardId}`);
  return { data: JSON.parse(JSON.stringify(updatedTodos)) };
};

export const updateTodoOrder = createSafeAction(UpdateTodoOrder, handler);
