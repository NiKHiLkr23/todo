"use server";
import { getXataClient } from "@/lib/utils/xata";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";
import { userAgent } from "next/server";
import { createAuditLog } from "@/lib/create-audit-log";
import { hasAvailableCount, incrementAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

const handler = async (data: InputType): Promise<ReturnType> => {
  const xata = getXataClient();
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const canCreate = await hasAvailableCount();
  const isPro = await checkSubscription();

  if (!canCreate && !isPro) {
    return {
      error:
        "You have reached your limit of free boards. Please upgrade to create more.",
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
  try {
    const owner = await xata.db.User.search(userId);
    const org = await xata.db.Org.search(orgId);

    board = await xata.db.Board.create({
      title,
      owner: owner.records[0].id,
      imageThumbUrl,
      imageFullUrl,
      imageUserName,
      imageLinkHTML,
      organization: org.records[0].id,
    });

    if (!isPro) {
      await incrementAvailableCount();
    }
    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: "BOARD",
      action: "CREATE",
      boardId: board.id,
      orgId: orgId,
    });
  } catch (error) {
    return {
      error: "Failed to create.",
    };
  }

  revalidatePath(`/dashboard/${board.id}`);
  return { data: JSON.parse(JSON.stringify(board)) };
};

export const createBoard = createSafeAction(CreateBoard, handler);
