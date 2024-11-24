"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
	return (
		<div className="flex flex-col justify-center items-center p-4 min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
			<SignIn
				path="/auth/login"
				signUpUrl="/auth/signup"
				forceRedirectUrl="/dashboard"
			/>
		</div>
	);
}
