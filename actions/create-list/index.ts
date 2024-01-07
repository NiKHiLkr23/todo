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
  const { userId } = auth();
  const xata = getXataClient();
  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, boardId } = data;

  let list;

  try {
    const lastList = await xata.db.List.select(["order", "title"])
      .filter({
        board: boardId,
      })
      .sort("order", "desc")
      .getFirst();

    // console.log("lastList", lastList);

    const newOrder = lastList ? lastList.order! + 1 : 1;

    list = await xata.db.List.create({
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
    });
  } catch (error) {
    console.log("ERror------------", error);
    return {
      error: "Failed to create.",
    };
  }
  // console.log("new-list created", list);

  revalidatePath(`/dashboard/${boardId}`);
  return { data: JSON.parse(JSON.stringify(list)) };
};

export const createList = createSafeAction(CreateList, handler);
