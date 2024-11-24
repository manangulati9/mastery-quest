import { api } from "@/trpc/server";
import Questionnaire from "./questionnaire";
import { TestItemSchema } from "@/lib/cat";
import { z } from "zod";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const subjectSchema = z.object({
	subject: z.enum(["Maths", "Science", "Social Science", "English"]),
	totalTests: z.coerce.number(),
	average: z.coerce.number(),
});

export default async function Page(props: {
	searchParams: SearchParams;
}) {
	const searchParams = await props.searchParams;
	for (const param in searchParams) {
		let value = searchParams[param];
		if (typeof value === "string") {
			value = decodeURIComponent(value);
		} else {
			throw new Error("Invalid query param");
		}
	}

	const { subject, ...rest } = subjectSchema.parse(searchParams);
	const data = await api.questions.getQuestions(subject);
	const questions = z.array(TestItemSchema).parse(data);

	const testItem = await api.administerTest.getNextQuestion({
		itemBank: questions,
	});

	return (
		<Questionnaire data={{ initialTestItem: testItem, currentStats: rest }} />
	);
}
