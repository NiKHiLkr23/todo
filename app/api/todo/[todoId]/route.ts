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

    const todo = await xataClient.db.Todo.filter({
      id: params.todoId,
    }).getFirst();

    return NextResponse.json(todo);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
