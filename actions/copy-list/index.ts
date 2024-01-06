"use server";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";

import { CopyList } from "./schema";
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

    const lastList = await xataClient.db.List.filter({
      board: boardId,
    })
      .sort("order", "desc")
      .getFirst();

    const newOrder = lastList ? lastList.order! + 1 : 1;

    list = await xataClient.db.List.create({
      title: `${listToCopy.title} - Copy`,
      board: boardId,
      order: newOrder,
    });

    await createAuditLog({
      entityTitle: listToCopy.title,
      entityId: listToCopy.id,
      entityType: "LIST",
      action: "CREATE",
      boardId: boardId,
    });
  } catch (error) {
    return {
      error: "Failed to copy.",
    };
  }

  revalidatePath(`/dashboard/${boardId}`);
  return { data: JSON.parse(JSON.stringify(list)) };
};

export const copyList = createSafeAction(CopyList, handler);
