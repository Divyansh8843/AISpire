import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";
export const CheckUser = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }
  try {
    const loggedinUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });
    if (loggedinUser) {
      return loggedinUser;
    }
    const name = `${user.firstName} ${user.lastName}`;
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        email: user.emailAddresses[0].emailAddress,
        imageUrl: user.imageUrl,
      },
    });
    return newUser;
  } catch (err) {
    console.log(err);
  }
};
