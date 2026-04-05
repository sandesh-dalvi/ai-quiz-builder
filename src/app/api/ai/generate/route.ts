import { groq } from "@/lib/groq";
import { GenerateQuestionsSchema } from "@/lib/validations";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsedBody = GenerateQuestionsSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.message },
        { status: 400 },
      );
    }

    const { topic, difficulty, count } = parsedBody.data;

    const prompt = `You are a quiz question generator. Generate exactly ${count} multiple choice questions about "${topic}" at ${difficulty} difficulty level.

Return ONLY a valid JSON array with no markdown, no explanation, no backticks. Just the raw JSON array.

Each object must have exactly this shape:
{
  "text": "the question",
  "options": [
    { "id": "a", "text": "option A" },
    { "id": "b", "text": "option B" },
    { "id": "c", "text": "option C" },
    { "id": "d", "text": "option D" }
  ],
  "correctOption": "a",
  "explanation": "brief explanation of why this is correct"
}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 3000,
      messages: [{ role: "user", content: prompt }],
    });

    const content = completion.choices[0].message.content ?? "";

    // Strip any accidental markdown fences
    const clean = content.replace(/```json|```/g, "").trim();
    const questions = JSON.parse(clean);

    return NextResponse.json({ questions });
  } catch (error) {
    console.log("AI generation error: ", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 },
    );
  }
}
