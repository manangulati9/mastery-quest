import { api } from "@/trpc/server";
import Questionnaire from "./questionnaire";
import { TestItemSchema } from "@/lib/cat";
import { z } from "zod";
import { decodeParams, type SearchParams } from "@/lib/utils";

const subjectSchema = z.object({
	subject: z.enum(["Maths", "Science", "Social Science", "English"]),
	totalTests: z.coerce.number(),
	average: z.coerce.number(),
});

export default async function Page(props: {
	searchParams: SearchParams;
}) {
	const searchParams = await props.searchParams;
	const decodedParams = decodeParams(searchParams);
	const { subject, ...rest } = subjectSchema.parse(decodedParams);
	const data = await api.questions.getQuestions(subject);
	const questions = z.array(TestItemSchema).parse(data);

	const testItem = await api.administerTest.getNextQuestion({
		itemBank: questions,
	});

	return (
		<Questionnaire data={{ initialTestItem: testItem, currentStats: rest }} />
	);
}
