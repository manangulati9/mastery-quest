"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
	return (
		<div className="flex flex-col justify-center items-center p-4 min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
			<SignUp
				path="/auth/signup"
				signInUrl="/auth/login"
				forceRedirectUrl="/auth/create-profile"
				signInForceRedirectUrl="/dashboard"
			/>
		</div>
	);
}
