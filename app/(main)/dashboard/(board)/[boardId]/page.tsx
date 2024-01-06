import { auth } from "@clerk/nextjs";
import { ListContainer } from "./_components/list-container";
import { getXataClient } from "@/lib/utils/xata";
import axios from "axios";

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

  try {
    // Fetch lists data
    const lists = await xataClient.db.List.filter({
      board: JSON.parse(JSON.stringify(existingRecord)),
    })
      .sort("order", "asc")
      .getMany();

    // Extract list IDs from the response
    const listIds = lists.map((list) => list.id);

    // Fetch todos for each list in parallel
    const todosPromises = listIds.map(async (listId) => {
      const todos = await xataClient.db.Todo.filter({
        list: listId,
      })
        .sort("order", "asc")
        .getMany();
      return todos;
    });

    // Wait for all todo requests to complete
    const todosResults = await Promise.all(todosPromises);

    // console.log("todosResult", todosResults);

    // Combine lists and todos data
    const combinedData = lists.map((listItem, index) => {
      return {
        ...listItem,
        todos: todosResults ? todosResults[index] : [],
      };
    });

    // console.log("combinedData", combinedData);

    return (
      <div className="p-4 z-10 h-full overflow-x-auto">
        <ListContainer
          boardId={params.boardId}
          data={JSON.parse(JSON.stringify(combinedData))}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching lists and todos:", error);
    return (
      <div className="p-4 z-10 h-full overflow-x-auto">
        oops somthing went wrong
      </div>
    );
  }
};

export default BoardIdPage;
