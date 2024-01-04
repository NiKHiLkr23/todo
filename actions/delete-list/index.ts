"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { DeleteList } from "./schema";
import { InputType, ReturnType } from "./types";
import { getXataClient } from "@/lib/utils/xata";

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
    list = await xataClient.db.List.delete(id);

    // await createAuditLog({
    //   entityTitle: list.title,
    //   entityId: list.id,
    //   entityType: ENTITY_TYPE.LIST,
    //   action: ACTION.DELETE,
    // })
  } catch (error) {
    return {
      error: "Failed to delete.",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: JSON.parse(JSON.stringify(list)) };
};

export const deleteList = createSafeAction(DeleteList, handler);
