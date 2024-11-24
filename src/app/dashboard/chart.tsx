"use client";

import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { ProgressData } from "@/lib/utils";
import {
	Line,
	LineChart,
	XAxis,
	YAxis,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
} from "recharts";

export function Chart({ progressData }: { progressData: ProgressData[] }) {
	return (
		<ChartContainer
			config={{
				maths: {
					label: "Maths",
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
				social_science: {
					label: "Social Science",
					color: "hsl(var(--chart-4))",
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
						dataKey="maths"
						stroke="var(--color-maths)"
						name="Maths"
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
					<Line
						type="monotone"
						dataKey="social_science"
						stroke="var(--color-social_science)"
						name="Social Science"
					/>
				</LineChart>
			</ResponsiveContainer>
		</ChartContainer>
	);
}
