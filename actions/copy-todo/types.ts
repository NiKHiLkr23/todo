import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";

import { CopyTodo } from "./schema";
import { Todo } from "@/lib/utils/xata";

export type InputType = z.infer<typeof CopyTodo>;
export type ReturnType = ActionState<InputType, Todo>;
