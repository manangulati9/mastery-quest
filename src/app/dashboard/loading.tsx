import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Home, Settings, User, BarChart } from "lucide-react";
import { Logo } from "@/components/logo";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
	return (
		<SidebarProvider>
			<div className="flex w-full h-full bg-gray-100">
				<Sidebar>
					<SidebarHeader>
						<Link href="/">
							<Logo />
						</Link>
					</SidebarHeader>
					<SidebarContent className="p-4">
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link
										href="/dashboard"
										className={buttonVariants({
											variant: "ghost",
											className: "!justify-start",
										})}
									>
										<Home className="mr-1 w-4 h-4" />
										Dashboard
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Button variant="ghost" className="justify-start" disabled>
										<User className="mr-1 w-4 h-4" />
										Profile
									</Button>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Button variant="ghost" className="justify-start" disabled>
										<Settings className="mr-1 w-4 h-4" />
										Settings
									</Button>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarContent>
					<SidebarFooter>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Button variant="ghost" className="justify-start w-full">
										Logout
									</Button>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarFooter>
				</Sidebar>

				<div className="flex overflow-hidden flex-col flex-1">
					<header className="flex justify-between items-center p-4 bg-white border-b">
						<div className="flex items-center">
							<SidebarTrigger className="mr-4" />
							<h1 className="text-2xl font-bold">Dashboard</h1>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="relative w-8 h-8 rounded-full"
								>
									<User className="w-4 h-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56" align="end" forceMount>
								<DropdownMenuLabel className="font-normal">
									<div className="flex flex-col space-y-1">
										<Skeleton className="h-4 w-[200px]" />
										<Skeleton className="h-3 w-[150px]" />
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem disabled>
									<User className="mr-2 w-4 h-4" />
									<span>Profile</span>
								</DropdownMenuItem>
								<DropdownMenuItem disabled>
									<Settings className="mr-2 w-4 h-4" />
									<span>Settings</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem disabled>
									<span>Logout</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</header>

					<main className="overflow-y-auto overflow-x-hidden flex-1 bg-gray-100">
						<div className="container py-8 px-6 mx-auto">
							<div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
								{Array.from({ length: 4 }).map((_, index) => (
									<Card key={index}>
										<CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
											<CardTitle className="text-sm font-medium">
												<Skeleton className="h-4 w-[100px]" />
											</CardTitle>
											<BarChart className="w-4 h-4 text-muted-foreground" />
										</CardHeader>
										<CardContent>
											<Skeleton className="mb-2 h-6 w-[60px]" />
											<Skeleton className="h-3 w-[100px]" />
										</CardContent>
									</Card>
								))}
							</div>

							<div className="grid gap-6 mb-8 md:grid-cols-2">
								<Card>
									<CardHeader>
										<CardTitle>Recent Tests</CardTitle>
										<Skeleton className="h-4 w-[200px]" />
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{Array.from({ length: 3 }).map((_, index) => (
												<div key={index} className="flex items-center">
													<div className="ml-4 space-y-1">
														<Skeleton className="h-4 w-[150px]" />
														<Skeleton className="h-3 w-[200px]" />
													</div>
													<div className="ml-auto">
														<Skeleton className="h-4 w-[80px]" />
													</div>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle>Progress Chart</CardTitle>
										<Skeleton className="h-4 w-[200px]" />
									</CardHeader>
									<CardContent>
										<Skeleton className="w-full h-[200px]" />
									</CardContent>
								</Card>
							</div>
							<div className="text-center">
								<Skeleton className="mx-auto h-10 w-[200px]" />
							</div>
						</div>
					</main>
				</div>
			</div>
		</SidebarProvider>
	);
}
