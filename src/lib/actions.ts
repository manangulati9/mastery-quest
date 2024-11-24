"use server";

import type { OnboardingForm } from "@/app/onboarding/page";
import { db } from "@/server/db";
import { users, userStats } from "@/server/db/schema";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

type OnboardingResponse = {
  success: boolean;
  error: Error | null;
};

export const completeOnboarding = async (values: OnboardingForm) => {
  const { userId } = await auth();

  if (!userId) {
    return {
      success: false,
      error: new Error("No user logged in. Please try again later."),
    } as OnboardingResponse;
  }

  const client = await clerkClient();

  try {
    await Promise.all([
      client.users.updateUser(userId, {
        firstName: values.first_name,
        lastName: values.last_name,
        publicMetadata: {
          onboardingComplete: true,
        },
      }),
      db
        .update(users)
        .set({
          name: `${values.first_name} ${values.last_name}`,
        })
        .where(eq(users.id, userId)),
      db.insert(userStats).values({
        id: userId,
        grade: Number.parseInt(values.grade),
      }),
    ]);
    return { success: true, error: null } as OnboardingResponse;
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: new Error("Something went wrong. Please try again later"),
    } as OnboardingResponse;
  }
};
