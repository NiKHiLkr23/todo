import { getXataClient } from "@/lib/utils/xata";
import { BoardList } from "./_components/board-list";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs";

const Dashboard = async () => {
  const xataClient = getXataClient();
  const { userId } = auth();

  if (userId) {
    const checkUser = await xataClient.db.User.search(userId);
    if (checkUser.totalCount === 0) {
      await xataClient.db.User.create({ userId });
    }
  }

  return (
    <div className="space-y-5 w-full max-w-6xl mx-auto  p-12">
      <Suspense fallback={<BoardList.Skeleton />}>
        <BoardList />
      </Suspense>
    </div>
  );
};

export default Dashboard;
