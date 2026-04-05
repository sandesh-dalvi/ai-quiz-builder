import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// POST /api/attempts submit a quiz attempt
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { quizId, answers } = await req.json();

    const questions = await prisma.question.findMany({ where: { quizId } });

    let score = 0;

    for (const q of questions) {
      if (answers[q.id] === q.correctOption) score++;
    }

    const attempt = await prisma.attempt.create({
      data: {
        quizId,
        userId,
        answers,
        score,
        total: questions.length,
      },
    });

    return NextResponse.json({ attempt, score, total: questions.length });
  } catch (error) {
    // console.log(error);

    return NextResponse.json(
      { error: "Failed to submit attempt" },
      { status: 500 },
    );
  }
}

// GET fetch attempts for current user
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const attempts = await prisma.attempt.findMany({
      where: { userId },
      include: { quiz: { select: { title: true, topic: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(attempts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit attempt" },
      { status: 500 },
    );
  }
}
