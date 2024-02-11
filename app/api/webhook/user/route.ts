import { getXataClient } from "@/lib/utils/xata";
import { OrganizationJSON, WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const payload: WebhookEvent = await req.json();

  const xataClient = getXataClient();
  switch (payload.type) {
    case "organization.created":
      let data: OrganizationJSON = payload.data;
      const orgOwner = await xataClient.db.User.filter({
        userId: data.created_by,
      }).getFirst();
      await xataClient.db.Org.create({
        orgId: data.id,
        owner: orgOwner?.id,
      });
      return Response.json({ message: "Received" });
    case "organization.deleted":
      const org = await xataClient.db.Org.filter({
        orgId: payload.data.id,
      }).getFirst();
      await xataClient.db.Org.delete(`${org?.id}`);
      return Response.json({ message: "Received" });
    case "user.created":
      await xataClient.db.User.create({
        userId: payload.data.id,
      });
      return Response.json({ message: "Received" });
    case "user.deleted":
      const user = await xataClient.db.User.filter({
        userId: payload.data.id,
      }).getFirst();
      await xataClient.db.User.delete(`${user?.id}`);
      return Response.json({ message: "Received" });

    default:
      await xataClient.db.AuditLog.create({
        action: `WEBHOOK`,
        entityId: null,
        boardId: null,
        entityType: payload.type,
        entityTitle: payload.object,
        userId: null,
        userImage: null,
        userName: null,
      });
      return Response.json({ message: "Received" });
  }
}
