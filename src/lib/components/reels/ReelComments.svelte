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

<div class="drops-comments-container">
  <!-- Header -->
  <div class="drops-comments-header">
    <h2 class="drops-comments-title">
      Comments <span class="drops-comments-count">({comments.length})</span>
    </h2>
    <button
      on:click={goBack}
      class="drops-comments-close"
      aria-label="Close comments"
    >
      <X size={18} strokeWidth={2.5} />
    </button>
  </div>

  <!-- Comment List -->
  <div class="drops-comments-list">
    {#if loading}
      <div class="drops-comments-empty">
        <div class="drops-comments-loading-spinner"></div>
        <p>Loading comments...</p>
      </div>
    {:else if comments.length === 0}
      <div class="drops-comments-empty">
        <div class="drops-comments-empty-icon">💬</div>
        <p class="drops-comments-empty-title">No comments yet</p>
        <p class="drops-comments-empty-subtitle">Be the first to share your thoughts!</p>
      </div>
    {:else}
      {#each comments as c (c.id)}
        <article class="drops-comment-item">
          <!-- Avatar -->
          <div class="drops-comment-avatar-wrap">
            {#if c.avatar}
              <img
                src={c.avatar}
                alt={c.user}
                class="drops-comment-avatar-img"
              />
            {:else}
              <div
                class="drops-comment-avatar-fallback"
                style="background-color: {getAvatarColor(c.user)}"
              >
                {c.user?.slice(0, 1)?.toUpperCase() || "U"}
              </div>
            {/if}
          </div>

          <!-- Content -->
          <div class="drops-comment-content">
            <span class="drops-comment-username">{c.user}</span>
            <p class="drops-comment-text">{c.text}</p>
            <span class="drops-comment-time">{c.time}</span>
          </div>

          <!-- Like Button -->
          <button
            class="drops-comment-like-btn"
            on:click={() => toggleCommentLike(c.id)}
            aria-label="Like comment"
          >
            <Heart
              size={16}
              class="drops-comment-heart {c.isLiked ? 'liked' : ''}"
              fill={c.isLiked ? '#ef4444' : 'none'}
              color={c.isLiked ? '#ef4444' : '#94a3b8'}
            />
            {#if c.likes > 0}
              <span class="drops-comment-like-count" class:liked={c.isLiked}>{c.likes}</span>
            {/if}
          </button>
        </article>
      {/each}
    {/if}
  </div>

  <!-- Input Box -->
  <div class="drops-comments-input-wrap">
    <div class="drops-comments-input-inner">
      <input
        bind:value={commentText}
        placeholder="Add a comment..."
        class="drops-comments-input"
        on:keydown={(e) => e.key === "Enter" && sendComment()}
      />
      <button
        on:click={sendComment}
        class="drops-comments-send-btn"
        disabled={!commentText.trim()}
        aria-label="Send comment"
      >
        <Send size={18} />
      </button>
    </div>
  </div>
</div>

<style>
  .drops-comments-container {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 139px);
    overflow: hidden;
    background: #ffffff;
    border-radius: 16px;
  }

  /* ── Header ── */
  .drops-comments-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px 16px;
    border-bottom: 1px solid #f1f5f9;
    position: sticky;
    top: 0;
    z-index: 10;
    background: #ffffff;
  }

  .drops-comments-title {
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.02em;
    margin: 0;
  }

  .drops-comments-count {
    font-weight: 500;
    color: #94a3b8;
    font-size: 18px;
  }

  .drops-comments-close {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1.5px solid #e2e8f0;
    background: #f8fafc;
    display: grid;
    place-items: center;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .drops-comments-close:hover {
    background: #f1f5f9;
    color: #334155;
    border-color: #cbd5e1;
  }

  /* ── Comment List ── */
  .drops-comments-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px 16px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .drops-comments-list::-webkit-scrollbar {
    display: none;
  }

  /* ── Empty State ── */
  .drops-comments-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 20px;
    text-align: center;
  }

  .drops-comments-empty-icon {
    font-size: 40px;
    margin-bottom: 12px;
  }

  .drops-comments-empty-title {
    font-size: 15px;
    font-weight: 600;
    color: #334155;
    margin: 0 0 4px;
  }

  .drops-comments-empty-subtitle {
    font-size: 13px;
    color: #94a3b8;
    margin: 0;
  }

  .drops-comments-loading-spinner {
    width: 28px;
    height: 28px;
    border: 3px solid #e2e8f0;
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin-bottom: 12px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ── Comment Item ── */
  .drops-comment-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 4px;
    transition: background 0.15s ease;
  }

  .drops-comment-item:not(:last-child) {
    border-bottom: 1px solid #f8fafc;
  }

  /* ── Avatar ── */
  .drops-comment-avatar-wrap {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
  }

  .drops-comment-avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  .drops-comment-avatar-fallback {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: grid;
    place-items: center;
    color: white;
    font-size: 14px;
    font-weight: 700;
  }

  /* ── Content ── */
  .drops-comment-content {
    flex: 1;
    min-width: 0;
  }

  .drops-comment-username {
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
    display: block;
    margin-bottom: 2px;
  }

  .drops-comment-text {
    font-size: 14px;
    color: #334155;
    line-height: 1.5;
    margin: 0 0 4px;
    word-break: break-word;
  }

  .drops-comment-time {
    font-size: 12px;
    color: #94a3b8;
    font-weight: 500;
  }

  /* ── Like Button ── */
  .drops-comment-like-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 4px;
    background: none;
    border: none;
    cursor: pointer;
    flex-shrink: 0;
    margin-top: 4px;
    transition: transform 0.15s ease;
  }

  .drops-comment-like-btn:hover {
    transform: scale(1.15);
  }

  .drops-comment-like-btn:active {
    transform: scale(0.9);
  }

  :global(.drops-comment-heart) {
    transition: all 0.2s ease;
  }

  :global(.drops-comment-heart.liked) {
    animation: heartPop 0.35s ease;
  }

  @keyframes heartPop {
    0% { transform: scale(1); }
    30% { transform: scale(1.35); }
    60% { transform: scale(0.9); }
    100% { transform: scale(1); }
  }

  .drops-comment-like-count {
    font-size: 11px;
    color: #94a3b8;
    font-weight: 600;
    line-height: 1;
  }

  .drops-comment-like-count.liked {
    color: #ef4444;
  }

  /* ── Input Box ── */
  .drops-comments-input-wrap {
    padding: 12px 16px;
    padding-bottom: max(12px, env(safe-area-inset-bottom));
    border-top: 1px solid #f1f5f9;
    background: #ffffff;
  }

  .drops-comments-input-inner {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f1f5f9;
    border-radius: 100px;
    padding: 4px 4px 4px 18px;
    border: 1.5px solid #e2e8f0;
    transition: all 0.2s ease;
  }

  .drops-comments-input-inner:focus-within {
    border-color: #cbd5e1;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08);
  }

  .drops-comments-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 14px;
    color: #0f172a;
    padding: 10px 0;
    min-width: 0;
  }

  .drops-comments-input::placeholder {
    color: #94a3b8;
    font-weight: 400;
  }

  .drops-comments-send-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
    color: white;
    display: grid;
    place-items: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.25s ease;
  }

  .drops-comments-send-btn:not(:disabled):hover {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  .drops-comments-send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .drops-comments-send-btn:not(:disabled):active {
    transform: scale(0.95);
  }

  /* ── Mobile responsive ── */
  @media (max-width: 768px) {
    .drops-comments-container {
      height: auto;
      max-height: 65vh;
      border-radius: 0;
    }

    .drops-comments-header {
      padding: 16px 16px 12px;
    }

    .drops-comments-title {
      font-size: 18px;
    }
  }
</style>
