export async function fetchTrialEndBySubscriptionId(
  subscriptionId: string,
): Promise<number> {
  const response = await fetch("/api/subscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ subscriptionId }),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(
      errorResponse.error || "Failed to fetch the subscription data",
    );
  }

  const { trialEnd } = await response.json();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return trialEnd ?? 0;
}

export function calculateRemainingTime(trialEnd: number): number {
  const trialEndDate = new Date(trialEnd * 1000); // Convert to milliseconds
  const now = new Date();
  const remainingTime = trialEndDate.getTime() - now.getTime();
  return remainingTime > 0 ? remainingTime / (1000 * 60 * 60) : 0; // Convert to hours
}
