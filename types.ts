import { List, Todo } from "./lib/utils/xata";

export type ListWithTodos = List & { todos: Todo[] };
export type TodoWithList = Todo & { todos: List[] };
