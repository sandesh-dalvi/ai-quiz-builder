"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuizInput, QuizSchema } from "@/lib/validations";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

function NewQuizPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<QuizInput>({
    resolver: zodResolver(QuizSchema),
    defaultValues: { difficulty: "MEDIUM" },
  });

  const onSubmit = async (data: QuizInput) => {
    setLoading(true);
    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();

      const quiz = await res.json();

      toast.success("Quiz Created! Now add questions.");
      router.push(`/quizzes/${quiz.id}`);
    } catch (error) {
      toast.error("Failed to create quiz!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className=" container space-y-6 ">
      <div className="">
        <h1 className=" text-2xl font-bold">Create New Quiz</h1>
        <p className=" text-muted-foreground mt-1 text-sm">
          Fill in the details, then add questions manually or generate with AI
        </p>
      </div>
      <div className="max-w-2xl ">
        <Card>
          <CardHeader>
            <CardTitle className=" text-base font-semibold">
              Quiz Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className=" space-y-4">
              <div className=" space-y-1.5">
                <Label
                  className=" text-muted-foreground  font-semibold"
                  htmlFor="title"
                >
                  Title
                </Label>
                <Input
                  id="title"
                  className=" placeholder:text-muted-foreground/75"
                  placeholder="e.g. Javascript Fundamentals"
                  {...register("title")}
                />
                {errors.title && (
                  <p className=" text-sm text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className=" space-y-1.5">
                <Label
                  className=" text-muted-foreground  font-semibold"
                  htmlFor="topic"
                >
                  Topic
                </Label>
                <Input
                  id="topic"
                  className=" placeholder:text-muted-foreground/75"
                  placeholder="e.g. Javascript"
                  {...register("topic")}
                />
                {errors.topic && (
                  <p className=" text-sm text-destructive">
                    {errors.topic.message}
                  </p>
                )}
              </div>

              <div className=" space-y-1.5">
                <Label
                  className=" text-muted-foreground  font-semibold"
                  htmlFor="description"
                >
                  Description (Optional)
                </Label>
                <Textarea
                  className=" placeholder:text-muted-foreground/75"
                  id="description"
                  placeholder="What is this quiz about?"
                  {...register("description")}
                />
                {errors.description && (
                  <p className=" text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className=" space-y-1.5">
                <Label className=" text-muted-foreground  font-semibold">
                  Difficulty
                </Label>
                <Select
                  defaultValue="MEDIUM"
                  onValueChange={(v) =>
                    setValue("difficulty", v as "EASY" | "MEDIUM" | "HARD")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EASY">Easy</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HARD">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className=" w-full bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Quiz"}
                <ArrowRight className=" w-4 h-4 ml-1" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default NewQuizPage;
