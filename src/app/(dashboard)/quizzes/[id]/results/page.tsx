"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuiz } from "@/hooks/useQuizzes";
import { cn } from "@/lib/utils";
import { CheckCircle2, Home, RotateCcw, Trophy } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { use } from "react";

type Option = { id: string; text: string };
export default function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: quiz, isLoading } = useQuiz(id);

  const score = Number(searchParams.get("score") ?? 0);
  const total = Number(searchParams.get("total") ?? 0);
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const getGrade = () => {
    if (percentage >= 90)
      return { label: "Excellent! 🎉", color: "text-emerald-600" };
    if (percentage >= 70)
      return { label: "Good job! 👍", color: "text-violet-600" };
    if (percentage >= 50)
      return { label: "Keep practicing! 💪", color: "text-amber-600" };
    return { label: "Need more study 📚", color: "text-red-500" };
  };

  const grade = getGrade();

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  return (
    <section className=" max-w-3xl space-y-6">
      <Card className=" text-center overflow-hidden p-0">
        <div className=" bg-linear-to-br from-primary to-primary-foreground px-6 py-10">
          <div className=" w-20 h-20 rounded-full bg-background/20 flex items-center justify-center mx-auto mb-4">
            <Trophy className=" w-10 h-10 text-secondary" />
          </div>
          <h1 className=" text-secondary text-2xl font-bold mb-1">
            Quiz Complete
          </h1>
          <p className=" text-secondary/50 text-sm">{quiz?.title}</p>
        </div>

        <CardContent className=" py-6 space-y-4">
          <p className=" text-5xl font-bold text-foreground">{percentage}%</p>
          <p className={` text-lg font-semibold mt-1 ${grade.color}`}>
            {grade.label}
          </p>

          <p className=" text-muted-foreground text-sm">
            You got{" "}
            <span className=" font-semibold text-foreground">{score}</span> out
            of <span className=" font-semibold text-foreground">{total}</span>
          </p>

          {/* Score */}
          <div className=" w-full h-3 bg-muted-foreground/10 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                percentage >= 70
                  ? "bg-emerald-500"
                  : percentage >= 50
                    ? " bg-amber-500"
                    : " bg-red-500",
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push(`/quizzes/${id}/take`)}
            >
              <RotateCcw className="w-4 h-4 mr-1" /> Retake
            </Button>
            <Link href="/dashboard" className="flex-1">
              <Button className="w-full bg-primary hover:bg-primary/90">
                <Home className="w-4 h-4 mr-1" /> Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Answers */}

      {quiz && (
        <div className=" space-y-3">
          <h2 className=" font-semibold">Answers Breakdown</h2>
          {quiz.questions.map((question, idx) => {
            const options = question.options as Option[];
            const correctOpt = options.find(
              (o) => o.id === question.correctOption,
            );

            return (
              <Card key={question.id} className=" shadow-sm">
                <CardContent className=" pt-4 space-y-3">
                  <div className=" flex items-start gap-3">
                    <span className=" shrink-0 mt-1">
                      <CheckCircle2 className=" w-4 h-4 text-emerald-500" />
                    </span>

                    <div className=" space-y-2 flex-1">
                      <p className=" text-sm font-medium text-foreground">
                        Q{idx + 1}. {question.text}
                      </p>
                      <div className=" grid grid-cols-1 md:grid-cols-2 gap-2">
                        {options.map((option) => (
                          <div
                            key={option.id}
                            className={cn(
                              " text-xs px-2 py-1 rounded-md border",
                              option.id === question.correctOption
                                ? " border-emerald-300 bg-emerald-50 text-emerald-800"
                                : " border-gray-200 text-gray-600",
                            )}
                          >
                            {option.id.toUpperCase()}. {option.text}
                          </div>
                        ))}
                      </div>
                      {question.explanation && (
                        <p className=" text-xs text-muted-foreground/60 italic">
                          {question.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
