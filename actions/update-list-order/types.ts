import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";

import { UpdateListOrder } from "./schema";
import { List } from "@/lib/utils/xata";

export type InputType = z.infer<typeof UpdateListOrder>;
export type ReturnType = ActionState<InputType, List[]>;
