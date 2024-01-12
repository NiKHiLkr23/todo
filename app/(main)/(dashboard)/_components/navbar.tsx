"use client";

import useScroll from "@/lib/hooks/use-scroll";
import { OrganizationSwitcher, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { MobileSidebar } from "./mobile-sidebar";

import { ThemeToggleButton } from "@/components/layout/theme-toggler";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const scrolled = useScroll(50);
  const pathname = usePathname();

  return (
    <>
      <div
        className={`fixed top-0 w-full flex justify-center ${
          scrolled
            ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
            : "bg-white/0"
        } z-50 transition-all
        ${pathname.startsWith("/dashboard") ? "bg-black/70" : ""}
        `}
      >
        <div className="mr-5 flex h-16 max-w-screen-xl items-center justify-between w-full">
          <MobileSidebar />
          <Link href="/" className="flex items-center font-display text-2xl">
            <span
              className="animate-fade-up bg-gradient-to-br from-blue-600 to-blue-300 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent  drop-shadow-sm [text-wrap:balance]"
              style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
            >
              Todo
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-x-2 ">
            <div className="hidden md:flex items-center gap-2 dark:text-white  ">
              <OrganizationSwitcher
                hidePersonal
                afterCreateOrganizationUrl="/organization/:id"
                afterLeaveOrganizationUrl="/select-org"
                afterSelectOrganizationUrl="/organization/:id"
                appearance={{
                  elements: {
                    rootBox: {
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  },
                }}
              />
            </div>
            <ThemeToggleButton />
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: {
                    height: 30,
                    width: 30,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
