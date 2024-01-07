import { getXataClient } from "@/lib/utils/xata";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

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

    const list = await xataClient.db.List.filter({
      id: params.listId,
    }).getFirst();

    return NextResponse.json(list);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
