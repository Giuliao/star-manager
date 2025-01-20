import { signIn, auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button"
import { Github, Star, Zap, Bot, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function Page() {
  let session = await auth();
  let user = session?.user?.name;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Star className="h-6 w-6 mr-2" />
          <span className="font-bold">StarManager</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#how-it-works">
            How It Works
          </Link>
          {user ? <SignOut>{`Welcome ${user}`}</SignOut>
            : <SignIn >
              <button type="submit" className="font-medium hover:underline underline-offset-4">login</button>
            </SignIn>}
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Manage GitHub Stars with AI
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Supercharge your GitHub star management with our AI-powered assistant. Organize, analyze, and leverage
                  your starred repositories like never before.
                </p>
              </div>
              <div className="space-x-4 flex justify-center items-center">
                {
                  user ?
                    <Link href="/console">
                      <Button>Goto</Button>
                    </Link>
                    : <SignIn>
                      <Button>
                        <Github className="mr-2 h-4 w-4" />
                        Sign in with GitHub
                      </Button>
                    </SignIn>}
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800 flex justify-center">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Key Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <Bot className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">AI-Powered Insights</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Get intelligent recommendations and insights based on your starred repositories.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Zap className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Smart Categorization</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Automatically categorize and tag your stars for easy navigation and retrieval.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Sparkles className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Trend Analysis</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Stay ahead of the curve with AI-driven analysis of trending repositories in your areas of interest.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 flex justify-center">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              How It Works
            </h2>
            <div className="grid gap-10 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Connect Your GitHub</h3>
                <p className="text-gray-500 dark:text-gray-400">Securely link your GitHub account to StarAI.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">AI Analysis</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Our AI analyzes your starred repositories and provides insights.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Manage with Ease</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Use our intuitive interface to organize and leverage your GitHub stars.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="cta" className="w-full py-12 md:py-24 lg:py-32 bg-primary text-white flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Supercharge Your GitHub Stars?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-200 md:text-xl">
                  Join thousands of developers who are already leveraging the power of AI to manage their GitHub stars
                  more effectively.
                </p>
              </div>
              {
                !user && <div className="w-full max-w-sm space-y-2">
                  <SignIn>
                    <Button className="w-full" variant="secondary">
                      <Github className="mr-2 h-4 w-4" />
                      Sign in with GitHub
                    </Button>
                  </SignIn>
                  <p className="text-xs text-gray-200">
                    By signing up, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>

              }
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 StarManager. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>


  );
}

function SignIn({ children }: { children: React.ReactNode }) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", {
          redirectTo: "/console"
        });
      }}>
      {children}
    </form>
  );
}

function SignOut({ children }: { children: React.ReactNode }) {
  return (
    <form
      className="flex flex-col items-start justify-center"
      action={async () => {
        "use server";
        await signOut();
      }}>
      <p className="text-sm  font-medium">{children}</p>
      <button className="text-xs hover:underline underline-offset-4" type="submit">Sign out</button>
    </form>
  );
}
