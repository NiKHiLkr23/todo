import { getXataClient } from "@/lib/utils/xata";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { todoId: string } }
) {
  try {
    const { userId } = auth();
    const xataClient = getXataClient();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const todos = await xataClient.db.Todo.filter({
      list: params.todoId,
    }).getMany();

    console.log(todos);

    return NextResponse.json(todos);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
