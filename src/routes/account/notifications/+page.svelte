<script>
    let { data } = $props();
    let notifications = data?.notifications;

    const unreadCount = $derived(
        notifications?.filter((n) => !n.is_read).length || 0
    );
</script>

<div class="space-y-6 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-light text-gray-900">Notifications</h1>
            <p class="text-sm text-gray-500 mt-1">
                {unreadCount > 0
                    ? `${unreadCount} unread ${unreadCount === 1 ? 'notification' : 'notifications'}`
                    : 'All caught up'}
            </p>
        </div>
        {#if unreadCount > 0}
            <button
                class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
                Mark all as read
            </button>
        {/if}
    </div>

    <!-- Notifications List -->
    <div class="space-y-3">
        {#each notifications as notification}
            <div
                class="border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors {notification.is_read
                    ? 'bg-white'
                    : 'bg-gray-50'}"
            >
                <div class="flex items-start gap-4">
                    <!-- Unread Indicator -->
                    {#if !notification.is_read}
                        <div class="w-2 h-2 rounded-full bg-gray-900 flex-shrink-0 mt-2"></div>
                    {/if}

                    <!-- Notification Content -->
                    <div class="flex-1 min-w-0 space-y-1">
                        <h3 class="text-sm font-medium text-gray-900">
                            {notification.title}
                        </h3>
                        <p class="text-sm text-gray-600 leading-relaxed">
                            {notification.message}
                        </p>
                        {#if notification.date || notification.created_at}
                            <p class="text-xs text-gray-500 mt-2">
                                {notification.date || notification.created_at}
                            </p>
                        {/if}
                    </div>

                    <!-- Actions -->
                    <div class="flex items-start gap-2 flex-shrink-0">
                        {#if !notification.is_read}
                            <button
                                class="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                                title="Mark as read"
                            >
                                Mark read
                            </button>
                        {/if}
                        <button
                            class="text-xs text-red-600 hover:text-red-700 transition-colors"
                            title="Delete"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        {/each}
    </div>

    <!-- Empty State -->
    {#if !notifications || notifications.length === 0}
        <div class="text-center py-12 border border-gray-200 rounded-lg">
            <p class="text-gray-500">No notifications</p>
        </div>
    {/if}
</div>
