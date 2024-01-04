import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";
import { CreateList } from "./schema";
import { List } from "@/lib/utils/xata";

export type InputType = z.infer<typeof CreateList>;
export type ReturnType = ActionState<InputType, List>;
