import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { users, userStats } from "@/server/db/schema";
import { signUpSchema } from "@/zod_schemas";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import { signIn } from "@/server/auth";
import { generateUsername } from "@/lib/utils";

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => {
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const usersArray = await ctx.db.select().from(users);

      const newUser = {
        id: nanoid(),
        name: input.name,
        email: input.email,
        passwordHash: hashedPassword,
        verified: true,
        username: generateUsername(input.email, usersArray),
      } satisfies typeof users.$inferInsert;

      const newUserStats = {
        id: newUser.id,
        grade: Number.parseInt(input.grade),
      } satisfies typeof userStats.$inferInsert;

      await ctx.db.insert(users).values(newUser);
      await ctx.db.insert(userStats).values(newUserStats);
      await signIn("credentials", {
        redirect: false,
        email: input.email,
        password: input.password,
      });
    }),
});
