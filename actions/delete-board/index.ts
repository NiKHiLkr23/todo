"use server";
import { getXataClient } from "@/lib/utils/xata";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";

import { redirect } from "next/navigation";
import { DeleteBoard } from "./schema";

export type State = {
  errors?: {
    title?: string[];
  };
  message?: string | null;
};

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();
  const xata = getXataClient();
  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id } = data;
  const owner = await xata.db.User.search(userId);
  try {
    // Ensure the item is own by our user
    const existingRecord = await xata.db.Board.filter({
      owner: owner.records[0].id,
      id: id,
    }).getFirst();
    if (!existingRecord) {
      console.log("error");
    }
    try {
      //get all todo associated with the board
      // await delete all the todo
      await xata.db.Board.delete(id);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    return {
      error: "Failed to create.",
    };
  }

  revalidatePath(`/dashboard}`);
  redirect(`/dashboard`);
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);
