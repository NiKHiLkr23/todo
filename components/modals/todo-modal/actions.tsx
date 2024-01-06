"use client";

import { toast } from "sonner";
import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TodoWithList } from "@/types";
import { useAction } from "@/lib/hooks/use-action";
import { useTodoModal } from "@/lib/hooks/use-todo-modal";
import { deleteTodo } from "@/actions/delete-todo";
import { copyTodo } from "@/actions/copy-todo";

interface ActionsProps {
  data: TodoWithList;
}

export const Actions = ({ data }: ActionsProps) => {
  const params = useParams();
  const todoModal = useTodoModal();

  const { execute: executeCopyTodo, isLoading: isLoadingCopy } = useAction(
    copyTodo,
    {
      onSuccess: (data) => {
        toast.success(`Todo "${data.title}" copied`);
        todoModal.onClose();
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const { execute: executeDeleteTodo, isLoading: isLoadingDelete } = useAction(
    deleteTodo,
    {
      onSuccess: (data) => {
        toast.success(`Todo "${data.title}" deleted`);
        todoModal.onClose();
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const onCopy = () => {
    const boardId = params.boardId as string;

    executeCopyTodo({
      id: data.id,
      boardId,
    });
  };

  const onDelete = () => {
    const boardId = params.boardId as string;

    executeDeleteTodo({
      id: data.id,
      boardId,
    });
  };

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        onClick={onCopy}
        disabled={isLoadingCopy}
        variant="gray"
        className="w-full justify-start"
        size="inline"
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </Button>
      <Button
        onClick={onDelete}
        disabled={isLoadingDelete}
        variant="gray"
        className="w-full justify-start"
        size="inline"
      >
        <Trash className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  );
};

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};
