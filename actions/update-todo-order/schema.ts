import { describe } from "node:test";
import { z } from "zod";

export const UpdateTodoOrder = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      order: z.number().nullable().optional(),
      list: z
        .object({
          id: z.string(),
        })
        .nullable()
        .optional(),
    })
  ),
  boardId: z.string(),
});
