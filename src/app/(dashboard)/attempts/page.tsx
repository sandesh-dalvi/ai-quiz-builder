"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Trophy } from "lucide-react";
import Link from "next/link";

type Attempt = {
  id: string;
  score: number;
  total: number;
  createdAt: string;
  quiz: { title: string; topic: string };
};

function AttemptsPage() {
  const { data: attempts, isLoading } = useQuery<Attempt[]>({
    queryKey: ["attempts"],
    queryFn: async () => {
      const res = await fetch("/api/attempts");
      if (!res.ok) throw new Error();
      return res.json();
    },
  });

  return (
    <section className=" space-y-6">
      <div className=" container">
        <h1 className=" text-2xl font-bold">Attempt History</h1>
        <p className=" text-sm text-muted-foreground mt-1">
          All your past quiz attempts
        </p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && attempts?.length === 0 && (
        <Card className="border-dashed shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
            <Trophy className="w-10 h-10 text-muted-foreground/60" />
            <p className="text-muted-foreground/80 font-medium">
              No attempts yet
            </p>
            <p className="text-muted-foreground/90 text-sm">
              Take a quiz to see your history here
            </p>
            <Link
              href="/quizzes"
              className="text-primary text-sm font-medium hover:underline"
            >
              Browse quizzes →
            </Link>
          </CardContent>
        </Card>
      )}

      <div className=" container max-w-3xl space-y-2">
        {attempts?.map((attempt) => {
          const pct = Math.round((attempt.score / attempt.total) * 100);
          const color =
            pct >= 70
              ? "text-emerald-600 bg-emerald-50 border-emerald-200"
              : pct >= 50
                ? "text-amber-600 bg-amber-50 border-amber-200"
                : "text-red-500 bg-red-50 border-red-200";

          return (
            <Card
              key={attempt.id}
              className=" hover:shadow-sm transition-shadow"
            >
              <CardContent className=" flex flex-col gap-2 md:flex-row items-start justify-between py-2">
                <div className=" flex items-center gap-4">
                  <div className=" w-10 h-10 rounded-lg bg-primary/30 flex items-center justify-center shrink-0">
                    <BookOpen className=" w-5 h-5 text-primary" />
                  </div>
                  <div className="">
                    <p className=" font-medium text-sm">{attempt.quiz.title}</p>
                    <p className=" text-xs text-muted-foreground/70 mt-1">
                      {attempt.quiz.topic}.{" "}
                      {new Date(attempt.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div
                  className={cn(
                    "text-sm font-bold px-3 py-1 rounded-lg border flex items-center justify-center self-end md:self-start",
                    color,
                  )}
                >
                  {attempt.score}/{attempt.total} . {pct}%
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

export default AttemptsPage;
