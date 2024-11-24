import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

export function LogoutButton() {
	return (
		<SignOutButton>
			<Button
				variant="ghost"
				className="flex justify-start items-center w-full"
			>
				<LogOut className="mr-1 w-4 h-4" />
				Logout
			</Button>
		</SignOutButton>
	);
}

export function LogoutDropdownItem() {
	return (
		<DropdownMenuItem className="cursor-pointer">
			<SignOutButton>
				<Button variant="ghost" className="p-0 h-fit">
					<LogOut className="mr-2 w-4 h-4" />
					<span>Log out</span>
				</Button>
			</SignOutButton>
		</DropdownMenuItem>
	);
}
