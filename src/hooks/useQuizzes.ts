"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type Quiz = {
  id: string;
  title: string;
  topic: string;
  description?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  createdAt: string;
  _count: { questions: number; attempts: number };
};

export type Question = {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctOption: string;
  explanation?: string;
  order: number;
};

export type QuizWithQuestions = Quiz & { questions: Question[] };

// Fetch all quizzes
export function useQuizzes() {
  return useQuery<Quiz[]>({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const res = await fetch("/api/quizzes");
      if (!res.ok) throw new Error("Failed to fetch quizzes");
      return res.json();
    },
  });
}

// Fetch a single quiz with questions
export function useQuiz(id: string) {
  return useQuery<QuizWithQuestions>({
    queryKey: ["quiz", id],
    queryFn: async () => {
      const res = await fetch(`/api/quizzes/${id}`);
      if (!res.ok) throw new Error("Failed to fetch quiz");
      return res.json();
    },
  });
}

// Delete a quiz
export function useDeleteQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/quizzes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete quiz");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      toast.success("Quiz deleted successfully");
    },
    onError: () => toast.error("Failed to delete quiz"),
  });
}

// Delete question
export function useDeleteQuestion(quizId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questionId: string) => {
      const res = await fetch(
        `/api/quizzes/${quizId}/questions/${questionId}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error("Failed to delete question");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
      toast.success("Question deleted successfully");
    },
    onError: () => toast.error("Failed to delete question"),
  });
}
