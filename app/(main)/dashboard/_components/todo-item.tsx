import { Button } from "@/components/ui/button";
import { Board } from "@/lib/utils/xata";

interface TodoItemProps {
  todo: Board;
}
export const TodoItem = async ({ todo }: TodoItemProps) => {
  const deleteTodoWithId = () => {
    console.log("delelte");
  };

  return (
    <form action={deleteTodoWithId} className=" p-2 rounded-md shadow-md">
      <p className="p-0.5">{todo.title}</p>
      {/* <p className="p-0.5">{`${todo.createdAt}`}</p> */}

      <div className="flex items-center justify-between">
        {/* <p className="p-0.5">{todo.userId}</p> */}
        <Button variant="destructive" type="submit">
          Delete
        </Button>
      </div>
    </form>
  );
};
