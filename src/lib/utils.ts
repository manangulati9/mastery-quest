import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { generateFromEmail } from "unique-username-generator";
import type { users } from "@/server/db/schema";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateUsername(
	email: string,
	usersArray: (typeof users.$inferSelect)[],
): string {
	let digits = 3;
	let username = "";

	while (true) {
		username = generateFromEmail(email, digits);
		if (!usersArray.find((user) => user.username === username)) {
			break;
		}
		digits++;
	}

	return username;
}

export function getBaseUrl() {
	if (typeof window !== "undefined") return window.location.origin;
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
	return `http://localhost:${process.env.PORT ?? 3000}`;
}
