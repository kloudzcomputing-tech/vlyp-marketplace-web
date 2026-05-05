<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { Heart, Send, X } from "@lucide/svelte";

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
    if (diff < 3600) return Math.floor(diff / 60) + "M";
    if (diff < 86400) return Math.floor(diff / 3600) + "H";
    return Math.floor(diff / 86400) + "D";
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
        user: c.customer_name || `User ${c.customer_id}`,
        avatar: c.customer_avatar || null,
        text: c.comment,
        time: formatTime(c.created_at),
        likes: c.likes ?? 0,
        isLiked: c.is_liked ?? false,
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
          avatar: user?.avatar || null,
          text,
          time: "now",
          likes: 0,
          isLiked: false,
        },
      ];

      commentText = "";
    } catch (err) {
      console.error("Comment error:", err);
    }
  }

  function toggleCommentLike(commentId) {
    comments = comments.map((c) => {
      if (c.id === commentId) {
        return {
          ...c,
          isLiked: !c.isLiked,
          likes: c.isLiked ? Math.max(0, c.likes - 1) : c.likes + 1,
        };
      }
      return c;
    });
  }

  // Generate avatar initials color
  function getAvatarColor(name) {
    const colors = [
      '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
      '#ec4899', '#f43f5e', '#ef4444', '#f97316',
      '#eab308', '#22c55e', '#14b8a6', '#06b6d4',
      '#3b82f6', '#6366f1'
    ];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  onMount(loadComments);
</script>

<div class="flex flex-col h-[calc(100vh-139px)] md:h-[calc(100vh-139px)] max-h-[65vh] md:max-h-none overflow-hidden bg-white md:rounded-2xl">
  <!-- Header -->
  <div class="flex items-center justify-between px-5 pt-5 pb-4 md:px-5 md:pt-5 border-b border-slate-100 sticky top-0 z-10 bg-white">
    <h2 class="text-lg md:text-xl font-bold text-slate-900 tracking-tight m-0">
      Comments <span class="font-medium text-slate-400 text-base md:text-lg">({comments.length})</span>
    </h2>
    <button
      on:click={goBack}
      class="w-9 h-9 rounded-full border border-slate-200 bg-slate-50 grid place-items-center text-slate-500 cursor-pointer transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 hover:border-slate-300"
      aria-label="Close comments"
    >
      <X size={18} strokeWidth={2.5} />
    </button>
  </div>

  <!-- Comment List -->
  <div class="flex-1 overflow-y-auto px-4 py-2 scrollbar-hide">
    {#if loading}
      <div class="flex flex-col items-center justify-center py-12 px-5 text-center">
        <div class="w-7 h-7 border-3 border-slate-200 border-t-indigo-500 rounded-full animate-spin mb-3"></div>
        <p class="text-sm text-slate-500">Loading comments...</p>
      </div>
    {:else if comments.length === 0}
      <div class="flex flex-col items-center justify-center py-12 px-5 text-center">
        <div class="text-4xl mb-3">💬</div>
        <p class="text-sm font-semibold text-slate-700 mb-1">No comments yet</p>
        <p class="text-xs text-slate-400">Be the first to share your thoughts!</p>
      </div>
    {:else}
      {#each comments as c (c.id)}
        <article class="flex items-start gap-3 py-3.5 px-1 border-b border-slate-50 last:border-b-0">
          <!-- Avatar -->
          <div class="shrink-0 w-10 h-10 rounded-full overflow-hidden">
            {#if c.avatar}
              <img
                src={c.avatar}
                alt={c.user}
                class="w-full h-full object-cover rounded-full"
              />
            {:else}
              <div
                class="w-full h-full rounded-full grid place-items-center text-white text-sm font-bold"
                style="background-color: {getAvatarColor(c.user)}"
              >
                {c.user?.slice(0, 1)?.toUpperCase() || "U"}
              </div>
            {/if}
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <span class="text-sm font-bold text-slate-900 block mb-0.5">{c.user}</span>
            <p class="text-sm text-slate-700 leading-relaxed m-0 mb-1 break-words">{c.text}</p>
            <span class="text-xs text-slate-400 font-medium">{c.time}</span>
          </div>

          <!-- Like Button -->
          <button
            class="flex flex-col items-center gap-0.5 p-1 bg-transparent border-none cursor-pointer shrink-0 mt-1 transition-transform duration-150 hover:scale-110 active:scale-90"
            on:click={() => toggleCommentLike(c.id)}
            aria-label="Like comment"
          >
            <Heart
              size={16}
              fill={c.isLiked ? '#ef4444' : 'none'}
              color={c.isLiked ? '#ef4444' : '#94a3b8'}
              class="transition-all duration-200"
            />
            {#if c.likes > 0}
              <span class="text-[11px] font-semibold leading-none {c.isLiked ? 'text-red-500' : 'text-slate-400'}">{c.likes}</span>
            {/if}
          </button>
        </article>
      {/each}
    {/if}
  </div>

  <!-- Input Box -->
  <div class="px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))] border-t border-slate-100 bg-white">
    <div class="flex items-center gap-2.5 bg-slate-100 rounded-full pl-5 pr-1 py-1 border border-slate-200 transition-all duration-200 focus-within:border-slate-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/10">
      <input
        bind:value={commentText}
        placeholder="Add a comment..."
        class="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 py-2.5 min-w-0 placeholder:text-slate-400"
        on:keydown={(e) => e.key === "Enter" && sendComment()}
      />
      <button
        on:click={sendComment}
        class="w-10 h-10 rounded-full border-none bg-gradient-to-br from-slate-300 to-slate-400 text-white grid place-items-center cursor-pointer shrink-0 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        disabled={!commentText.trim()}
        aria-label="Send comment"
      >
        <Send size={18} />
      </button>
    </div>
  </div>
</div>
