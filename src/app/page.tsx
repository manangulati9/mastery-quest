import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Medal, Star } from "lucide-react";
import Link from "next/link";

export default function Page() {
	return (
		<div className="flex flex-col min-h-[100dvh]">
			<header className="flex items-center px-4 h-14 lg:px-6">
				<Link href="#">
					<Logo />
				</Link>
				<nav className="flex gap-4 ml-auto sm:gap-6">
					<Link
						className="text-sm font-medium hover:underline underline-offset-4"
						href="#features"
					>
						Features
					</Link>
					<Link
						className="text-sm font-medium hover:underline underline-offset-4"
						href="#testimonials"
					>
						Testimonials
					</Link>
					<Link
						className="text-sm font-medium hover:underline underline-offset-4"
						href="#pricing"
					>
						Pricing
					</Link>
				</nav>
			</header>
			<main className="flex-1">
				<section className="flex flex-col justify-center items-center py-12 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 md:py-24 lg:py-32 xl:py-48">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center space-y-4 text-center text-white">
							<div className="space-y-2">
								<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
									Master Your Knowledge with MasteryQuest
								</h1>
								<p className="mx-auto text-lg sm:text-xl max-w-[700px]">
									Adaptive learning for grades 7-10. Personalized tests that
									grow with you.
								</p>
							</div>
							<div className="space-x-4">
								<Button
									className="text-purple-600 bg-white hover:bg-gray-100"
									size="lg"
								>
									Start Free Trial
								</Button>
								<Button
									variant="outline"
									className="text-white bg-transparent border-white hover:text-purple-600 hover:bg-white"
									size="lg"
								>
									Learn More
								</Button>
							</div>
						</div>
					</div>
				</section>
				<section
					id="features"
					className="flex flex-col justify-center items-center py-12 w-full bg-gray-100 md:py-24 lg:py-32"
				>
					<div className="px-4 md:px-6">
						<h2 className="mb-8 text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl">
							Why Choose MasteryQuest?
						</h2>
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
							<Card>
								<CardContent className="flex flex-col items-center p-6 space-y-4">
									<Brain className="w-12 h-12 text-purple-500" />
									<h3 className="text-xl font-bold">
										Computer Adaptive Testing
									</h3>
									<p className="text-center text-gray-600">
										Our CAT technology adjusts question difficulty based on your
										performance, ensuring optimal learning.
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="flex flex-col items-center p-6 space-y-4">
									<Medal className="w-12 h-12 text-purple-500" />
									<h3 className="text-xl font-bold">Personalized Learning</h3>
									<p className="text-center text-gray-600">
										Tailored tests and feedback to help you improve in areas
										where you need it most.
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="flex flex-col items-center p-6 space-y-4">
									<Star className="w-12 h-12 text-purple-500" />
									<h3 className="text-xl font-bold">Progress Tracking</h3>
									<p className="text-center text-gray-600">
										Monitor your growth with detailed analytics and performance
										insights.
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>
				<section
					id="testimonials"
					className="flex flex-col justify-center items-center py-12 w-full md:py-24 lg:py-32"
				>
					<div className="container px-4 md:px-6">
						<h2 className="mb-8 text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl">
							What Our Users Say
						</h2>
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
							{[
								{
									name: "Sarah, Grade 8",
									quote:
										"MasteryQuest helped me improve my math scores so much! The adaptive questions really challenged me.",
								},
								{
									name: "Alex, Grade 10",
									quote:
										"I love how MasteryQuest adapts to my level. It's like having a personal tutor that knows exactly what I need to work on.",
								},
								{
									name: "Mrs. Johnson, Parent",
									quote:
										"As a parent, I appreciate the detailed progress reports. It's great to see my child's improvement over time.",
								},
							].map((testimonial) => (
								<Card key={testimonial.name}>
									<CardContent className="p-6">
										<p className="mb-4 text-gray-600">"{testimonial.quote}"</p>
										<p className="font-semibold">{testimonial.name}</p>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</section>
				<section
					id="cta"
					className="flex flex-col justify-center items-center py-12 w-full text-white md:py-24 lg:py-32 bg-primary"
				>
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center space-y-4 text-center">
							<div className="space-y-2">
								<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
									Ready to Start Your Learning Journey?
								</h2>
								<p className="mx-auto text-lg sm:text-xl max-w-[700px]">
									Join MasteryQuest today and experience the power of adaptive
									learning.
								</p>
							</div>
							<Button
								className="text-purple-600 bg-white hover:bg-gray-100"
								size="lg"
							>
								Start Free Trial
							</Button>
						</div>
					</div>
				</section>
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
