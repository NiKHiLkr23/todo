"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { UpdateListOrder } from "./schema";
import { InputType, ReturnType } from "./types";
import { getXataClient } from "@/lib/utils/xata";

const handler = async (data: InputType): Promise<ReturnType> => {
  const xata = getXataClient();
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { items, boardId } = data;
  let lists;

  try {
    const transaction = items.map((list) => {
      return {
        update: { table: "List", id: list.id, fields: { order: list.order } },
      };
    });

    lists = await xata.transactions.run(
      JSON.parse(JSON.stringify(transaction))
    );
  } catch (error) {
    return {
      error: "Failed to reorder.",
    };
  }

  revalidatePath(`/dashboard/${boardId}`);
  return { data: JSON.parse(JSON.stringify(lists)) };
};

export const updateListOrder = createSafeAction(UpdateListOrder, handler);
