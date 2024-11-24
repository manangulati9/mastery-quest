import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import { Chart } from "./chart";
import { LogoutButton, LogoutDropdownItem } from "./logout-button";
import { api } from "@/trpc/server";
import { StartTestButton } from "./start-test-button";
import { currentUser } from "@clerk/nextjs/server";

export default async function Dashboard() {
	const user = await currentUser();

	if (!user) {
		throw new Error("User is null");
	}

	const { emailAddresses, fullName } = user;

	const { tests, average, subjectMastered, streak, recentTests, progressData } =
		await api.userData.getDashboardData();

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
									<LogoutButton />
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
										<p className="text-sm font-medium leading-none">
											{fullName}
										</p>
										{emailAddresses[0]?.emailAddress && (
											<p className="text-xs leading-none text-muted-foreground">
												{emailAddresses[0].emailAddress}
											</p>
										)}
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
								<LogoutDropdownItem />
							</DropdownMenuContent>
						</DropdownMenu>
					</header>

					<main className="overflow-y-auto overflow-x-hidden flex-1 bg-gray-100">
						<div className="container py-8 px-6 mx-auto">
							<div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
								<Card>
									<CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
										<CardTitle className="text-sm font-medium">
											Total Tests Taken
										</CardTitle>
										<BarChart className="w-4 h-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{tests.total}</div>
										<p className="text-xs text-muted-foreground">
											{`${tests.increment >= 0 && "+"}${tests.increment}`} from
											last month
										</p>
									</CardContent>
								</Card>
								<Card>
									<CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
										<CardTitle className="text-sm font-medium">
											Average Score
										</CardTitle>
										<BarChart className="w-4 h-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{average.latest}</div>
										<p className="text-xs text-muted-foreground">
											{`${average.increment >= 0 && "+"}${average.increment}`}{" "}
											from last month
										</p>
									</CardContent>
								</Card>
								<Card>
									<CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
										<CardTitle className="text-sm font-medium">
											Subjects Mastered
										</CardTitle>
										<BarChart className="w-4 h-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{subjectMastered}</div>
										<p className="text-xs text-muted-foreground">
											{subjectMastered > 0
												? "Good going!"
												: "Better get started!"}
										</p>
									</CardContent>
								</Card>
								<Card>
									<CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
										<CardTitle className="text-sm font-medium">
											Learning Streak
										</CardTitle>
										<BarChart className="w-4 h-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{streak} day(s)</div>
										<p className="text-xs text-muted-foreground">
											{streak > 0 ? "Keep it up!" : "Better get started!"}
										</p>
									</CardContent>
								</Card>
							</div>

							<div className="grid gap-6 mb-8 md:grid-cols-2">
								<Card>
									<CardHeader>
										<CardTitle>Recent Tests</CardTitle>
										<CardDescription>Your last 3 test results</CardDescription>
									</CardHeader>
									<CardContent>
										{recentTests.length > 0 ? (
											<div className="space-y-4">
												{recentTests.map((test) => (
													<div key={test.id} className="flex items-center">
														<div className="ml-4 space-y-1">
															<p className="text-sm font-medium leading-none">
																{test.subject}
															</p>
															<p className="text-sm text-muted-foreground">
																Score: {(test.score / 20) * 100}% | Date:{" "}
																{`${test.createdAt.getDate()}-${test.createdAt.getMonth()}-${test.createdAt.getFullYear()}`}
															</p>
														</div>
														<div className="ml-auto font-medium">
															{(test.score / 20) * 100 >= 90
																? "Excellent"
																: (test.score / 20) * 100 >= 75
																	? "Good"
																	: "Needs Improvement"}
														</div>
													</div>
												))}
											</div>
										) : (
											<div className="flex justify-center items-center h-full">
												<h2 className="text-2xl font-bold">No tests found</h2>
											</div>
										)}
									</CardContent>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle>Progress Chart</CardTitle>
										<CardDescription>
											Your performance over time
										</CardDescription>
									</CardHeader>
									<CardContent>
										<Chart progressData={progressData} />
									</CardContent>
								</Card>
							</div>
							<div className="text-center">
								<StartTestButton
									data={{ totalTests: tests.total, average: average.latest }}
								/>
							</div>
						</div>
					</main>
				</div>
			</div>
		</SidebarProvider>
	);
}
