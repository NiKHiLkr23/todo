"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { getXataClient } from "@/lib/utils/xata";
import { CopyTodo } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();
  const xataClient = getXataClient();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;
  let todo;

  try {
    const todoToCopy = await xataClient.db.Todo.filter({
      id: id,
    }).getFirst();

    if (!todoToCopy) {
      return { error: "List not found" };
    }

    const lastTodo = await xataClient.db.Todo.select(["order", "title"])
      .filter({
        list: todoToCopy.list?.id,
      })
      .sort("order", "desc")
      .getFirst();

    const newOrder = lastTodo ? lastTodo.order! + 1 : 1;

    todo = await xataClient.db.Todo.create({
      title: `${todoToCopy.title} - Copy`,
      list: todoToCopy.list,
      order: newOrder,
      description: todoToCopy.description,
      isCompleted: todoToCopy.isCompleted,
    });

    await createAuditLog({
      entityTitle: todo.title,
      entityId: todo.id,
      entityType: "TODO",
      action: "CREATE",
      boardId: boardId,
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to copy.",
    };
  }

  revalidatePath(`/dashboard/${boardId}`);
  return { data: JSON.parse(JSON.stringify(todo)) };
};

export const copyTodo = createSafeAction(CopyTodo, handler);
