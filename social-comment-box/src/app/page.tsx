import CommentFeed from "@/components/comment-feed";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 py-16 font-sans text-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 dark:text-zinc-100">
      <CommentFeed />
    </div>
  );
}
