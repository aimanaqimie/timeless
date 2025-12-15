import { redirectIfAuthenticated } from "../../../utils/redirectIfAuthenticated";
import { signIn } from "../../../utils/supabase/actions";
import Link from "next/link";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await redirectIfAuthenticated("/dashboard");
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-md flex-col items-center justify-center gap-8 px-8 py-16">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-zinc-50">
            Welcome back
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Sign in to your account to continue
          </p>
        </div>

        {error && (
          <div className="w-full rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        <form action={signIn} className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="username"
              className="text-sm font-medium text-black dark:text-zinc-50"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="h-12 rounded-lg border border-black/20 bg-transparent px-4 text-black outline-none transition-colors focus:border-black dark:border-white/20 dark:text-white dark:focus:border-white"
              placeholder="johndoe"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-black dark:text-zinc-50"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="h-12 rounded-lg border border-black/20 bg-transparent px-4 text-black outline-none transition-colors focus:border-black dark:border-white/20 dark:text-white dark:focus:border-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-black px-6 text-base font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Log In
          </button>
        </form>

        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Dont have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-black dark:text-white"
          >
            Sign up
          </Link>
        </p>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 w-full rounded-lg border border-dashed border-zinc-300 bg-zinc-100 p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Test Credentials
            </p>
            <div className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
              <p>
                <span className="font-medium">Username:</span> testuser
              </p>
              <p>
                <span className="font-medium">Password:</span> password123
              </p>
            </div>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Sign up first at /signup with these credentials
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
