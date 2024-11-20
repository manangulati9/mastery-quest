import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email("Invalid email id"),
	password: z
		.string()
		.min(8, "Password is too short")
		.max(25, "Password length exceeded"),
});

export const signUpSchema = loginSchema
	.extend({
		name: z.string().min(1, "Name is too short"),
		grade: z.string(),
		confirmPassword: z
			.string()
			.min(8, "Password is too short")
			.max(25, "Password length exceeded"),
	})
	.refine((val) => val.password === val.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export const createProfileSchema = z.object({
	grade: z.string(),
});
