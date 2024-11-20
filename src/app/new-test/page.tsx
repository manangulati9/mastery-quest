import { api } from "@/trpc/server";
import Questionnaire from "./questionnaire";
import { TestItemSchema } from "@/lib/cat";
import { z } from "zod";

export default async function Page() {
	const data = await api.questions.getQuestions();
	const {
		error,
		success,
		data: questions,
	} = z.array(TestItemSchema).safeParse(data);

	if (!success) {
		console.error(error);
		return null;
	}

	const testItem = await api.administerTest.getNextQuestion({
		itemBank: questions,
	});
	return <Questionnaire initialTestItem={testItem} />;
}
