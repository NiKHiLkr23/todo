"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { getXataClient } from "@/lib/utils/xata";
import { CopyTodo } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();
  const xataClient = getXataClient();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;
  let list;

  try {
    const listToCopy = await xataClient.db.List.filter({
      id: id,
      board: boardId,
    }).getFirst();

    if (!listToCopy) {
      return { error: "List not found" };
    }

    // await createAuditLog({
    //   entityTitle: list.title,
    //   entityId: list.id,
    //   entityType: ENTITY_TYPE.LIST,
    //   action: ACTION.CREATE,
    // })
  } catch (error) {
    return {
      error: "Failed to copy.",
    };
  }

  revalidatePath(`/dashboard/${boardId}`);
  return { data: list };
};

export const copyTodo = createSafeAction(CopyTodo, handler);
