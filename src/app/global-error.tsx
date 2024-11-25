"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<div className="flex flex-col min-h-[100dvh]">
			<header className="flex items-center px-4 h-14 lg:px-6">
				<Link href="/">
					<Logo />
				</Link>
			</header>
			<main className="flex flex-1 justify-center items-center">
				<Card className="mx-auto w-full max-w-md">
					<CardContent className="flex flex-col items-center p-6 space-y-4 text-center">
						<AlertTriangle className="w-12 h-12 text-red-500" />
						<h1 className="text-2xl font-bold tracking-tighter sm:text-3xl">
							Oops! Something went wrong
						</h1>
						<p className="text-gray-600">
							We apologize for the inconvenience. An error has occurred.
						</p>
						<div className="space-y-2 w-full">
							<Button
								onClick={reset}
								className={buttonVariants({
									variant: "default",
									size: "lg",
									className:
										"w-full bg-purple-600 hover:bg-purple-700 text-white",
								})}
							>
								Try again
							</Button>
							<Link
								href="/"
								className={buttonVariants({
									variant: "outline",
									size: "lg",
									className:
										"w-full border-purple-600 text-purple-600 hover:bg-purple-50",
								})}
							>
								Go back home
							</Link>
						</div>
					</CardContent>
				</Card>
			</main>
			<footer className="flex flex-col gap-2 items-center py-6 px-4 w-full border-t sm:flex-row md:px-6 shrink-0">
				<p className="text-xs text-gray-500">
					© 2023 MasteryQuest. All rights reserved.
				</p>
				<nav className="flex gap-4 sm:gap-6 sm:ml-auto">
					<Link className="text-xs hover:underline underline-offset-4" href="#">
						Terms of Service
					</Link>
					<Link className="text-xs hover:underline underline-offset-4" href="#">
						Privacy
					</Link>
				</nav>
			</footer>
		</div>
	);
}
