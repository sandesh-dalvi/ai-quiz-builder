export type QuestionOption = {
  id: string;
  text: string;
};

export type QuestionData = {
  id: string;
  text: string;
  options: QuestionOption[];
  correctOption: string;
  explanation?: string | null;
  order: number;
};

export type QuizWithQuestions = {
  id: string;
  title: string;
  topic: string;
  description?: string | null;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  userId: string;
  createdAt: string;
  updatedAt: string;
  questions: QuestionData[];
  _count?: { attempts: number };
};
