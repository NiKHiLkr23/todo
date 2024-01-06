import { z } from "zod";

export const DeleteTodo = z.object({
  id: z.string(),
  boardId: z.string(),
});
