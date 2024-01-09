import { auth } from "@clerk/nextjs";

import { MAX_FREE_BOARDS } from "@/constants/boards";
import { getXataClient } from "./utils/xata";

export const incrementAvailableCount = async () => {
  const { orgId } = auth();
  const xataClient = getXataClient();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  const orgLimit = await xataClient.db.Org.filter({
    orgId: orgId,
  }).getFirst();

  if (orgLimit) {
    await xataClient.db.Org.update(orgLimit.id, { count: orgLimit.count! + 1 });
  } else {
    await xataClient.db.Org.create({
      orgId,
      count: 1,
    });
  }
};

export const decreaseAvailableCount = async () => {
  const { orgId } = auth();
  const xataClient = getXataClient();
  if (!orgId) {
    throw new Error("Unauthorized");
  }

  const orgLimit = await xataClient.db.Org.filter({
    orgId: orgId,
  }).getFirst();
  if (orgLimit) {
    await xataClient.db.Org.update(orgLimit.id, {
      count: orgLimit.count! > 0 ? orgLimit.count! - 1 : 0,
    });
  } else {
    await xataClient.db.Org.create({
      orgId,
      count: 1,
    });
  }
};

export const hasAvailableCount = async () => {
  const { orgId } = auth();
  const xataClient = getXataClient();
  if (!orgId) {
    throw new Error("Unauthorized");
  }

  const orgLimit = await xataClient.db.Org.filter({
    orgId: orgId,
  }).getFirst();

  if (!orgLimit || orgLimit.count! < MAX_FREE_BOARDS) {
    return true;
  } else {
    return false;
  }
};

export const getAvailableCount = async () => {
  const { orgId } = auth();
  const xataClient = getXataClient();
  if (!orgId) {
    return 0;
  }

  const orgLimit = await xataClient.db.Org.filter({
    orgId: orgId,
  }).getFirst();

  if (!orgLimit) {
    return 0;
  }

  return orgLimit.count;
};
