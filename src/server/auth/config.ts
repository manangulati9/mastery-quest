import {
  CredentialsSignin,
  type DefaultSession,
  type NextAuthConfig,
} from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { env } from "@/env";
import { loginSchema } from "@/zod_schemas";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { generateUsername } from "@/lib/utils";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig: NextAuthConfig = {
  callbacks: {
    session: ({ session, token }) => {
      if (!token.sub) {
        return session;
      }
      session.user.id = token.sub;
      return session;
    },
    signIn: async ({ user, account }) => {
      if (!account) {
        console.log("Account is null");
        return false;
      }

      if (account.provider === "google") {
        if (!user.id || !user.email || !user.name || !user.image) {
          return false;
        }

        const usersArray = await db.select().from(users);
        const usr = usersArray.find((u) => u.email === user.email);
        if (usr) {
          return true;
        }

        const id = nanoid();
        user.id = id;
        const newUser: typeof users.$inferInsert = {
          id,
          username: generateUsername(user.email, usersArray),
          verified: true,
          name: user.name,
          email: user.email,
          image: user.image,
        };

        await db.insert(users).values(newUser);
        return true;
      }

      return true;
    },
  },
  providers: [
    Google({
      name: "google",
      clientId: env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
        saveSession: { label: "saveSession" },
      },
      async authorize(credentials) {
        const result = loginSchema.safeParse(credentials);

        if (!result.success) {
          class ParseError extends CredentialsSignin {
            code = "Error parsing credentials";
          }
          throw new ParseError();
        }

        const validatedCreds = result.data;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, validatedCreds.email));

        if (!user || !user.passwordHash) {
          class NotFound extends CredentialsSignin {
            code = "Account doesn't exist. Please sign up instead.";
          }
          throw new NotFound();
        }

        const passwordsMatch = await bcrypt.compare(
          validatedCreds.password,
          user.passwordHash,
        );

        if (!passwordsMatch) {
          class WrongPassword extends CredentialsSignin {
            code = "Passwords don't match. Please try again.";
          }
          throw new WrongPassword();
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
};
