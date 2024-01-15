import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { HelpCircle, PencilRuler, User2 } from "lucide-react";

import { Hint } from "@/components/hint";
import { Skeleton } from "@/components/ui/skeleton";
import { FormPopover } from "@/components/form/form-popover";
import { MAX_FREE_BOARDS } from "@/constants/boards";
import { getAvailableCount } from "@/lib/org-limit";
import { getXataClient } from "@/lib/utils/xata";
import { checkSubscription } from "@/lib/subscription";

export const BoardList = async () => {
  const { userId, orgId } = auth();
  const xataClient = getXataClient();

  if (!orgId) {
    return redirect("/select-org");
  }
  const owner = await xataClient.db.User.search(`${userId}`);

  const boards = await xataClient.db.Board.filter({
    owner: JSON.parse(JSON.stringify(owner.records[0].id)),
    "organization.orgId": orgId,
  })
    .sort("xata.createdAt", "desc")
    .getMany();

  const availableCount = await getAvailableCount();
  const isPro = await checkSubscription();

  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700 dark:text-gray-400">
        <User2 className="h-6 w-6 mr-2" />
        Your boards
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {boards.map((board) => (
          <Link
            key={board.id}
            href={`/dashboard/${board.id}`}
            className="group relative aspect-video bg-no-repeat shadow-md active:scale-95 bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
            style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            <p className="relative font-semibold text-white text-lg">
              {board.title}
            </p>
          </Link>
        ))}
        <div className="hidden md:block">
          <FormPopover sideOffset={10} side="right" align="start">
            <div
              role="button"
              className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition shadow-md active:scale-95"
            >
              <PencilRuler size={32} />
              <p className="text-sm">Create new board</p>
              <span className="text-xs">
                {isPro
                  ? "Unlimited"
                  : `${MAX_FREE_BOARDS - availableCount!} remaining`}
              </span>
              <Hint
                sideOffset={40}
                description={`
                Free Workspaces can have up to 5 open boards. For unlimited boards upgrade this workspace.
              `}
              >
                <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
              </Hint>
            </div>
          </FormPopover>
        </div>
        <div className="md:hidden">
          <FormPopover sideOffset={10} side="bottom" align="end">
            <div
              role="button"
              className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition shadow-md active:scale-95"
            >
              <PencilRuler size={32} />
              <p className="text-sm">Create new board</p>
              <span className="text-xs">
                {isPro
                  ? "Unlimited"
                  : `${MAX_FREE_BOARDS - availableCount!} remaining`}
              </span>
              <Hint
                sideOffset={40}
                description={`
                Free Workspaces can have up to 5 open boards. For unlimited boards upgrade this workspace.
              `}
              >
                <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
              </Hint>
            </div>
          </FormPopover>
        </div>
      </div>
    </div>
  );
};

BoardList.Skeleton = function SkeletonBoardList() {
  return (
    <div className="grid gird-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
    </div>
  );
};
