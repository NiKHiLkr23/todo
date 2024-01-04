"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { UpdateList } from "./schema";
import { InputType, ReturnType } from "./types";
import { getXataClient } from "@/lib/utils/xata";

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
      console.log("error");
    }
    try {
      list = await xata.db.List.update(id, { title: title });
    } catch (error) {
      console.log(error);
    }
    // await createAuditLog({
    //   entityTitle: board.title,
    //   entityId: board.id,
    //   entityType: ENTITY_TYPE.BOARD,
    //   action: ACTION.UPDATE,
    // })
  } catch (error) {
    return {
      error: "Failed to update.",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: JSON.parse(JSON.stringify(list)) };
};

export const updateList = createSafeAction(UpdateList, handler);
