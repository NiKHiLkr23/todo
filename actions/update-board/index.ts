"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { UpdateBoard } from "./schema";
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

  const { title, id } = data;
  let board;
  const owner = await xata.db.User.search(userId);
  try {
    const existingRecord = await xata.db.Board.filter({
      owner: owner.records[0].id,
      id: id,
    }).getFirst();
    if (!existingRecord) {
      console.log("error");
    }
    board = await xata.db.Board.update(id, { title: title });

    await createAuditLog({
      entityTitle: board?.title!,
      entityId: board?.id!,
      entityType: "BOARD",
      action: "UPDATE",
      boardId: board?.id!,
    });
  } catch (error) {
    return {
      error: "Failed to update.",
    };
  }

  revalidatePath(`/dashboard/${id}`);
  return { data: JSON.parse(JSON.stringify(board)) };
};

export const updateBoard = createSafeAction(UpdateBoard, handler);
