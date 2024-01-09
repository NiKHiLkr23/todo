"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { DeleteList } from "./schema";
import { InputType, ReturnType } from "./types";
import { getXataClient } from "@/lib/utils/xata";
import { createAuditLog } from "@/lib/create-audit-log";
import { XataApiClient } from "@xata.io/client";
import { todo } from "node:test";

const handler = async (data: InputType): Promise<ReturnType> => {
  const xataClient = getXataClient();
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;
  let list;

  try {
    const todos = await xataClient.db.Todo.filter({
      list: id,
    }).getMany();

    const deletedTodos = await xataClient.db.Todo.delete(
      todos.map((item) => {
        return `${item.id}`;
      })
    );

    list = await xataClient.db.List.delete(id);

    const auditLogPromises = todos.map(async (todo) => {
      await createAuditLog({
        entityTitle: todo?.title!,
        entityId: todo?.id!,
        entityType: "TODO",
        action: "DELETE",
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
        action: "DELETE",
        boardId: boardId,
        orgId: orgId,
      }),
    ]);
  } catch (error) {
    return {
      error: "Failed to delete.",
    };
  }

  revalidatePath(`/dashboard/${boardId}`);
  return { data: JSON.parse(JSON.stringify(list)) };
};

export const deleteList = createSafeAction(DeleteList, handler);
