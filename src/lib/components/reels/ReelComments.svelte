<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { ArrowLeft, Send } from "@lucide/svelte";

  export let reelId;
  export let user = null;

  const dispatch = createEventDispatcher();

  let commentText = "";
  let comments = [];
  let loading = false;

  function goBack() {
    dispatch("close");
  }

  // ⏱ Format time like Instagram (now, 2m, 3h, 1d)
  function formatTime(dateString) {
    const diff = Math.floor((Date.now() - new Date(dateString)) / 1000);

    if (diff < 60) return "now";
    if (diff < 3600) return Math.floor(diff / 60) + "m";
    if (diff < 86400) return Math.floor(diff / 3600) + "h";
    return Math.floor(diff / 86400) + "d";
  }

  // 📥 Load existing comments
  async function loadComments() {
    if (!reelId) return;

    loading = true;

    try {
      const res = await fetch(`/api/reels/${reelId}/comment`);
      const json = await res.json();

      if (!res.ok) throw new Error(json?.message || "Failed to load comments");

      const results = json?.data || [];

      comments = results.map((c) => ({
        id: c.id,
        user: `User ${c.customer_id}`,
        text: c.comment,
        time: formatTime(c.created_at),
      }));
    } catch (err) {
      console.error("Load comments error:", err);
    } finally {
      loading = false;
    }
  }

  // 📤 Send new comment
  async function sendComment() {
    const text = commentText.trim();
    if (!text || !reelId) return;

    try {
      const res = await fetch(`/api/reels/${reelId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: text,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to comment");

      // ⚡ Instant UI update
      comments = [
        ...comments,
        {
          id: Date.now(),
          user: user?.name || "You",
          text,
          time: "now",
        },
      ];

      commentText = "";
    } catch (err) {
      console.error("Comment error:", err);
    }
  }

  onMount(loadComments);
</script>

<div class="flex h-[calc(100vh-139px)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
  <!-- Header -->
  <div class="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
    <button
      on:click={goBack}
      class="rounded-full p-2 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
    >
      <ArrowLeft size={20} />
    </button>

    <div class="leading-tight">
      <h2 class="text-base font-semibold text-slate-900">Comments</h2>
      <p class="text-xs text-slate-500">{comments.length} total</p>
    </div>
  </div>

  <!-- Comment List -->
  <div class="flex-1 overflow-y-auto bg-slate-50 px-4 py-4 scrollbar-hide">
    {#if loading}
      <div class="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center">
        <p class="text-sm text-slate-500">Loading comments...</p>
      </div>
    {:else if comments.length === 0}
      <div class="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center">
        <p class="text-sm font-medium text-slate-700">No comments yet</p>
        <p class="mt-1 text-xs text-slate-500">Be the first to start the conversation.</p>
      </div>
    {:else}
      {#each comments as c (c.id)}
        <article class="mb-3 rounded-xl border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div class="mb-1.5 flex items-start gap-2">
            <div class="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-900 text-xs font-semibold text-white">
              {c.user?.slice(0, 1)?.toUpperCase() || "U"}
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="truncate text-sm font-semibold text-slate-900">{c.user}</span>
                <span class="text-xs text-slate-500">{c.time}</span>
              </div>
              <p class="mt-1 break-words text-sm leading-relaxed text-slate-700">{c.text}</p>
            </div>
          </div>
        </article>
      {/each}
    {/if}
  </div>

  <!-- Input Box -->
  <div class="border-t border-slate-200 bg-white p-3">
    <div class="flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-2 py-1.5 focus-within:border-slate-400 focus-within:bg-white">
      <input
        bind:value={commentText}
        placeholder="Write a comment..."
        class="h-9 flex-1 bg-transparent px-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
        on:keydown={(e) => e.key === "Enter" && sendComment()}
      />

      <button
        on:click={sendComment}
        class="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-white transition hover:scale-[1.03] hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!commentText.trim()}
      >
        <Send size={16} />
      </button>
    </div>
  </div>
</div>
