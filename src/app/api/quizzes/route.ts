import { prisma } from "@/lib/prisma";
import { QuizSchema } from "@/lib/validations";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET /api/quizzes - get all quizzes for current user
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const quizzes = await prisma.quiz.findMany({
      where: {
        userId,
      },
      include: {
        _count: { select: { questions: true, attempts: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// POST /api/quizzes - create a new quiz
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsedBody = QuizSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.flatten() },
        { status: 400 },
      );
    }

    const quiz = await prisma.quiz.create({
      data: { ...parsedBody.data, userId },
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
