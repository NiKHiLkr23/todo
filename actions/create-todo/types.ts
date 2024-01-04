import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";

import { CreateTodo } from "./schema";
import { Todo } from "@/lib/utils/xata";

export type InputType = z.infer<typeof CreateTodo>;
export type ReturnType = ActionState<InputType, Todo>;
