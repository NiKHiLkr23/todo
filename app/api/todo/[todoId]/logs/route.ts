import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { getXataClient } from "@/lib/utils/xata";

export async function GET(
  request: Request,
  { params }: { params: { todoId: string } }
) {
  try {
    const { userId } = auth();
    const xataClient = getXataClient();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const auditLogs = await xataClient.db.AuditLog.filter({
      entityId: params.todoId,
    })
      .sort("xata.createdAt", "desc")
      .getMany();

    return NextResponse.json(auditLogs);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
