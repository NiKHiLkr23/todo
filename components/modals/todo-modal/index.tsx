"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import { Header } from "./header";
import { Description } from "./description";
import { Actions } from "./actions";
import { Activity } from "./activity";
import { useTodoModal } from "@/lib/hooks/use-todo-modal";
import { fetcher } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { TodoWithList } from "@/types";
import { AuditLogRecord } from "@/lib/utils/xata";

export const TodoModal = () => {
  const id = useTodoModal((state) => state.id);
  const isOpen = useTodoModal((state) => state.isOpen);
  const onClose = useTodoModal((state) => state.onClose);

  const { data: todoData } = useQuery<TodoWithList>({
    queryKey: ["todo", id],
    queryFn: () => fetcher(`/api/todo/${id}`),
  });

  const { data: auditLogsData } = useQuery<AuditLogRecord[]>({
    queryKey: ["todo-logs", id],
    queryFn: () => fetcher(`/api/todo/${id}/logs`),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {!todoData ? <Header.Skeleton /> : <Header data={todoData} />}
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {!todoData ? (
                <Description.Skeleton />
              ) : (
                <Description data={todoData} />
              )}
              {!auditLogsData ? (
                <Activity.Skeleton />
              ) : (
                <Activity items={auditLogsData} />
              )}
            </div>
          </div>
          {!todoData ? <Actions.Skeleton /> : <Actions data={todoData} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};
