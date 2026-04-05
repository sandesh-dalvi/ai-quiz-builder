import { prisma } from "@/lib/prisma";
import { QuizSchema } from "@/lib/validations";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET /api/quizzes/[id] - get quiz by id
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const quiz = await prisma.quiz.findFirst({
      where: { id, userId },
      include: {
        questions: { orderBy: { order: "asc" } },
        _count: { select: { attempts: true } },
      },
    });

    if (!quiz)
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    return NextResponse.json(quiz);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// PUT /api/quizzes/[id] - update quiz by id
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const body = await req.json();
    const parsedBody = QuizSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.flatten() },
        { status: 400 },
      );
    }

    const quiz = await prisma.quiz.findFirst({ where: { id, userId } });
    if (!quiz)
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    const updatedQuiz = await prisma.quiz.update({
      where: { id },
      data: parsedBody.data,
    });

    return NextResponse.json(updatedQuiz);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// DELETE /api/quizzes/[id] - delete quiz by id
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const quiz = await prisma.quiz.findFirst({ where: { id, userId } });
    if (!quiz)
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    await prisma.quiz.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
