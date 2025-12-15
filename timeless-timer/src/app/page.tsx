import Link from "next/link";
import { redirectIfAuthenticated } from "../../utils/redirectIfAuthenticated";

export default async function Home() {
  await redirectIfAuthenticated("/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center justify-center gap-12 px-8 py-16">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="font-(family-name:--font-playfair) text-6xl font-medium italic tracking-tight text-black dark:text-zinc-50 sm:text-7xl">
            timeless
          </h1>
          <div className="h-px w-24 bg-black/20 dark:bg-white/20" />
          <p className="max-w-lg font-(family-name:--font-inter) text-base font-light leading-relaxed tracking-wide text-zinc-500 dark:text-zinc-400">
            Master your time, achieve your goals.
            <br />
            <span className="text-zinc-400 dark:text-zinc-500">
              The simple and elegant timer to boost your productivity.
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/login"
            className="flex h-12 w-48 items-center justify-center rounded-full bg-black px-6 font-(family-name:--font-inter) text-sm font-medium uppercase tracking-widest text-white transition-all hover:bg-zinc-800 hover:tracking-[0.2em] dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="flex h-12 w-48 items-center justify-center rounded-full border border-black/20 px-6 font-(family-name:--font-inter) text-sm font-medium uppercase tracking-widest text-black transition-all hover:border-black/40 hover:tracking-[0.2em] dark:border-white/20 dark:text-white dark:hover:border-white/40"
          >
            Sign Up
          </Link>
        </div>
      </main>
    </div>
  );
}
