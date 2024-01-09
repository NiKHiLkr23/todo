"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { getXataClient } from "@/lib/utils/xata";
import { DeleteTodo } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: InputType): Promise<ReturnType> => {
  const xataClient = getXataClient();
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;
  let todo;

  try {
    todo = await xataClient.db.Todo.delete(id);

    await createAuditLog({
      entityTitle: todo?.title!,
      entityId: todo?.id!,
      entityType: "TODO",
      action: "DELETE",
      boardId: boardId,
      orgId: orgId,
    });
  } catch (error) {
    return {
      error: "Failed to delete.",
    };
  }

  revalidatePath(`/dashboard/${boardId}`);
  return { data: JSON.parse(JSON.stringify(todo)) };
};

export const deleteTodo = createSafeAction(DeleteTodo, handler);
