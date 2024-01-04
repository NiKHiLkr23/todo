import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";

import { DeleteList } from "./schema";
import { List } from "@/lib/utils/xata";

export type InputType = z.infer<typeof DeleteList>;
export type ReturnType = ActionState<InputType, List>;
