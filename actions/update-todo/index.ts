"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { getXataClient } from "@/lib/utils/xata";
import { UpdateTodo } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { Description } from "@radix-ui/react-dialog";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();
  const xata = getXataClient();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId, ...values } = data;
  let todo;
  try {
    const existingRecord = await xata.db.Todo.filter({
      id: id,
    }).getFirst();
    if (!existingRecord) {
      return {
        error: "Todo not found!",
      };
    }
    todo = await xata.db.Todo.update(id, { ...values });

    await createAuditLog({
      entityTitle: todo?.title!,
      entityId: todo?.id!,
      entityType: "TODO",
      action: "UPDATE",
      boardId: boardId,
    });
  } catch (error) {
    return {
      error: "Failed to update.",
    };
  }

  revalidatePath(`/dashboard/${boardId}`);
  return { data: JSON.parse(JSON.stringify(todo)) };
};

export const updateTodo = createSafeAction(UpdateTodo, handler);
