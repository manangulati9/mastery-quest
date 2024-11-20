"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import type { z } from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { loginSchema } from "@/zod_schemas";
import { toast } from "sonner";
import { Loader } from "@/components/loader";

type TForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const [isSigningInWithGoogle, setIsSigningInWithGoogle] = useState(false);
	const [isSigningInWithEmail, setIsSigningInWithEmail] = useState(false);
	const form = useForm<TForm>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (values: TForm) => {
		setIsSigningInWithEmail(true);
		const res = await signIn("credentials", {
			redirect: false,
			redirectTo: "/dashboard",
			...values,
		});
		setIsSigningInWithEmail(false);
		if (res?.error) {
			toast.error(res?.code);
		}
	};

	const signInWithGoogle = async () => {
		setIsSigningInWithGoogle(true);
		const res = await signIn("google", {
			redirect: false,
			redirectTo: "/auth/create-profile",
		});
		setIsSigningInWithGoogle(false);
		if (res?.error) {
			toast.error(res?.code);
		}
	};

	return (
		<div className="flex flex-col justify-center items-center p-4 min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
			<div className="p-8 space-y-8 w-full max-w-md bg-white rounded-xl shadow-lg">
				<div className="flex flex-col items-center space-y-2">
					<BookOpen className="w-12 h-12 text-purple-600" />
					<h1 className="text-3xl font-bold text-center text-gray-900">
						Welcome back to MasteryQuest
					</h1>
					<p className="text-center text-gray-600">
						Log in to continue your learning journey
					</p>
				</div>
				<Form {...form}>
					<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="block text-sm font-medium text-gray-700">
										Email
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter your email"
											type="email"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="block text-sm font-medium text-gray-700">
										Password
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter your password"
											type="password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="text-sm">
							<Link
								href="#"
								className="font-medium text-purple-600 hover:text-purple-500"
							>
								Forgot your password?
							</Link>
						</div>
						<Button
							type="submit"
							disabled={isSigningInWithEmail}
							className="w-full"
						>
							{isSigningInWithEmail && <Loader />}
							Sign in
						</Button>
						<div className="relative">
							<div className="flex absolute inset-0 items-center">
								<span className="w-full border-t" />
							</div>
							<div className="flex relative justify-center text-xs uppercase">
								<span className="px-2 bg-background text-muted-foreground">
									Or continue with
								</span>
							</div>
						</div>
						<Button
							variant="outline"
							type="button"
							className="w-full"
							onClick={signInWithGoogle}
							disabled={isSigningInWithGoogle}
						>
							{isSigningInWithGoogle ? (
								<Loader />
							) : (
								<svg role="img" viewBox="0 0 24 24" className="mr-1 w-4 h-4">
									<title>Google logo</title>
									<path
										fill="currentColor"
										d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
									/>
								</svg>
							)}
							Google
						</Button>
					</form>
				</Form>
				<div className="text-center">
					<p className="text-sm text-gray-600">
						Don't have an account?{" "}
						<Link
							href="/auth/signup"
							className="font-medium text-purple-600 hover:text-purple-500"
						>
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
