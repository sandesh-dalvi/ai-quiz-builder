import { prisma } from "@/lib/prisma";
import { QuestionSchema } from "@/lib/validations";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// PUT /api/quizzes/[id]/questions/[questionId] update a single question
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; questionId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: quizId, questionId } = await params;

    const quiz = await prisma.quiz.findFirst({
      where: { id: quizId, userId },
    });
    if (!quiz)
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    const body = await req.json();

    const parsedBody = QuestionSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.flatten() },
        { status: 400 },
      );
    }

    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: parsedBody.data,
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 },
    );
  }
}

// DELETE /api/quizzes/[id]/questions/[questionId] delete a single question
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; questionId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: quizId, questionId } = await params;

    const quiz = await prisma.quiz.findFirst({
      where: { id: quizId, userId },
    });
    if (!quiz)
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    await prisma.question.delete({ where: { id: questionId } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 },
    );
  }
}
