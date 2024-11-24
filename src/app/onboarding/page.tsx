"use client";

import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
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
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { completeOnboarding } from "@/lib/actions";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
	first_name: z.string().min(1, "First name is too short"),
	last_name: z.string().min(1, "Last name is too short"),
	grade: z.string(),
});

export type OnboardingForm = z.infer<typeof formSchema>;

export default function Page() {
	const { user } = useUser();

	const router = useRouter();
	const form = useForm<OnboardingForm>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			first_name: "",
			last_name: "",
			grade: "",
		},
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const onSubmit = async (values: OnboardingForm) => {
		setIsSubmitting(true);
		const { success, error } = await completeOnboarding(values);
		if (success) {
			await user?.reload();
			router.push("/dashboard");
		} else if (error) {
			toast.error(error.message);
			setIsSubmitting(false);
		}
	};

	const isLoading = form.formState.isLoading || isSubmitting;

	return (
		<div className="flex flex-col justify-center items-center p-4 min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
			<div className="p-8 space-y-8 w-full max-w-md bg-white rounded-xl shadow-lg">
				<div className="self-start w-fit">
					<h2 className="text-3xl font-bold text-gray-900">Welcome!</h2>
					<p className="text-center text-gray-600">
						Let&apos;s setup your profile
					</p>
				</div>
				<Form {...form}>
					<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="first_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="block text-sm font-medium text-gray-700">
										First name
									</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Enter your first name" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="last_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="block text-sm font-medium text-gray-700">
										Last name
									</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Enter your last name" />
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
						<Button disabled={isLoading}>
							{isLoading && <Loader />}
							Submit
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
