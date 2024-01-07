"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";

import { CreateTodo } from "./schema";
import { InputType, ReturnType } from "./types";
import { getXataClient } from "@/lib/utils/xata";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();
  const xataClient = getXataClient();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, boardId, listId } = data;
  let todo;

  try {
    const list = await xataClient.db.List.filter({
      id: listId,
    }).getFirst();

    if (!list) {
      return {
        error: "List not found",
      };
    }
    const lastTodo = await xataClient.db.Todo.select(["order", "title"])
      .filter({
        list: listId,
      })
      .sort("title", "desc")
      .getFirst();

    const newOrder = lastTodo ? lastTodo.order! + 1 : 1;

    todo = await xataClient.db.Todo.create({
      title,
      list: listId,
      order: newOrder,
    });

    await createAuditLog({
      entityId: todo.id,
      entityTitle: todo.title,
      entityType: "TODO",
      action: "CREATE",
      boardId: boardId,
    });
  } catch (error) {
    return {
      error: "Failed to create.",
    };
  }

  revalidatePath(`/dashboard/${boardId}`);
  return { data: JSON.parse(JSON.stringify(todo)) };
};

export const createTodo = createSafeAction(CreateTodo, handler);
