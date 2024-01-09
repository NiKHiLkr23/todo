import { auth } from "@clerk/nextjs";
import { getXataClient } from "./utils/xata";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
  const { orgId } = auth();
  const xataClient = getXataClient();

  if (!orgId) {
    return false;
  }

  const orgSubscription = await xataClient.db.OrgSubscription.filter({
    orgId: orgId,
  }).getFirst();

  if (!orgSubscription) {
    return false;
  }

  const isValid =
    orgSubscription.stripePriceId &&
    orgSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

  return !!isValid;
};
