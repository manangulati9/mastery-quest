import type { ProgressData } from "@/lib/utils";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { tests, userStats } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";

export const userDataRouter = createTRPCRouter({
  getDashboardData: protectedProcedure.query(async ({ ctx }) => {
    const [[stats], testsData] = await Promise.all([
      ctx.db.select().from(userStats).where(eq(userStats.id, ctx.auth.userId)),
      ctx.db
        .select()
        .from(tests)
        .where(eq(tests.userId, ctx.auth.userId))
        .orderBy(desc(tests.createdAt)),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMonth = today.getMonth();
    const currentMonthTests = testsData.filter(
      (test) => test.createdAt.getMonth() === currentMonth,
    );
    const lastMonthTests = testsData.filter(
      (test) => test.createdAt.getMonth() === currentMonth - 1,
    );

    const currentMonthAverage =
      currentMonthTests.length > 0
        ? currentMonthTests.reduce((sum, test) => {
            return sum + test.score;
          }, 0) / currentMonthTests.length
        : 0;
    const lastMonthAverage =
      lastMonthTests.length > 0
        ? lastMonthTests.reduce((sum, test) => {
            return sum + test.score;
          }, 0) / lastMonthTests.length
        : 0;

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ] as const;

    const progressData: ProgressData[] = [];
    for (let i = 0; i <= currentMonth; i++) {
      const data: ProgressData = {
        month: months[i] ?? "Jan",
        math: 0,
        science: 0,
        english: 0,
        social_science: 0,
      };

      let mathTests = 0;
      let scienceTests = 0;
      let englishTests = 0;
      let socialScienceTests = 0;
      const testArr = testsData.filter(
        (test) => test.createdAt.getMonth() === i,
      );

      for (const test of testArr) {
        switch (test.subject) {
          case "Maths":
            data.math += test.score;
            mathTests++;
            break;
          case "Science":
            data.science += test.score;
            scienceTests++;
            break;
          case "English":
            data.english += test.score;
            englishTests++;
            break;
          case "Social Science":
            data.social_science += test.score;
            socialScienceTests++;
            break;
          default:
            break;
        }
      }

      data.math /= mathTests;
      data.science /= scienceTests;
      data.english /= englishTests;
      data.social_science /= socialScienceTests;

      progressData.push(data);
    }

    const dashboardData = {
      tests: {
        total: stats?.totalTestsTaken ?? testsData.length,
        increment: currentMonthTests.length - lastMonthTests.length,
      },
      average: {
        latest: stats?.averageScore ? Number.parseFloat(stats.averageScore) : 0,
        increment: currentMonthAverage - lastMonthAverage,
      },
      subjectMastered: stats?.subjectsMastered
        ? stats.subjectsMastered.length
        : 0,
      streak: calculateTestStreak(testsData.map((test) => test.createdAt)),
      recentTests: testsData.filter((_, idx) => idx < 3),
      progressData,
    };

    return dashboardData;
  }),
});

function calculateTestStreak(testDates: Date[]): number {
  // If no tests were taken, return 0
  if (testDates.length === 0) return 0;

  // Get today's date at the start of the day
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if the first test was taken today
  const firstTestDate = testDates[0];
  if (!firstTestDate) return 0;
  firstTestDate.setHours(0, 0, 0, 0);

  if (firstTestDate.getTime() !== today.getTime()) return 0;

  // Calculate streak
  let streak = 1;
  for (let i = 1; i < testDates.length; i++) {
    const prevTestDate = testDates[i - 1];
    const currentTestDate = testDates[i];

    if (!prevTestDate || !currentTestDate) {
      break;
    }

    prevTestDate.setHours(0, 0, 0, 0);
    currentTestDate.setHours(0, 0, 0, 0);

    // Calculate days between tests
    const daysDifference = Math.floor(
      (prevTestDate.getTime() - currentTestDate.getTime()) / (1000 * 3600 * 24),
    );

    // Break streak if days between tests is more than 1
    if (daysDifference === 0) {
      continue;
    }

    if (daysDifference > 1) {
      break;
    }

    streak++;
  }

  return streak;
}
