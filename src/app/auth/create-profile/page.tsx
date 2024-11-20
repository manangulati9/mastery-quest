import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { userStats } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { CreateProfile } from "./create-profile";

export default async function Page() {
	const session = await auth();

	if (!session) {
		console.error("Session is null");
		return null;
	}

	const [user] = await db
		.select()
		.from(userStats)
		.where(eq(userStats.id, session.user.id));

	if (user) {
		redirect("/dashboard");
	}

	return <CreateProfile />;
}
