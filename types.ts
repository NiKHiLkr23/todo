import { List, Todo } from "./lib/utils/xata";

export type ListWithTodos = List & { todos: Todo[] };
export type TodoWithList = Todo & { todos: List[] };

export type ACTION = Record<"CREATE" | "UPDATE" | "DELETE", String>;

export type ENTITY_TYPE = Record<"BOARD" | "LIST" | "TODO", String>;
