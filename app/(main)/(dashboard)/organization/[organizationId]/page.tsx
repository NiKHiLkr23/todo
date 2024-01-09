import { Suspense } from "react";

import { Separator } from "@/components/ui/separator";

import { Info } from "./_components/info";
import { BoardList } from "./_components/board-list";
import { checkSubscription } from "@/lib/subscription";
import { getXataClient } from "@/lib/utils/xata";
import { auth } from "@clerk/nextjs";

const OrganizationIdPage = async () => {
  const isPro = await checkSubscription();
  const xataClient = getXataClient();
  const { userId, orgId } = auth();

  if (userId) {
    const checkUser = await xataClient.db.User.search(userId);
    const checkOrg = await xataClient.db.Org.search(orgId!);
    if (checkUser.totalCount === 0 && checkOrg.totalCount === 0) {
      const newUser = await xataClient.db.User.create({ userId });

      await xataClient.db.Org.create({ orgId, owner: newUser.id });
    }
  }

  return (
    <div className="w-full mb-20">
      <Info isPro={isPro} />
      <Separator className="my-4" />
      <div className="px-2 md:px-4">
        <Suspense fallback={<BoardList.Skeleton />}>
          <BoardList />
        </Suspense>
      </div>
    </div>
  );
};

export default OrganizationIdPage;
