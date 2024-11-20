import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";

export function Logo({ className }: { className?: string }) {
	return (
		<div
			className={cn("flex justify-center items-center text-primary", className)}
		>
			<BookOpen className="w-8 h-8" />
			<span className="mb-1 ml-2 text-2xl font-bold">MasteryQuest</span>
		</div>
	);
}
