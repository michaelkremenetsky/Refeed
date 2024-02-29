import type { PrismaClient } from "@prisma/client";

export const getPlan = async (
  userId: string,
  prisma: PrismaClient,
): Promise<"free" | "pro"> => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (user?.plan) {
    switch (user?.plan) {
      case "free":
        return "free";
      case "pro":
        return "pro";
    }
  }
  console.log("Failed To find User Plan");
  return "free";
};
