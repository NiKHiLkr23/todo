"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { UpdateList } from "./schema";
import { InputType, ReturnType } from "./types";
import { getXataClient } from "@/lib/utils/xata";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();
  const xata = getXataClient();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, id, boardId } = data;
  let list;
  try {
    const existingRecord = await xata.db.List.filter({
      board: boardId,
      id: id,
    }).getFirst();
    if (!existingRecord) {
      return {
        error: "List not found!",
      };
    }
    list = await xata.db.List.update(id, { title: title });

    await createAuditLog({
      entityTitle: list?.title!,
      entityId: list?.id!,
      entityType: "LIST",
      action: "UPDATE",
      boardId: boardId,
    });
  } catch (error) {
    return {
      error: "Failed to update.",
    };
  }

  revalidatePath(`/dashboard/${boardId}`);
  return { data: JSON.parse(JSON.stringify(list)) };
};

export const updateList = createSafeAction(UpdateList, handler);
