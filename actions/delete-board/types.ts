import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";

import { DeleteBoard } from "./schema";
import { Board } from "@/lib/utils/xata";

export type InputType = z.infer<typeof DeleteBoard>;
export type ReturnType = ActionState<InputType, Board>;
