import { ClerkProvider } from "@/components/providers/clerk-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "sonner";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <QueryProvider>
        <Toaster />
        <ModalProvider />

        <div className="flex flex-col  min-h-screen w-full   ">{children}</div>
      </QueryProvider>
    </ClerkProvider>
  );
}
