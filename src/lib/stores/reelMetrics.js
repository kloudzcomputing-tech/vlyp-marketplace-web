import { writable } from "svelte/store";
import { browser } from "$app/environment";

const STORAGE_KEY = "reel_metrics_v1";

const store = writable(null);

let activeReelId = null;

function persist(value) {
    if (browser && value) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    }
}

store.subscribe(persist);

export const reelMetrics = {
    subscribe: store.subscribe,

    // ✅ START timing
    startReel(reelId) {
        if (!reelId) return;

        store.update((current) => {
            // 🔒 Prevent restarting same reel
            if (current && current.reel_id === reelId) return current;

            activeReelId = reelId;

            return {
                reel_id: reelId,
                time_spent_ms: 0,
                loop_count: 0,
                added_to_cart: false,
                viewed_product_details: false,
                started_at: Date.now(),
            };
        });
    },

    // ✅ END timing + compute duration
    endCurrentReel() {
        let payload = null;

        store.update((m) => {
            if (!m || !m.started_at) return null;

            payload = {
                ...m,
                time_spent_ms: m.time_spent_ms + (Date.now() - m.started_at),
                started_at: null,
            };

            activeReelId = null;
            return null; // clear store
        });

        if (browser) {
            localStorage.removeItem(STORAGE_KEY);
        }

        return payload;
    },

    // ✅ LOOP count
    incrementLoop() {
        store.update((m) => {
            if (!m) return m;

            return {
                ...m,
                loop_count: m.loop_count + 1,
            };
        });
    },

    markAddedToCart() {
        store.update((m) => {
            if (!m) return m;
            return { ...m, added_to_cart: true };
        });
    },

    markViewedDetails() {
        store.update((m) => {
            if (!m) return m;
            return { ...m, viewed_product_details: true };
        });
    },
};
