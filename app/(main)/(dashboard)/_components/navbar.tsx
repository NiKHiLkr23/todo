"use client";

import useScroll from "@/lib/hooks/use-scroll";
import { OrganizationSwitcher, SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { MobileSidebar } from "./mobile-sidebar";
import { FormPopover } from "@/components/form/form-popover";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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
          <MobileSidebar />
          <Link href="/" className="flex items-center font-display text-2xl">
            <span
              className="animate-fade-up bg-gradient-to-br from-blue-600 to-blue-300 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent  drop-shadow-sm [text-wrap:balance]"
              style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
            >
              Todo
            </span>
          </Link>

          <div className="flex items-center gap-x-4">
            {/* <FormPopover align="start" side="bottom" sideOffset={18}>
              <Button
                variant="primary"
                size="sm"
                className="rounded-sm hidden md:block h-auto  py-1.5 px-2"
              >
                Create
              </Button>
            </FormPopover> */}
            <FormPopover>
              <Button
                variant="primary"
                size="sm"
                className="rounded-sm block md:hidden"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </FormPopover>
          </div>
          <div className="ml-auto flex items-center gap-x-2">
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
