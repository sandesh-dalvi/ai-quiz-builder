"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useDeleteQuestion, useQuiz } from "@/hooks/useQuizzes";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Play, Plus, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { toast } from "sonner";

type Option = { id: string; text: string };
type GeneratedQuestion = {
  text: string;
  options: Option[];
  correctOption: string;
  explanation?: string;
};

const difficultyColor: Record<string, string> = {
  EASY: "bg-emerald-100 text-emerald-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  HARD: "bg-red-100 text-red-700",
};

function QuizDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: quiz, isLoading } = useQuiz(id);
  const deleteQuestion = useDeleteQuestion(id);
  const queryClient = useQueryClient();
  const router = useRouter();

  // AI generation state
  const [genCount, setGenCount] = useState(5);
  const [generating, setGenerating] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    options: [
      { id: "a", text: "" },
      { id: "b", text: "" },
      { id: "c", text: "" },
      { id: "d", text: "" },
    ],
    correctOption: "a",
    explanation: "",
  });

  const handleGenerate = async () => {
    if (!quiz) return;
    setGenerating(true);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: quiz.topic,
          difficulty: quiz.difficulty,
          count: genCount,
        }),
      });

      if (!res.ok) throw new Error();
      const { questions }: { questions: GeneratedQuestion[] } =
        await res.json();

      // Bulk save to DB
      const saveRes = await fetch(`/api/quizzes/${id}/questions`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions }),
      });

      if (!saveRes.ok) throw new Error();

      queryClient.invalidateQueries({ queryKey: ["quiz", id] });

      toast.success(`${questions.length} questions generated!`);
    } catch (error) {
      toast.error("AI generation failed!.");
    } finally {
      setGenerating(false);
    }
  };
  const handleAddQuestion = async () => {
    if (!newQuestion.text.trim())
      return toast.error("Question text is required");

    if (newQuestion.options.some((o) => !o.text.trim()))
      return toast.error("All 4 options are required");

    setAddingQuestion(true);

    try {
      const res = await fetch(`/api/quizzes/${id}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuestion),
      });

      if (!res.ok) throw new Error();

      queryClient.invalidateQueries({ queryKey: ["quiz", id] });
      toast.success("Question added");

      setNewQuestion({
        text: "",
        options: [
          { id: "a", text: "" },
          { id: "b", text: "" },
          { id: "c", text: "" },
          { id: "d", text: "" },
        ],
        correctOption: "a",
        explanation: "",
      });

      setShowAddForm(false);
    } catch (error) {
      toast.error("Failed to add question");
    } finally {
      setAddingQuestion(false);
    }
  };

  if (isLoading) {
    return (
      <div className=" space-y-4 max-w-3xl">
        <Skeleton className=" h-8 w-64" />
        <Skeleton className=" h-40 rounded-xl" />
        <Skeleton className=" h-40 rounded-xl" />
      </div>
    );
  }

  if (!quiz) return <p className=" text-muted-foreground">Quiz not found.</p>;

  return (
    <section className=" max-w-4xl container space-y-6">
      <div className=" flex flex-col md:flex-row items-start justify-between gap-4">
        <div className="">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold">{quiz.title}</h1>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                difficultyColor[quiz.difficulty]
              }`}
            >
              {quiz.difficulty}
            </span>
          </div>
          <p className="text-sm text-muted-foreground/80">
            {quiz.topic} · {quiz.questions.length} questions
          </p>
        </div>
        <Link href={`/quizzes/${id}/take`}>
          <Button className=" bg-primary hover:bg-primary/90 shrink-0">
            <Play className="w-4 h-4 mr-1" /> Take Quiz
          </Button>
        </Link>
      </div>

      {/* Panel */}
      <Card className=" border-primary/60 bg-primary/10">
        <CardHeader className=" pb-3">
          <CardTitle className=" text-base font-semibold text-primary-foreground flex items-center gap-2">
            <Sparkles className=" w-4 h-4" /> AI Question Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className=" text-sm text-primary-foreground mb-4">
            Generate questions about <strong>{quiz.topic}</strong> at{" "}
            <strong>{quiz.difficulty}</strong> difficulty using Groq AI. This
            will replace all existing questions.
          </p>

          <div className="flex flex-col items-start md:flex-row md:items-center gap-3">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-primary-foreground shrink-0">
                Number of questions:
              </Label>
              <Input
                type="number"
                min={1}
                max={15}
                value={genCount}
                onChange={(e) => setGenCount(Number(e.target.value))}
                className="w-20 bg-background"
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className=" bg-primary hover:bg-primary/90"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              {generating ? "Generating..." : "Generate with AI"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Question List */}
      <div className=" space-y-3">
        <div className=" flex items-center justify-between">
          <h2 className=" font-semibold text-foreground">
            Questions ({quiz.questions.length})
          </h2>
          <Button
            size={"sm"}
            variant={"outline"}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus className=" w-4 h-4 mr-1" /> Add Manually
          </Button>
        </div>

        {/* Add Questions Form*/}
        {showAddForm && (
          <Card className=" border-muted-foreground/60">
            <CardHeader className=" pb-3">
              <CardTitle className=" text-sm font-semibold">
                New Question
              </CardTitle>
            </CardHeader>
            <CardContent className=" space-y-3">
              <div className="space-y-1.5">
                <Label className=" font-medium">Question</Label>
                <Textarea
                  className=" border-muted placeholder:text-muted-foreground/75 text-sm"
                  placeholder="Enter your question..."
                  rows={2}
                  value={newQuestion.text}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, text: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className=" font-medium">Options</Label>
                {newQuestion.options.map((opt, i) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setNewQuestion({
                          ...newQuestion,
                          correctOption: opt.id,
                        })
                      }
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                        newQuestion.correctOption === opt.id
                          ? "border-primary bg-primary text-background"
                          : "border-border text-muted-foreground/80"
                      }`}
                    >
                      {newQuestion.correctOption === opt.id ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        opt.id.toUpperCase()
                      )}
                    </button>
                    <Input
                      className=" border-muted placeholder:text-muted-foreground/75 text-sm"
                      placeholder={`Option ${opt.id.toUpperCase()}`}
                      value={opt.text}
                      onChange={(e) => {
                        const updated = [...newQuestion.options];
                        updated[i] = { ...opt, text: e.target.value };
                        setNewQuestion({ ...newQuestion, options: updated });
                      }}
                    />
                  </div>
                ))}
                <p className="text-xs text-muted-foreground/50">
                  Click the circle to mark the correct answer
                </p>
              </div>
              <div className="space-y-1.5">
                <Label className=" font-medium">Explanation (optional)</Label>
                <Input
                  className=" border-muted placeholder:text-muted-foreground/75 text-sm"
                  placeholder="Why is this the correct answer?"
                  value={newQuestion.explanation}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      explanation: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  onClick={handleAddQuestion}
                  disabled={addingQuestion}
                  className="bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  {addingQuestion ? "Adding..." : "Add Question"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Question Cards */}
        {quiz.questions.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10 gap-2">
              <p className="text-muted-foreground/80 text-sm">
                No questions yet
              </p>
              <p className="text-muted-foreground/80 text-xs">
                Use AI to generate questions or add them manually
              </p>
            </CardContent>
          </Card>
        )}

        {quiz.questions.map((q, idx) => (
          <Card key={q.id} className=" hover:shadow-sm transition-shadow">
            <CardContent className=" pt-4">
              <div className=" flex items-start justify-between gap-3">
                <div className=" flex gap-3 flex-1">
                  <span className=" text-sm font-bold text-muted-foreground/75 mt-0.5 shrink-0">
                    Q{idx + 1}
                  </span>

                  <div className=" space-y-2 flex-1">
                    <p className=" text-sm font-medium text-foreground">
                      {q.text}
                    </p>
                    <div className=" grid grid-cols-1 md:grid-cols-2 gap-1.5">
                      {(q.options as Option[]).map((opt) => (
                        <div
                          key={opt.id}
                          className={` text-xs px-2.5 py-1.5 rounded-md border ${opt.id === q.correctOption ? "border-emerald-300 bg-emerald-50 text-emerald-800 font-medium" : "border-foreground/60 text-muted-foreground"}`}
                        >
                          {opt.id.toUpperCase()}. {opt.text}
                        </div>
                      ))}
                    </div>
                    {q.explanation && (
                      <p className=" text-xs text-muted-foreground italic">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  size={"sm"}
                  variant={"ghost"}
                  className=" text-destructive/60 hover:text-destructive hover:bg-destructive/10 shrink-0"
                  onClick={() => deleteQuestion.mutate(q.id)}
                  disabled={deleteQuestion.isPending}
                >
                  <Trash2 className=" w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default QuizDetailsPage;
