"use server";
import { getXataClient } from "@/lib/utils/xata";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";
import { userAgent } from "next/server";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();
  const xata = getXataClient();
  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, image } = data;
  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
    image.split("|");

  if (
    !imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageUserName ||
    !imageLinkHTML
  ) {
    return {
      error: "Missing fields. Failed to create board.",
    };
  }

  let board;
  const owner = await xata.db.User.search(userId);
  try {
    board = await xata.db.Board.create({
      title,
      owner: owner.records[0].id,
      imageThumbUrl,
      imageFullUrl,
      imageUserName,
      imageLinkHTML,
    });

    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: "BOARD",
      action: "CREATE",
      boardId: board.id,
    });
  } catch (error) {
    console.log("ERror------------", error);
    return {
      error: "Failed to create.",
    };
  }
  // console.log(board);

  revalidatePath(`/dashboard/${board.id}`);
  return { data: JSON.parse(JSON.stringify(board)) };
};

export const createBoard = createSafeAction(CreateBoard, handler);
