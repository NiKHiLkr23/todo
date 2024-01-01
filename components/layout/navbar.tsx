"use client";

import useScroll from "@/lib/hooks/use-scroll";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  const scrolled = useScroll(50);

  return (
    <>
      <div
        className={`fixed top-0 w-full flex justify-center ${
          scrolled
            ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
            : "bg-white/0"
        } z-50 transition-all`}
      >
        <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between w-full">
          <Link href="/" className="flex items-center font-display text-2xl">
            <span
              className="animate-fade-up bg-gradient-to-br from-blue-600 to-blue-300 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent  drop-shadow-sm [text-wrap:balance]"
              style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
            >
              Todo
            </span>
          </Link>

          <SignedIn>
            <div>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </div>
    </>
  );
}
