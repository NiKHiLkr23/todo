import { getXataClient } from "@/lib/utils/xata";
import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import { BoardNavbar } from "./_components/board-navbar";

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
      className="relative h-full overflow-hidden bg-no-repeat bg-cover  bg-center w-full"
      style={{
        backgroundImage: `url(${board.imageFullUrl})`,
      }}
    >
      <div
        className="z-10"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Set background color to black with 60% opacity
        }}
      />
      <div className="relative w-full max-w-7xl mx-auto mb-3 ">
        <BoardNavbar data={JSON.parse(JSON.stringify(board))} />
      </div>

      <main className="relative pt-28 min-h-screen z-10 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default BoardIdLayout;
