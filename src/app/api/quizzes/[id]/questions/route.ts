import { prisma } from "@/lib/prisma";
import { QuestionSchema } from "@/lib/validations";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// POST /api/quizzes/[id]/questions add a new question
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: quizId } = await params;

    const quiz = await prisma.quiz.findFirst({ where: { id: quizId, userId } });
    if (!quiz)
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    const body = await req.json();
    const parsed = QuestionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const count = await prisma.question.count({ where: { quizId } });

    const question = await prisma.question.create({
      data: { ...parsed.data, quizId, order: count },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Failed to add questions";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PUT /api/quizzes/[id]/questions replace all questions for a quiz
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: quizId } = await params;

    const quiz = await prisma.quiz.findFirst({
      where: { id: quizId, userId },
    });
    if (!quiz)
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    const { questions } = await req.json();

    await prisma.question.deleteMany({ where: { quizId } });

    const created = await prisma.question.createMany({
      data: questions.map(
        (
          q: {
            text: string;
            options: object;
            correctOption: string;
            explanation?: string;
          },
          i: number,
        ) => ({
          quizId,
          text: q.text,
          options: q.options,
          correctOption: q.correctOption,
          explanation: q.explanation ?? null,
          order: i,
        }),
      ),
    });

    return NextResponse.json({ count: created.count }, { status: 200 });
  } catch (error) {}
}
