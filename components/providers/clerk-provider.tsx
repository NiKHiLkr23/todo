"use client";

import { dark } from "@clerk/themes";
import { ClerkProvider as ClerkAuthProvider } from "@clerk/nextjs";
import { useTheme } from "next-themes";
export const ClerkProvider = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  return (
    <ClerkAuthProvider
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
      }}
    >
      {children}
    </ClerkAuthProvider>
  );
};
