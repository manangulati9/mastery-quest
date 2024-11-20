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
import { api } from "@/trpc/react";
import { createProfileSchema as formSchema } from "@/zod_schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type TForm = z.infer<typeof formSchema>;

export function CreateProfile() {
	const session = useSession();
	const router = useRouter();
	const form = useForm<TForm>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			grade: "",
		},
	});
	const { mutate, isPending } = api.account.createUserStats.useMutation({
		onSuccess: () => {
			router.push("/dashboard");
		},

		onError: () => {
			toast.error("Something went wrong. Please try again later.");
		},
	});

	if (!session.data) {
		return null;
	}

	const onSubmit = (values: TForm) => {
		mutate(values);
	};

	return (
		<div className="flex flex-col justify-center items-center p-4 min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
			<div className="p-8 space-y-8 w-full max-w-md bg-white rounded-xl shadow-lg">
				<div className="self-start w-fit">
					<h2 className="text-3xl font-bold text-gray-900">
						Hi {session.data.user.name}
					</h2>
					<p className="text-center text-gray-600">Let's setup your profile</p>
				</div>
				<Form {...form}>
					<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
						<Button disabled={isPending}>
							{isPending && <Loader />}
							Submit
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
