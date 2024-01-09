"use server";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";

import { CopyList } from "./schema";
import { InputType, ReturnType } from "./types";
import { ListRecord, getXataClient } from "@/lib/utils/xata";
import { createAuditLog } from "@/lib/create-audit-log";
import { SelectedPick } from "@xata.io/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const xataClient = getXataClient();
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;
  let list: Readonly<SelectedPick<ListRecord, ["*"]>>;

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

    // copy all to todos
    const todos = await xataClient.db.Todo.filter({
      list: id,
    }).getMany();

    const copiedTodos = await xataClient.db.Todo.create(
      todos.map((item) => {
        return {
          title: item.title,
          description: item.description,
          order: item.order,
          list: list.id,
          isCompleted: item.isCompleted,
        };
      })
    );
    const auditLogPromises = copiedTodos.map(async (todo) => {
      await createAuditLog({
        entityTitle: todo?.title!,
        entityId: todo?.id!,
        entityType: "TODO",
        action: "CREATE",
        boardId: boardId,
        orgId: orgId,
      });
    });

    const audits = await Promise.all([
      ...auditLogPromises,
      createAuditLog({
        entityTitle: list?.title!,
        entityId: list?.id!,
        entityType: "LIST",
        action: "CREATE",
        boardId: boardId,
        orgId: orgId,
      }),
    ]);
  } catch (error) {
    return {
      error: "Failed to copy.",
    };
  }

  revalidatePath(`/dashboard/${boardId}`);
  return { data: JSON.parse(JSON.stringify(list)) };
};

export const copyList = createSafeAction(CopyList, handler);
