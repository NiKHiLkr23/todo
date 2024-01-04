import { auth } from "@clerk/nextjs";
import { ListContainer } from "./_components/list-container";
import { getXataClient } from "@/lib/utils/xata";

interface BoardIdPageProps {
  params: {
    boardId: string;
  };
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
  const { userId } = auth();
  const xataClient = getXataClient();
  const owner = await xataClient.db.User.search(`${userId}`);
  const existingRecord = await xataClient.db.Board.filter({
    owner: owner.records[0].id,
    id: params.boardId,
  }).getFirst();

  const lists = await xataClient.db.List.filter({
    board: JSON.parse(JSON.stringify(existingRecord)),
  }).getMany();

  return (
    <div className="p-4 z-10 h-full overflow-x-auto">
      <ListContainer
        boardId={params.boardId}
        data={JSON.parse(JSON.stringify(lists))}
      />
    </div>
  );
};

export default BoardIdPage;
