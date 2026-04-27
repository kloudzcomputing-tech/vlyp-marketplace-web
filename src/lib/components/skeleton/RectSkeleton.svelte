<script>
    let {
        width = "100%",
        height = "1rem",
        borderRadius = "0.5rem",
        className = "",
        rounded = true,
        variant = "default", // 'default', 'circular', 'square'
    } = $props();

    let computedBorderRadius = $derived(
        rounded
            ? variant === "circular"
                ? "50%"
                : variant === "square"
                ? "0"
                : borderRadius
            : "0"
    );
</script>

<div
    class="skeleton-loader {className}"
    style="width: {width}; height: {height}; border-radius: {computedBorderRadius};"
    role="status"
    aria-label="Loading..."
    aria-busy="true"
></div>

<style>
    .skeleton-loader {
        /* Light theme - subtle gray gradient with shimmer */
        background: linear-gradient(
            90deg,
            #f0f0f0 0%,
            #f8f8f8 20%,
            #f0f0f0 40%,
            #f0f0f0 100%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s ease-in-out infinite;
        display: block;
        position: relative;
        overflow: hidden;
    }

    @keyframes shimmer {
        0% {
            background-position: -200% 0;
        }
        100% {
            background-position: 200% 0;
        }
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
        .skeleton-loader {
            background: linear-gradient(
                90deg,
                #9da0a4 0%,
                rgb(149, 151, 153) 20%,
                #929497 40%,
                #a5a6a7 100%
            );
            background-size: 200% 100%;
        }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
        .skeleton-loader {
            animation: none;
            background: #f0f0f0;
        }

        @media (prefers-color-scheme: dark) {
            .skeleton-loader {
                background: #b3b3b3;
            }
        }
    }
</style>

