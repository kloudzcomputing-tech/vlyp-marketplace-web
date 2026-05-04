<script>
    import { ChevronDown, Filter, X, RotateCcw, Star, ArrowDownUp } from "@lucide/svelte";

    let {
        filtersOpen = $bindable(false),
        selectedFilters = $bindable({}),
        categories = [],
        discounts = [],
        sellers = [],
        ratings = [],
        attributes = [],
        onApply = () => {},
        onClear = () => {},
        toggleFilter = () => {},
    } = $props();

    // Build filter sections dynamically
    const filterSections = $derived.by(() => {
        let sections = [];
        if (categories?.length)
            sections.push({ key: "Categories", label: "Categories", items: categories.map(c => ({ id: c.id, label: c.name })) });
        if (discounts?.length)
            sections.push({ key: "Discounts", label: "Discount", items: discounts.map(d => ({ id: d, label: `${d}% Off` })) });
        if (ratings?.length)
            sections.push({ key: "Ratings", label: "Ratings", items: ratings.map(r => ({ id: r.value, label: r.label, isRating: true })) });
        if (sellers?.length)
            sections.push({ key: "Sellers", label: "Sellers", items: sellers.map(s => ({ id: s.slug, label: s.display_name })) });
        if (attributes?.length) {
            attributes.forEach(attr => {
                const vals = JSON.parse(attr.values);
                if (vals?.length)
                    sections.push({ key: attr.label, label: attr.label, items: vals.map(v => ({ id: v, label: v })) });
            });
        }
        return sections;
    });

    let activeTab = $state(0);

    const activeFilterCount = $derived(
        Object.values(selectedFilters).reduce((sum, arr) => sum + arr.length, 0)
    );

    function getCountForSection(key) {
        return selectedFilters[key]?.length || 0;
    }

    // Local copy for batch apply
    let localFilters = $state({});

    $effect(() => {
        if (filtersOpen) {
            localFilters = JSON.parse(JSON.stringify(selectedFilters));
        }
    });

    function localToggle(sectionKey, id, checked) {
        if (checked) {
            localFilters[sectionKey] = [...(localFilters[sectionKey] || []), id];
        } else {
            localFilters[sectionKey] = (localFilters[sectionKey] || []).filter(v => v !== id);
        }
    }

    function applyFilters() {
        Object.keys(localFilters).forEach(k => {
            selectedFilters[k] = [...localFilters[k]];
        });
        filtersOpen = false;
        onApply();
    }

    function clearAll() {
        Object.keys(localFilters).forEach(k => {
            localFilters[k] = [];
        });
    }

    const localActiveCount = $derived(
        Object.values(localFilters).reduce((sum, arr) => sum + (arr?.length || 0), 0)
    );
</script>

<!-- Sticky Filter/Sort Bar -->
<div class="mobile-filter-bar sm:hidden">
    <button class="filter-pill" onclick={() => (filtersOpen = true)}>
        <Filter class="w-3.5 h-3.5" />
        <span>Filters</span>
        {#if activeFilterCount > 0}
            <span class="pill-badge">{activeFilterCount}</span>
        {/if}
    </button>
    <!-- Active filter chips -->
    {#if activeFilterCount > 0}
        <div class="filter-chips-scroll">
            {#each filterSections as section}
                {#each selectedFilters[section.key] || [] as val}
                    {@const item = section.items.find(i => i.id === val)}
                    {#if item}
                        <button class="filter-chip" onclick={() => toggleFilter(section.key, val, false)}>
                            <span>{item.label}</span>
                            <X class="w-3 h-3" />
                        </button>
                    {/if}
                {/each}
            {/each}
            <button class="filter-chip clear-chip" onclick={onClear}>
                Clear all
            </button>
        </div>
    {/if}
</div>

<!-- Bottom Sheet Overlay -->
{#if filtersOpen}
    <div class="sheet-overlay sm:hidden" role="presentation">
        <button
            class="sheet-overlay-bg"
            onclick={() => (filtersOpen = false)}
            aria-label="Close"
        ></button>

        <!-- Bottom Sheet Container -->
        <div class="sheet-container" class:sheet-open={filtersOpen}>
            <!-- Sheet Header -->
            <div class="sheet-header">
                <div class="sheet-drag-handle"></div>
                <div class="sheet-header-row">
                    <h2 class="sheet-title">Filters</h2>
                    <button class="sheet-close" onclick={() => (filtersOpen = false)} aria-label="Close">
                        <X class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <!-- Split Panel Body -->
            <div class="sheet-body">
                <!-- Left: Category Tabs -->
                <div class="sheet-tabs">
                    {#each filterSections as section, i}
                        {@const count = localFilters[section.key]?.length || 0}
                        <button
                            class="sheet-tab"
                            class:sheet-tab-active={activeTab === i}
                            onclick={() => (activeTab = i)}
                        >
                            <span class="tab-label">{section.label}</span>
                            {#if count > 0}
                                <span class="tab-count">{count}</span>
                            {/if}
                        </button>
                    {/each}
                </div>

                <!-- Right: Options Panel -->
                <div class="sheet-options">
                    {#if filterSections[activeTab]}
                        {@const section = filterSections[activeTab]}
                        <div class="options-list">
                            {#each section.items as item}
                                {@const isChecked = (localFilters[section.key] || []).includes(item.id)}
                                <label class="option-item" class:option-selected={isChecked}>
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onchange={(e) => localToggle(section.key, item.id, e.target.checked)}
                                        class="option-checkbox"
                                    />
                                    <span class="option-label">
                                        {#if item.isRating}
                                            <Star class="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                        {/if}
                                        {item.label}
                                    </span>
                                    {#if isChecked}
                                        <span class="option-check">✓</span>
                                    {/if}
                                </label>
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Sheet Footer -->
            <div class="sheet-footer">
                <button class="sheet-btn-clear" onclick={clearAll}>
                    Clear All
                </button>
                <button class="sheet-btn-apply" onclick={applyFilters}>
                    Apply {localActiveCount > 0 ? `(${localActiveCount})` : ''}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    /* ── Sticky Filter Bar ── */
    .mobile-filter-bar {
        position: sticky;
        top: 0;
        z-index: 30;
        background: #fff;
        border-bottom: 1px solid #e5e7eb;
        padding: 8px 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        overflow-x: auto;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .mobile-filter-bar::-webkit-scrollbar { display: none; }

    .filter-pill {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 7px 14px;
        font-size: 13px;
        font-weight: 600;
        color: #1f2937;
        background: #fff;
        border: 1.5px solid #d1d5db;
        border-radius: 20px;
        white-space: nowrap;
        transition: all 0.15s;
        flex-shrink: 0;
    }
    .filter-pill:active { background: #f3f4f6; transform: scale(0.97); }

    .pill-badge {
        background: var(--primary-color, #FF3F6C);
        color: #fff;
        font-size: 10px;
        font-weight: 700;
        min-width: 18px;
        height: 18px;
        border-radius: 9px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 5px;
    }

    .filter-chips-scroll {
        display: flex;
        gap: 6px;
        overflow-x: auto;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .filter-chips-scroll::-webkit-scrollbar { display: none; }

    .filter-chip {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 5px 10px;
        font-size: 11px;
        font-weight: 500;
        color: var(--primary-color, #FF3F6C);
        background: #fff0f3;
        border: 1px solid #fecdd3;
        border-radius: 16px;
        white-space: nowrap;
        flex-shrink: 0;
        transition: all 0.15s;
    }
    .filter-chip:active { transform: scale(0.95); }
    .clear-chip {
        color: #6b7280;
        background: #f3f4f6;
        border-color: #d1d5db;
    }

    /* ── Bottom Sheet ── */
    .sheet-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding-bottom: 64px; /* space for mobile nav */
    }

    .sheet-overlay-bg {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.45);
        backdrop-filter: blur(2px);
        border: none;
        cursor: default;
    }

    .sheet-container {
        position: relative;
        z-index: 1;
        background: #fff;
        border-radius: 16px 16px 0 0;
        max-height: calc(100vh - 130px);
        display: flex;
        flex-direction: column;
        animation: sheetSlideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1);
        box-shadow: 0 -4px 24px rgba(0,0,0,0.12);
    }

    @keyframes sheetSlideUp {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
    }

    /* ── Sheet Header ── */
    .sheet-header {
        padding: 8px 16px 12px;
        border-bottom: 1px solid #f3f4f6;
        flex-shrink: 0;
    }
    .sheet-drag-handle {
        width: 36px;
        height: 4px;
        background: #d1d5db;
        border-radius: 2px;
        margin: 0 auto 10px;
    }
    .sheet-header-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .sheet-title {
        font-size: 17px;
        font-weight: 700;
        color: #111827;
    }
    .sheet-close {
        padding: 6px;
        color: #6b7280;
        border-radius: 8px;
        transition: background 0.15s;
    }
    .sheet-close:active { background: #f3f4f6; }

    /* ── Split Panel Body ── */
    .sheet-body {
        display: flex;
        flex: 1;
        min-height: 0;
        overflow: hidden;
    }

    /* Left Tabs */
    .sheet-tabs {
        width: 120px;
        flex-shrink: 0;
        background: #f9fafb;
        border-right: 1px solid #f3f4f6;
        overflow-y: auto;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .sheet-tabs::-webkit-scrollbar { display: none; }

    .sheet-tab {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 14px 12px;
        font-size: 12.5px;
        font-weight: 500;
        color: #6b7280;
        text-align: left;
        border: none;
        background: transparent;
        border-left: 3px solid transparent;
        transition: all 0.15s;
    }
    .sheet-tab-active {
        background: #fff;
        color: var(--primary-color, #FF3F6C);
        font-weight: 600;
        border-left-color: var(--primary-color, #FF3F6C);
    }

    .tab-label {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .tab-count {
        background: var(--primary-color, #FF3F6C);
        color: #fff;
        font-size: 10px;
        font-weight: 700;
        min-width: 16px;
        height: 16px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 4px;
        margin-left: 4px;
        flex-shrink: 0;
    }

    /* Right Options */
    .sheet-options {
        flex: 1;
        overflow-y: auto;
        padding: 4px 0;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .sheet-options::-webkit-scrollbar { display: none; }

    .options-list {
        display: flex;
        flex-direction: column;
    }

    .option-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        cursor: pointer;
        transition: background 0.12s;
        border-bottom: 1px solid #f9fafb;
    }
    .option-item:active { background: #f9fafb; }
    .option-selected { background: #fff7f8; }

    .option-checkbox {
        width: 18px;
        height: 18px;
        border-radius: 4px;
        border: 1.5px solid #d1d5db;
        accent-color: var(--primary-color, #FF3F6C);
        cursor: pointer;
        flex-shrink: 0;
    }

    .option-label {
        flex: 1;
        font-size: 13px;
        font-weight: 500;
        color: #374151;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .option-check {
        color: var(--primary-color, #FF3F6C);
        font-size: 14px;
        font-weight: 700;
        flex-shrink: 0;
    }

    /* ── Sheet Footer ── */
    .sheet-footer {
        display: flex;
        gap: 10px;
        padding: 12px 16px;
        border-top: 1px solid #e5e7eb;
        background: #fff;
        flex-shrink: 0;
        padding-bottom: 16px;
    }

    .sheet-btn-clear {
        flex: 1;
        padding: 12px;
        font-size: 14px;
        font-weight: 600;
        color: #374151;
        background: #f3f4f6;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        transition: all 0.15s;
    }
    .sheet-btn-clear:active { background: #e5e7eb; }

    .sheet-btn-apply {
        flex: 1.5;
        padding: 12px;
        font-size: 14px;
        font-weight: 700;
        color: #fff;
        background: var(--primary-color, #FF3F6C);
        border: none;
        border-radius: 10px;
        transition: all 0.15s;
    }
    .sheet-btn-apply:active { background: var(--primary-color-hover, #E22759); transform: scale(0.98); }

    @media (min-width: 640px) {
        .mobile-filter-bar,
        .sheet-overlay { display: none !important; }
    }
</style>
