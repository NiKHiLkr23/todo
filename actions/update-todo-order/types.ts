import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";

import { UpdateTodoOrder } from "./schema";
import { Todo } from "@/lib/utils/xata";

export type InputType = z.infer<typeof UpdateTodoOrder>;
export type ReturnType = ActionState<InputType, Todo[]>;
