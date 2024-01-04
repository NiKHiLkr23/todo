import { getXataClient } from "@/lib/utils/xata";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { todo } from "node:test";

export async function GET(
  req: Request,
  { params }: { params: { listId: string } }
) {
  try {
    const { userId } = auth();
    const xataClient = getXataClient();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const todos = await xataClient.db.Todo.filter({
      list: params.listId,
    }).getMany();

    console.log(todos);

    return NextResponse.json(todos);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
