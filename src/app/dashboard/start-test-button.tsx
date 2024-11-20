import { Button } from "@/components/ui/button";
import { LoaderCircle, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function StartTestButton() {
	const router = useRouter();

	const startNewTest = async () => {
		router.push("/new-test");
	};

	return (
		<div className="text-center">
			<Button
				onClick={startNewTest}
				className="bg-primary hover:bg-purple-700"
			>
				<PlusCircle className="w-4 h-4" />
				Start New Test
			</Button>
		</div>
	);
}
