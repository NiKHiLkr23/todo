import { getXataClient } from "@/lib/utils/xata";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { todo } from "node:test";
import { type NextRequest } from "next/server";
export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();
    const xataClient = getXataClient();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const todos = await xataClient.db.Todo.filter({
      list: req.nextUrl.searchParams.get("listId"),
    }).getMany();

    console.log("getTodos----", todos);

    return Response.json({ todos });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
