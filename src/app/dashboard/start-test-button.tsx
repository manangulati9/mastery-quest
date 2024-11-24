"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { getBaseUrl } from "@/lib/utils";
import { Loader } from "@/components/loader";

const formSchema = z.object({
	subject: z.string().min(1, "Please select a subject"),
});

type Data = {
	totalTests: number;
	average: number;
};

export function StartTestButton({ data }: { data: Data }) {
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			subject: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		const url = new URL(`${getBaseUrl()}/new-test`);
		url.searchParams.set("subject", encodeURIComponent(values.subject));
		url.searchParams.set("totalTests", encodeURIComponent(data.totalTests));
		url.searchParams.set("average", encodeURIComponent(data.average));
		router.push(url.toString());
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="hover:bg-purple-700 bg-primary">
					<PlusCircle className="w-4 h-4" />
					Start New Test
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Start a New Test</DialogTitle>
					<DialogDescription>
						Choose your subject and review the test instructions before
						starting.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="subject"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Subject</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a subject" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="Maths">Mathematics</SelectItem>
											<SelectItem value="Science">Science</SelectItem>
											<SelectItem value="Social Science">
												Social Science
											</SelectItem>
											<SelectItem value="English">English</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="space-y-2">
							<h4 className="font-medium">Test Instructions:</h4>
							<ul className="pl-5 text-sm list-disc">
								<li>There is no time limit.</li>
								<li>There are 20 multiple-choice questions.</li>
								<li>Each question has only one correct answer.</li>
								<li>
									You can review and change your answers before submitting.
								</li>
								<li>
									Click &ldquo;Start Test&rquo; when you&apos;re ready to begin.
								</li>
							</ul>
						</div>
						<DialogFooter>
							<Button type="submit" disabled={isLoading}>
								{isLoading && <Loader />}
								Start Test
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
