"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { RouterOutput } from "@/server/api/root";
import { api } from "@/trpc/react";
import { Logo } from "@/components/logo";
import { Loader } from "@/components/loader";
import Link from "next/link";

type Props = {
	data: {
		initialTestItem: RouterOutput["administerTest"]["getNextQuestion"];
		currentStats: {
			totalTests: number;
			average: number;
		};
	};
};

export default function Questionnaire({ data }: Props) {
	const { initialTestItem, currentStats } = data;
	const [testItem, setTestItem] = useState(initialTestItem);

	const { isPending: isFetching, mutateAsync: fetchQuestion } =
		api.administerTest.getNextQuestion.useMutation();

	const { isPending: isProcessing, mutateAsync: processAnswer } =
		api.administerTest.processResponse.useMutation();

	const { isPending: isSubmitting, mutateAsync: submitTest } =
		api.administerTest.submitTest.useMutation();

	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
	const [selectedAnswer, setSelectedAnswer] = useState("");
	const [quizCompleted, setQuizCompleted] = useState(false);

	const currentQuestion = testItem.question;
	const state = testItem.state;
	const isLoading = isProcessing || isFetching || isSubmitting;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (currentQuestionIndex < 20) {
			const ans = {
				state,
				response: {
					questionId: currentQuestion.id,
					selectedAnswer,
				},
			};
			console.log("Ans: ", ans);
			const newState = await processAnswer(ans);
			const newTestItem = await fetchQuestion(newState);
			setTestItem(newTestItem);
			setCurrentQuestionIndex((prev) => prev + 1);
			setSelectedAnswer("");
		} else {
			await submitTest({
				subject: initialTestItem.question.subject,
				score: testItem.state.score,
				totalQuestions: 20,
				...currentStats,
			});
			setQuizCompleted(true);
		}
	};

	const restartQuiz = async () => {
		const newTestItem = await fetchQuestion({
			itemBank: initialTestItem.state.itemBank,
		});
		setTestItem(newTestItem);
		setCurrentQuestionIndex(1);
		setSelectedAnswer("");
		setQuizCompleted(false);
	};

	if (quizCompleted) {
		return (
			<div className="flex flex-col justify-center items-center p-4 min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle className="text-2xl font-bold text-center">
							Quiz Completed!
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-lg text-center">
							Your score: {state.score} out of 20
						</p>
					</CardContent>
					<CardFooter className="flex gap-4 justify-center">
						<Link
							href="/dashboard"
							className={buttonVariants({
								variant: "outline",
							})}
						>
							Dashboard
						</Link>
						<Button onClick={restartQuiz} disabled={isLoading}>
							{isLoading && <Loader />}
							Restart Quiz
						</Button>
					</CardFooter>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex flex-col justify-center items-center p-4 min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<Logo className="mb-4" />
					<CardTitle className="text-2xl font-bold text-center">
						Question {currentQuestionIndex}
					</CardTitle>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent>
						<div className="space-y-4">
							<p className="text-lg font-medium text-center">
								{currentQuestion.question}
							</p>
							<RadioGroup
								value={selectedAnswer}
								onValueChange={setSelectedAnswer}
							>
								{currentQuestion.options.map((option, index) => (
									<div key={option} className="flex items-center space-x-2">
										<RadioGroupItem value={option} id={`option-${index}`} />
										<Label htmlFor={`option-${index}`}>{option}</Label>
									</div>
								))}
							</RadioGroup>
						</div>
					</CardContent>
					<CardFooter>
						<Button
							type="submit"
							className="w-full bg-primary"
							disabled={isLoading || !selectedAnswer}
						>
							{isLoading && <Loader />}
							{currentQuestionIndex === 20 ? "Finish" : "Next Question"}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
