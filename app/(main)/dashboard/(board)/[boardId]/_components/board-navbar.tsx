import { Board } from "@/lib/utils/xata";
import { BoardOptions } from "./board-options";
import { BoardTitleForm } from "./board-title-form";

interface BoardNavbarProps {
  data: Board;
}

export const BoardNavbar = async ({ data }: BoardNavbarProps) => {
  return (
    <div className=" h-14 z-40 bg-black/50 fixed top-16 flex items-center px-6 gap-x-4 text-white w-full rounded-2xl max-w-7xl mx-auto">
      <BoardTitleForm data={data} />
      <div className="ml-auto">
        <BoardOptions id={data.id} />
      </div>
    </div>
  );
};
