"use client";

import { FormEvent, useMemo, useState } from "react";

type Comment = {
  id: string;
  displayName: string;
  username: string;
  avatarColor: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies: number;
};

type FormState = {
  displayName: string;
  username: string;
  content: string;
};

const MAX_CHAR_COUNT = 280;

const seedComments: Comment[] = [
  {
    id: "c1",
    displayName: "Ava Chen",
    username: "@avacodes",
    avatarColor: "bg-indigo-500",
    content:
      "Shipping a small UI polish today ✨ Keeping micro-interactions smooth makes all the difference.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    likes: 24,
    isLiked: false,
    replies: 5,
  },
  {
    id: "c2",
    displayName: "Daniel Park",
    username: "@dpark",
    avatarColor: "bg-emerald-500",
    content:
      "Loving how this community shares feedback constructively. Keep the #buildinpublic energy going!",
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    likes: 12,
    isLiked: false,
    replies: 2,
  },
  {
    id: "c3",
    displayName: "Sofia Morales",
    username: "@soficode",
    avatarColor: "bg-rose-500",
    content:
      "Just wrapped the v2 prototype. Dark mode feels 🔥 — shipping screenshots later today. #design #ui",
    createdAt: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
    likes: 31,
    isLiked: false,
    replies: 9,
  },
];

function relativeTimeFromNow(isoDate: string) {
  const now = Date.now();
  const diffMs = now - new Date(isoDate).getTime();
  if (diffMs < 60000) {
    return "just now";
  }
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h`;
  }
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d`;
  }
  const weeks = Math.floor(days / 7);
  if (weeks < 5) {
    return `${weeks}w`;
  }
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months}mo`;
  }
  const years = Math.floor(days / 365);
  return `${years}y`;
}

function extractHashtags(comments: Comment[]) {
  const counts = new Map<string, number>();
  const hashtagRegex = /#[a-z0-9_]+/gi;
  comments.forEach((comment) => {
    const matches = comment.content.match(hashtagRegex);
    if (!matches) return;
    matches.forEach((tag) => {
      const lowered = tag.toLowerCase();
      counts.set(lowered, (counts.get(lowered) ?? 0) + 1);
    });
  });
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([tag, count]) => ({ tag, count }));
}

const initialForm: FormState = {
  displayName: "",
  username: "",
  content: "",
};

export function CommentFeed() {
  const [comments, setComments] = useState<Comment[]>(seedComments);
  const [formState, setFormState] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const charCount = formState.content.length;
  const charLeft = MAX_CHAR_COUNT - charCount;

  const trendingTopics = useMemo(() => extractHashtags(comments), [comments]);

  const interactionsToday = comments.reduce(
    (total, comment) => total + comment.likes + comment.replies,
    0,
  );

  function handleFieldChange(
    field: keyof FormState,
    value: FormState[keyof FormState],
  ) {
    setFormState((prev) => ({
      ...prev,
      [field]: field === "username" ? value.replace(/\s+/g, "") : value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formState.displayName.trim() || !formState.username.trim()) {
      return;
    }
    if (!formState.content.trim()) {
      return;
    }

    setIsSubmitting(true);

    const normalizedHandle = formState.username.startsWith("@")
      ? formState.username
      : `@${formState.username}`;

    const newComment: Comment = {
      id: crypto.randomUUID(),
      displayName: formState.displayName.trim(),
      username: normalizedHandle,
      avatarColor: "bg-sky-500",
      content: formState.content.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replies: 0,
    };

    setComments((prev) => [newComment, ...prev]);
    setFormState(initialForm);
    setTimeout(() => setIsSubmitting(false), 300);
  }

  function toggleLike(commentId: string) {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id !== commentId) return comment;
        const nextLiked = !comment.isLiked;
        return {
          ...comment,
          isLiked: nextLiked,
          likes: comment.likes + (nextLiked ? 1 : -1),
        };
      }),
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-10 lg:px-0">
      <section className="rounded-3xl border border-white/10 bg-white/60 p-6 shadow-xl ring-1 ring-black/5 backdrop-blur dark:bg-zinc-900/60">
        <header className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Community Thread
            </h1>
            <p className="text-sm text-zinc-500">
              Share your latest win, idea, or question with the crew.
            </p>
          </div>
          <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-300">
            {interactionsToday}+ interactions today
          </span>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700/60 dark:bg-zinc-900"
        >
          <div className="flex gap-4">
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-500 font-semibold uppercase text-white sm:flex">
              {formState.displayName
                ? formState.displayName.slice(0, 2).toUpperCase()
                : "YOU"}
            </div>
            <div className="flex w-full flex-col gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                  Display name
                  <input
                    className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-900 outline-none ring-indigo-500/30 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                    name="displayName"
                    value={formState.displayName}
                    onChange={(event) =>
                      handleFieldChange("displayName", event.target.value)
                    }
                    placeholder="Jordan Walker"
                    maxLength={40}
                    required
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                  Handle
                  <input
                    className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-900 outline-none ring-indigo-500/30 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                    name="username"
                    value={formState.username}
                    onChange={(event) =>
                      handleFieldChange("username", event.target.value)
                    }
                    placeholder="@jordy"
                    maxLength={30}
                    required
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                What would you like to share?
                <textarea
                  className="h-28 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 outline-none ring-indigo-500/30 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                  name="content"
                  value={formState.content}
                  onChange={(event) =>
                    handleFieldChange("content", event.target.value.slice(0, MAX_CHAR_COUNT))
                  }
                  placeholder="Celebrate a milestone, drop a question, or give kudos."
                  required
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <span
                    className={`font-medium ${
                      charLeft < 0 ? "text-rose-500" : "text-zinc-500"
                    }`}
                  >
                    {charLeft}
                  </span>
                  characters remaining
                </div>
                <button
                  type="submit"
                  disabled={
                    charCount === 0 ||
                    charLeft < 0 ||
                    isSubmitting ||
                    !formState.displayName.trim() ||
                    !formState.username.trim()
                  }
                  className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white transition enabled:hover:bg-indigo-500 enabled:focus-visible:outline enabled:focus-visible:outline-2 enabled:focus-visible:outline-offset-2 enabled:focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 dark:enabled:bg-indigo-500 dark:enabled:hover:bg-indigo-400"
                >
                  {isSubmitting ? "Posting..." : "Post to feed"}
                </button>
              </div>
            </div>
          </div>
        </form>

        <ul className="mt-8 space-y-4">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <article className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-semibold uppercase text-white ${comment.avatarColor}`}
                >
                  {comment.displayName.slice(0, 2)}
                </div>
                <div className="w-full">
                  <header className="mb-2 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                        {comment.displayName}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                        <span>{comment.username}</span>
                        <span aria-hidden="true">•</span>
                        <time dateTime={comment.createdAt}>
                          {relativeTimeFromNow(comment.createdAt)}
                        </time>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleLike(comment.id)}
                      className={`flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium transition ${
                        comment.isLiked
                          ? "border-transparent bg-rose-500 text-white hover:bg-rose-400"
                          : "border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
                      }`}
                    >
                      <span aria-hidden="true">♥</span>
                      {comment.likes}
                    </button>
                  </header>
                  <p className="whitespace-pre-line text-sm leading-6 text-zinc-600 dark:text-zinc-200">
                    {comment.content}
                  </p>
                  <footer className="mt-4 flex gap-6 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    <button
                      type="button"
                      className="transition hover:text-indigo-500"
                    >
                      Reply ({comment.replies})
                    </button>
                    <button
                      type="button"
                      className="transition hover:text-indigo-500"
                    >
                      Share
                    </button>
                    <button
                      type="button"
                      className="transition hover:text-indigo-500"
                    >
                      Save
                    </button>
                  </footer>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <aside className="space-y-4 rounded-3xl border border-white/10 bg-white/70 p-6 shadow-lg ring-1 ring-black/5 backdrop-blur dark:bg-zinc-900/70">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Trending topics
          </h2>
          <ul className="mt-3 space-y-2">
            {trendingTopics.length === 0 && (
              <li className="text-sm text-zinc-500">
                Start the conversation with a hashtag to spark discovery.
              </li>
            )}
            {trendingTopics.map(({ tag, count }) => (
              <li
                key={tag}
                className="flex items-center justify-between rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-600 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-indigo-400/40 dark:hover:text-indigo-300"
              >
                <span className="font-medium">{tag}</span>
                <span className="text-xs text-zinc-400">{count} posts</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-dashed border-indigo-500/40 bg-indigo-500/10 p-4 text-sm text-indigo-700 dark:border-indigo-400/40 dark:bg-indigo-400/10 dark:text-indigo-200">
          <p className="font-semibold">Daily prompt</p>
          <p className="mt-1 leading-6">
            Who inspired your work this week? Tag them and let&apos;s celebrate
            wins together.
          </p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-black p-5 text-white shadow-inner">
          <h3 className="text-base font-semibold">Pro tip</h3>
          <p className="mt-2 text-sm leading-6 text-white/80">
            Craft vivid updates, add context with hashtags, and swap feedback
            generously. Momentum loves reciprocity.
          </p>
        </div>
      </aside>
    </div>
  );
}

export default CommentFeed;
