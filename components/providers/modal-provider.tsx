"use client";

import { useEffect, useState } from "react";

import { ProModal } from "@/components/modals/pro-modal";
import { TodoModal } from "../modals/todo-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <TodoModal />
      <ProModal />
    </>
  );
};
