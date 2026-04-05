"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteQuiz, useQuizzes } from "@/hooks/useQuizzes";
import { BookOpen, Pencil, Play, Plus, Trash } from "lucide-react";
import Link from "next/link";

const difficultyColor = {
  EASY: "bg-emerald-100 text-emerald-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  HARD: "bg-red-100 text-red-700",
};

function QuizzesPage() {
  const { data: quizzes, isLoading } = useQuizzes();
  const deleteQuiz = useDeleteQuiz();

  return (
    <section className=" container space-y-6">
      <div className=" flex items-center justify-between">
        <div className="">
          <h1 className=" text-2xl font-bold">My Quizzes</h1>
          <p className=" text-sm text-popover-foreground mt-1">
            {quizzes?.length ?? 0} quiz{quizzes?.length !== 1 ? "zes" : ""}
          </p>
        </div>
        <Link href={"/quizzes/new"}>
          <Button className=" bg-primary hover:bg-primary/90">
            <Plus className=" w-4 h-4" /> New Quiz
          </Button>
        </Link>
      </div>

      {isLoading && (
        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className=" h-44 rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && quizzes?.length === 0 && (
        <Card className=" border">
          <CardContent className=" flex flex-col items-center justify-center py-16 gap-3">
            <BookOpen className=" w-10 h-10 text-popover" />
            <p className=" text-muted-foreground font-medium">No Quizzes yet</p>
            <Link href={"/quizzes/new"}>
              <Button className=" bg-primary hover:bg-primary/75 mt-2">
                <Plus className=" w-4 h-4 mr-1" /> Create your first quiz
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes?.map((quiz) => (
          <Card key={quiz.id} className=" hover:shadow-md transition-shadow">
            <CardHeader className=" pb-2">
              <div className=" flex items-start justify-between gap-2">
                <CardTitle className=" text-base font-semibold leading-tight">
                  {quiz.title}
                </CardTitle>

                <span
                  className={`font-medium px-2 py-0.5 rounded-full shrink-0 ${difficultyColor[quiz.difficulty]}`}
                >
                  {quiz.difficulty}
                </span>
              </div>
              <p className=" text-sm text-muted-foreground">{quiz.topic}</p>
            </CardHeader>

            <CardContent className=" space-y-3">
              <div className=" flex gap-3 text-sm text-muted-foreground/75">
                <span>{quiz._count.questions} questions</span>
                <span>{quiz._count.attempts} attempts</span>
              </div>
              <div className=" flex gap-2 pt-1">
                <Link href={`/quizzes/${quiz.id}/take`} className=" flex-1">
                  <Button
                    size={"sm"}
                    className=" w-full bg-primary hover:bg-primary/75"
                  >
                    <Play className=" w-3 h-3 mr-1" /> Take
                  </Button>
                </Link>
                <Link href={`/quizzes/${quiz.id}`}>
                  <Button size={"sm"} variant={"outline"}>
                    <Pencil className=" w-3 h-3" />
                  </Button>
                </Link>
                <Button
                  size={"sm"}
                  variant={"outline"}
                  className=" text-destructive border-destructive hover:bg-destructive/10 "
                  onClick={() => deleteQuiz.mutate(quiz.id)}
                  disabled={deleteQuiz.isPending}
                >
                  <Trash className=" w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default QuizzesPage;
