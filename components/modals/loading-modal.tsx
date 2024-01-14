"use client";

import Image from "next/image";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLoadingModal } from "@/lib/hooks/use-loading-modal";

export const LoadingModal = () => {
  const loadingModal = useLoadingModal();

  return (
    <Dialog open={loadingModal.isOpen} onOpenChange={loadingModal.onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="aspect-video relative flex items-center justify-center">
          <Image src="/hero.svg" alt="Hero" className="object-cover" fill />
        </div>
      </DialogContent>
    </Dialog>
  );
};
