import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  numeric,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().default("username").unique(),
  name: text("name").notNull().default("user"),
  email: text("email").notNull().default("mail@example.com").unique(),
  passwordHash: text("hash").unique(),
  image: text("image"),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const questions = pgTable("questions", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  difficulty: numeric("difficulty", { precision: 5, scale: 2 })
    .notNull()
    .default("0"),
  discrimination: numeric("discrimination", { precision: 5, scale: 2 })
    .notNull()
    .default("1.0"),
  subject: text("subject").notNull(),
  question: text("question").notNull(),
  options: text("options").array().notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userStats = pgTable("user_stats", {
  id: text("id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "restrict" }),
  grade: integer("grade").notNull().default(7),
  totalTestsTaken: integer("total_tests_taken").notNull().default(0),
  averageScore: numeric("average_score", { precision: 5, scale: 2 })
    .notNull()
    .default("0"),
  subjectsMastered: text("subjects_mastered").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const tests = pgTable("tests", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "restrict" }),
  subject: text("subject").notNull(),
  score: numeric("score", { precision: 5, scale: 2 }).notNull(),
  duration: numeric("duration", { precision: 5, scale: 2 }).notNull(),
  totalQuestions: integer("total_questions").notNull(),
  correctAnswers: integer("correct_answers").notNull(),
  testDate: timestamp("test_date", { mode: "date" }).notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
