"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpSchema } from "@/zod_schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/loader";

type TForm = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
	const router = useRouter();
	const form = useForm<TForm>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
			grade: "",
		},
	});
	const [checked, setChecked] = useState(false);
	const { mutate, isPending } = api.auth.signUp.useMutation({
		onError: () => {
			toast.error(
				"User with this email already exists. Please try a different email.",
			);
		},

		onSuccess: () => {
			toast.success("Signed up successfully!");
			router.push("/dashboard");
		},
	});

	const onSubmit = (values: TForm) => {
		mutate(values);
	};

	return (
		<div className="flex flex-col justify-center items-center p-4 min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
			<div className="p-8 space-y-8 w-full max-w-md bg-white rounded-xl shadow-lg">
				<div className="flex flex-col items-center space-y-2">
					<BookOpen className="w-12 h-12 text-purple-600" />
					<h1 className="text-3xl font-bold text-center text-gray-900">
						Join MasteryQuest
					</h1>
					<p className="text-center text-gray-600">
						Start your personalized learning journey today
					</p>
				</div>
				<Form {...form}>
					<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="block text-sm font-medium text-gray-700">
										Full name
									</FormLabel>
									<FormControl>
										<Input placeholder="Enter your name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
											placeholder="Create a secure password"
											type="password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="block text-sm font-medium text-gray-700">
										Confirm Password
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Re-enter your password"
											type="password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="grade"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="block text-sm font-medium text-gray-700">
										Grade Level
									</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													placeholder="Select your grade"
													className="placeholder:text-gray-700"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="7">Grade 7</SelectItem>
											<SelectItem value="8">Grade 8</SelectItem>
											<SelectItem value="9">Grade 9</SelectItem>
											<SelectItem value="10">Grade 10</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex items-center">
							<Checkbox
								checked={checked}
								onCheckedChange={() => setChecked((prev) => !prev)}
							/>
							<Label
								htmlFor="terms"
								className="block ml-2 text-sm text-gray-900"
							>
								I agree to the{" "}
								<Link
									href="#"
									className="font-medium hover:text-purple-500 text-primary"
								>
									Terms of Service
								</Link>{" "}
								and{" "}
								<Link
									href="#"
									className="font-medium hover:text-purple-500 text-primary"
								>
									Privacy Policy
								</Link>
							</Label>
						</div>
						<Button
							type="submit"
							disabled={!checked || isPending}
							className="w-full"
						>
							{isPending && <Loader />}
							Sign up
						</Button>
					</form>
				</Form>
				<div className="text-center">
					<p className="text-sm text-gray-600">
						Already have an account?{" "}
						<Link
							href="/auth/login"
							className="font-medium hover:text-purple-500 text-primary"
						>
							Log in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
