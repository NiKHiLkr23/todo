"use server";
import { getXataClient } from "@/lib/utils/xata";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { userAgent } from "next/server";
import { CreateList } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: InputType): Promise<ReturnType> => {
  const xataClient = getXataClient();
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }
  const { title, boardId } = data;

  let list;

  try {
    const lastList = await xataClient.db.List.select(["order", "title"])
      .filter({
        board: boardId,
      })
      .sort("order", "desc")
      .getFirst();

    const newOrder = lastList ? lastList.order! + 1 : 1;

    list = await xataClient.db.List.create({
      title,
      board: boardId,
      order: newOrder,
    });

    await createAuditLog({
      entityTitle: list?.title!,
      entityId: list?.id!,
      entityType: "LIST",
      action: "CREATE",
      boardId: boardId,
      orgId: orgId,
    });
  } catch (error) {
    return {
      error: "Failed to create.",
    };
  }

  revalidatePath(`/dashboard/${boardId}`);
  return { data: JSON.parse(JSON.stringify(list)) };
};

export const createList = createSafeAction(CreateList, handler);
