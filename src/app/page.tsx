import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { BadgeQuestionMarkIcon } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();
  return (
    <div className=" min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className=" flex items-center justify-between px-8 py-4 border-b border-gray-200">
        <div className=" flex items-center gap-2">
          <div className=" bg-primary w-10 h-10 rounded-full flex items-center justify-center">
            <BadgeQuestionMarkIcon className=" w-8 h-8 text-white" />
          </div>
          <span className=" font-bold text-lg">Quizly</span>
        </div>
        <div className=" flex items-center gap-3">
          {userId ? (
            <Link href="/dashboard">
              <Button
                size="sm"
                className=" bg-primary  hover:bg-primary/90 font-medium"
              >
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  size="sm"
                  className=" bg-primary  hover:bg-primary/90 font-medium"
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
      <main className="flex-1">
        {/* Hero */}
        <section className="px-8 py-20 bg-background text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Create Quizzes with AI in Seconds
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Transform your learning experience with intelligent, AI-powered
              quizzes. Perfect for educators and learners alike.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/sign-up">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
                  Get Started Free
                </Button>
              </Link>
              <a href="/#features">
                <Button
                  variant="outline"
                  className="px-8 py-6 text-lg border-border text-foreground hover:bg-muted"
                >
                  Learn More
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="px-8 py-20 bg-card">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground text-center mb-4">
              Powerful Features
            </h2>
            <p className="text-center text-muted-foreground mb-16 text-lg">
              Everything you need to create engaging quizzes
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "AI-Powered Generation",
                  description:
                    "Let AI generate quiz questions from your content in seconds",
                  icon: "✨",
                },
                {
                  title: "Multiple Question Types",
                  description:
                    "Support for various question formats including MCQ, true/false, and more",
                  icon: "📝",
                },
                {
                  title: "Real-time Analytics",
                  description:
                    "Track student performance and identify learning gaps instantly",
                  icon: "📊",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-background border border-border rounded-lg hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-foreground/5 border-t border-border px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-primary w-10 h-10 rounded-full flex items-center justify-center">
                <BadgeQuestionMarkIcon className="w-8 h-8 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">Quizly</span>
            </div>

            <div className="flex gap-6">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                GitHub
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; 2026 Quizly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
