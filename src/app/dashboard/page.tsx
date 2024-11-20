"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Home, Settings, User, LogOut, BarChart } from "lucide-react";
import {
	Line,
	LineChart,
	XAxis,
	YAxis,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { StartTestButton } from "./start-test-button";
import { Logo } from "@/components/logo";
import { signOut } from "next-auth/react";

// Mock data for previous tests
const previousTests = [
	{ id: 1, subject: "Mathematics", score: 85, date: "2023-05-15" },
	{ id: 2, subject: "Science", score: 92, date: "2023-05-20" },
	{ id: 3, subject: "English", score: 78, date: "2023-05-25" },
];

// Mock data for progress chart
const progressData = [
	{ month: "Jan", math: 65, science: 70, english: 60 },
	{ month: "Feb", math: 68, science: 72, english: 62 },
	{ month: "Mar", math: 75, science: 78, english: 70 },
	{ month: "Apr", math: 80, science: 82, english: 75 },
	{ month: "May", math: 85, science: 88, english: 80 },
];

export default function Dashboard() {
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
									<Link href="/dashboard">
										<Home className="mr-2 w-4 h-4" />
										Dashboard
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link href="/profile">
										<User className="mr-2 w-4 h-4" />
										Profile
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link href="/settings">
										<Settings className="mr-2 w-4 h-4" />
										Settings
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarContent>
					<SidebarFooter>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Button
										variant="ghost"
										className="flex justify-start items-center"
										onClick={async () => {
											await signOut({
												redirectTo: "/",
											});
										}}
									>
										<LogOut className="mr-2 w-4 h-4" />
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
										<p className="text-sm font-medium leading-none">John Doe</p>
										<p className="text-xs leading-none text-muted-foreground">
											john.doe@example.com
										</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<User className="mr-2 w-4 h-4" />
									<span>Profile</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Settings className="mr-2 w-4 h-4" />
									<span>Settings</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<LogOut className="mr-2 w-4 h-4" />
									<span>Log out</span>
								</DropdownMenuItem>
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
										<div className="text-2xl font-bold">15</div>
										<p className="text-xs text-muted-foreground">
											+2 from last month
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
										<div className="text-2xl font-bold">85%</div>
										<p className="text-xs text-muted-foreground">
											+5% from last month
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
										<div className="text-2xl font-bold">3</div>
										<p className="text-xs text-muted-foreground">
											+1 from last month
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
										<div className="text-2xl font-bold">7 days</div>
										<p className="text-xs text-muted-foreground">Keep it up!</p>
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
										<div className="space-y-4">
											{previousTests.map((test) => (
												<div key={test.id} className="flex items-center">
													<div className="ml-4 space-y-1">
														<p className="text-sm font-medium leading-none">
															{test.subject}
														</p>
														<p className="text-sm text-muted-foreground">
															Score: {test.score}% | Date: {test.date}
														</p>
													</div>
													<div className="ml-auto font-medium">
														{test.score >= 90
															? "Excellent"
															: test.score >= 75
																? "Good"
																: "Needs Improvement"}
													</div>
												</div>
											))}
										</div>
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
										<ChartContainer
											config={{
												math: {
													label: "Math",
													color: "hsl(var(--chart-1))",
												},
												science: {
													label: "Science",
													color: "hsl(var(--chart-2))",
												},
												english: {
													label: "English",
													color: "hsl(var(--chart-3))",
												},
											}}
											className="h-[300px]"
										>
											<ResponsiveContainer width="100%" height="100%">
												<LineChart data={progressData}>
													<CartesianGrid strokeDasharray="3 3" />
													<XAxis dataKey="month" />
													<YAxis />
													<ChartTooltip content={<ChartTooltipContent />} />
													<Legend />
													<Line
														type="monotone"
														dataKey="math"
														stroke="var(--color-math)"
														name="Math"
													/>
													<Line
														type="monotone"
														dataKey="science"
														stroke="var(--color-science)"
														name="Science"
													/>
													<Line
														type="monotone"
														dataKey="english"
														stroke="var(--color-english)"
														name="English"
													/>
												</LineChart>
											</ResponsiveContainer>
										</ChartContainer>
									</CardContent>
								</Card>
							</div>

							<StartTestButton />
						</div>
					</main>
				</div>
			</div>
		</SidebarProvider>
	);
}
