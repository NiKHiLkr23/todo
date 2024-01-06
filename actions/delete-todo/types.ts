import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";

import { DeleteTodo } from "./schema";
import { Todo } from "@/lib/utils/xata";

export type InputType = z.infer<typeof DeleteTodo>;
export type ReturnType = ActionState<InputType, Todo>;
