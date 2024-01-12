import { ThemeToggleButton } from "@/components/layout/theme-toggler";
import { OrganizationList } from "@clerk/nextjs";
import Link from "next/link";

export default function CreateOrganizationPage() {
  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="flex items-center justify-between w-full  p-5 md:px-10 ">
        <Link prefetch={false} href="/">
          <span
            className="animate-fade-up font-display bg-gradient-to-br from-blue-600 to-blue-300 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent  drop-shadow-sm [text-wrap:balance]"
            style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
          >
            Todo
          </span>
        </Link>

        <ThemeToggleButton />
      </div>
      <OrganizationList
        hidePersonal
        afterSelectOrganizationUrl="/organization/:id"
        afterCreateOrganizationUrl="/organization/:id"
      />
    </div>
  );
}
