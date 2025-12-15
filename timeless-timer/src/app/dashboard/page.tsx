import { redirectIfNotAuthenticated } from "../../../utils/redirectIfNotAuthenticated";
import { signOut } from "../../../utils/supabase/actions";
import PomodoroTimer from "./PomodoroTimer";
import TodoList from "./TodoList";

export default async function Dashboard() {
  await redirectIfNotAuthenticated("/");

  return (
    <div className="relative min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <header className="fixed left-0 right-0 top-0 z-10 flex items-center justify-between px-8 py-6">
        <h1 className="text-2xl font-bold tracking-tight text-black dark:text-zinc-50">
          Dashboard
        </h1>
        <form action={signOut}>
          <button
            type="submit"
            className="flex h-10 items-center justify-center rounded-full border border-black/20 px-5 text-sm font-medium text-black transition-colors hover:bg-black/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
          >
            Log Out
          </button>
        </form>
      </header>

      <main className="flex min-h-screen flex-col items-center justify-center px-8 py-24">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-stretch">
          <PomodoroTimer />
          <TodoList />
        </div>
      </main>
    </div>
  );
}
