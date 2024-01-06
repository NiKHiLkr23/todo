import { z } from "zod";

export const CopyTodo = z.object({
  id: z.string(),
  boardId: z.string(),
});
