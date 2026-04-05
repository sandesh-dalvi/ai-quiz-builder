"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuiz } from "@/hooks/useQuizzes";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { toast } from "sonner";

type Option = {
  id: string;
  text: string;
};

function TakeQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: quiz, isLoading } = useQuiz(id);
  const router = useRouter();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-4 w-full rounded-full" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!quiz) return <p className="text-zinc-500">Quiz not found.</p>;

  if (quiz.questions.length === 0) {
    return (
      <div className=" max-w-2xl ">
        <Card>
          <CardContent className=" flex flex-col items-center justify-center py-16 gap-3">
            <p className=" text-muted-foreground font-medium">
              No questions in this quiz yet.
            </p>
            <Button
              variant={"outline"}
              onClick={() => router.push(`/quizzes/${id}`)}
            >
              Go back and add questions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = quiz.questions[current];
  const options = question.options as Option[];
  const totalQuestions = quiz.questions.length;
  const progress = ((current + 1) / totalQuestions) * 100;
  const answeredCount = Object.keys(answers).length;
  const isLast = current === totalQuestions - 1;

  const handleSelect = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
  };

  const handleSubmit = async () => {
    if (answeredCount < totalQuestions) {
      const unanswered = totalQuestions - answeredCount;
      const confirmed = window.confirm(
        `You have ${unanswered} unanswered question${unanswered > 1 ? "s" : ""}. Submit anyway?`,
      );
      if (!confirmed) return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId: id, answers }),
      });

      if (!res.ok) throw new Error();

      // console.log(res);
      const data = await res.json();

      router.push(
        `/quizzes/${id}/results?score=${data.score}&total=${data.total}&attemptId=${data.attempt.id}`,
      );
    } catch (error) {
      toast.error("Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className=" max-w-3xl space-y-6">
      <div className=" container flex items-center justify-between text-sm">
        <span className=" font-medium text-foreground">{quiz.title}</span>
        <span className=" text-muted-foreground/60">
          {current + 1}/{totalQuestions}
        </span>
      </div>

      {/* proogress bar */}
      <div className="">
        <div className=" w-full h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
          <div
            className=" h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className=" flex justify-between text-xs text-muted-foreground/80">
          <span>{answeredCount} answered</span>
          <span>{totalQuestions - answeredCount} remaining</span>
        </div>
      </div>

      <Card className=" shadow-sm">
        <CardContent className=" pt-6 space-y-5">
          <p className=" text-base font-semibold leading-relaxed">
            {question.text}
          </p>

          <div className=" space-y-2">
            {options.map((option) => {
              const selected = answers[question.id] === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={cn(
                    " w-full text-left px-4 py-3 rounded-lg border-2 text-sm transition-all",
                    selected
                      ? " border-primary bg-primary/10 text-primary-foreground font-medium"
                      : " border-muted-foreground/50 text-foreground/90 hover:border-muted-foreground/70 hover:bg-muted-foreground/10",
                  )}
                >
                  <span className=" font-bold mr-2 text-muted-foreground">
                    {option.id.toUpperCase()}
                  </span>{" "}
                  {option.text}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className=" flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>

        <div className="flex gap-1">
          {quiz.questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrent(i)}
              className={cn(
                "w-7 h-7 rounded-full text-xs font-medium transition-colors",
                i === current
                  ? "bg-primary text-foreground"
                  : answers[q.id]
                    ? "bg-primary/20 text-primary-foreground"
                    : "bg-muted-foreground/10 text-muted-foreground hover:bg-muted-foreground/20",
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
        {isLast ? (
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4 mr-1" />
            {submitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        ) : (
          <Button
            onClick={() =>
              setCurrent((c) => Math.min(totalQuestions - 1, c + 1))
            }
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default TakeQuizPage;
