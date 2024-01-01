import { getXataClient } from "@/lib/utils/xata";
import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import { BoardNavbar } from "../_components/board-navbar";

export async function generateMetadata({
  params,
}: {
  params: { boardId: string };
}) {
  const xata = getXataClient();

  const { userId } = auth();

  if (!userId) {
    return {
      title: "Board",
    };
  }

  const board = await xata.db.Board.read({
    id: params.boardId,
  });

  return {
    title: board?.title || "Board",
  };
}

const BoardIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { boardId: string };
}) => {
  const { userId } = auth();
  const xata = getXataClient();
  if (!userId) {
    redirect("/dashboard");
  }

  // Ensure the item is own by our user
  const board = await xata.db.Board.filter({
    id: params.boardId,
  }).getFirst();

  if (!board) {
    notFound();
  }

  return (
    <div
      className="relative h-full bg-no-repeat bg-cover bg-center bg-green-100 w-full"
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
    >
      <BoardNavbar data={JSON.parse(JSON.stringify(board))} />

      <div className="absolute inset-0 bg-black/10" />
      <main className="relative pt-28 min-h-screen">{children}</main>
    </div>
  );
};

export default BoardIdLayout;
