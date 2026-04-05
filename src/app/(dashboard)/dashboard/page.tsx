import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, BookOpen, Target, Trophy } from "lucide-react";
import Link from "next/link";

async function DashboardPage() {
  const { userId } = await auth();

  const [totalQuizzes, totalAttempts, attemps, recentQuizzes] =
    await Promise.all([
      prisma.quiz.count({ where: { userId: userId! } }),
      prisma.attempt.count({ where: { userId: userId! } }),
      prisma.attempt.findMany({
        where: { userId: userId! },
        select: { score: true, total: true },
      }),
      prisma.quiz.findMany({
        where: { userId: userId! },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { _count: { select: { questions: true } } },
      }),
    ]);

  const avgScore =
    attemps.length > 0
      ? Math.round(
          attemps.reduce((acc, a) => acc + (a.score / a.total) * 100, 0) /
            attemps.length,
        )
      : 0;

  const stats = [
    {
      label: "Total Quizzes",
      value: totalQuizzes,
      icon: BookOpen,
      color: "text-chart-1",
    },
    {
      label: "Attempts Made",
      value: totalAttempts,
      icon: Target,
      color: "text-chart-3",
    },
    {
      label: "Avg Score",
      value: `${avgScore}%`,
      icon: Trophy,
      color: "text-chart-4",
    },
  ];

  const difficultyColor: Record<string, string> = {
    EASY: "bg-emerald-100 text-emerald-700",
    MEDIUM: "bg-amber-100 text-amber-700",
    HARD: "bg-red-100 text-red-700",
  };
  return (
    <section className=" container space-y-6">
      <div className=" mx-auto max-w-6xl ">
        <div className="flex items-center justify-between">
          <div className="">
            <h1 className=" text-2xl font-bold text-foreground">Dashboard</h1>
            <p className=" text-muted-foreground text-sm mt-1">
              Your central hub for managing quizzes and attempts.
            </p>
          </div>
          <Link href={"/quizzes/new"}>
            <Button className=" bg-primary hover:bg-primary/90 font-medium">
              + New Quiz
            </Button>
          </Link>
        </div>
      </div>

      <div className=" grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex flex-col justify-between">
            <CardHeader className=" flex items-center justify-between pb-2">
              <CardTitle className=" text-sm font-semibold text-primary-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className=" text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className=" container space-y-3">
        <div className=" flex items-center justify-between">
          <h2 className=" font-semibold">Recent Quizzes</h2>
          <Link
            href={"/quizzes"}
            className=" text-sm text-primary hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className=" w-3 h-3" />
          </Link>
        </div>
      </div>

      {recentQuizzes.length === 0 ? (
        <Card className=" border-dashed">
          <CardContent className=" flex flex-col items-center justify-center py-16 gap-3">
            <BookOpen className=" w-10 h-10 text-muted-foreground" />
            <p className=" font-medium">No quizzes yet</p>
            <p className=" text-muted-foreground text-sm">
              Create your first quiz to get started.
            </p>
            <Link href={"quizzes/new"}>
              <Button className=" bg-primary hover:bg-primary/90 mt-2">
                Create Quiz
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className=" grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recentQuizzes.map((quiz) => (
            <Card key={quiz.id} className=" hover:shadow-sm transition-shadow">
              <CardContent className=" pt-4 space-y-3">
                <div className=" flex items-start justify-between gap-2">
                  <p className=" font-semibold text-sm leading-tight">
                    {quiz.title}
                  </p>

                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full shrink-0",
                      difficultyColor[quiz.difficulty],
                    )}
                  >
                    {quiz.difficulty}
                  </span>
                </div>

                <p className=" text-xs text-muted-foreground/80">
                  {quiz.topic}
                </p>
                <p className=" text-xs text-muted-foreground/70">
                  {quiz._count.questions} questions
                </p>

                <Link href={`/quizzes/${quiz.id}/take`}>
                  <Button
                    size={"sm"}
                    className=" w-full bg-primary hover:bg-primary/90"
                  >
                    Take Quiz
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

export default DashboardPage;
