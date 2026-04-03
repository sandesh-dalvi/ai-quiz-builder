import { z } from "zod";

export const QuizSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  topic: z.string().min(3, "Topic must be at least 3 characters long"),
  description: z.string().optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
});

export const QuestionSchema = z.object({
  text: z.string().min(5, "Question text is reuired"),
  options: z
    .array(
      z.object({
        id: z.string(),
        text: z.string().min(1, "Option text is required"),
      }),
    )
    .length(4, "Exactly 4 options are required"),
  correctOption: z.string().min(1, "Correct option is required"),
  explanation: z.string().optional(),
  order: z.number().default(0),
});

export const GenerateQuestionsSchema = z.object({
  topic: z.string().min(2),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  count: z.number().min(1).max(15),
});

export type QuizInput = z.infer<typeof QuizSchema>;
export type QuestionInput = z.infer<typeof QuestionSchema>;
export type GenerateQuestionsInput = z.infer<typeof GenerateQuestionsSchema>;
