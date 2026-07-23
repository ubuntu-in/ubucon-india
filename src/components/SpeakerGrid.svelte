<script>
  // Client-side speaker filtering (chips) + pagination. The only interactive
  // island on the site - filtering a grid genuinely needs JS. Ships as a static
  // bundle, so it works fine on GitHub Pages.
  let { speakers = [], pageSize = 9 } = $props();

  // Filter chips: "All" plus each distinct category present, in first-seen order.
  const categories = ['All', ...Array.from(new Set(speakers.map((s) => s.category).filter(Boolean)))];

  let active = $state('All');
  let page = $state(1);

  const filtered = $derived(
    active === 'All' ? speakers : speakers.filter((s) => s.category === active),
  );
  const totalPages = $derived(Math.max(1, Math.ceil(filtered.length / pageSize)));
  const shown = $derived(filtered.slice((page - 1) * pageSize, page * pageSize));

  function pick(cat) {
    active = cat;
    page = 1;
  }

  // Fallback avatar when a speaker has no photo (most of the line-up).
  const initials = (name) =>
    name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
</script>

{#if categories.length > 1}
  <div class="filters" role="group" aria-label="Filter speakers by category">
    {#each categories as cat}
      <button
        type="button"
        class="chip"
        class:is-active={active === cat}
        aria-pressed={active === cat}
        onclick={() => pick(cat)}
      >
        {cat}
      </button>
    {/each}
  </div>
{/if}

<ul class="grid">
  {#each shown as s (s.name)}
    <li>
      <div class="p-card--highlighted u-no-padding speaker">
        <div class="speaker__media">
          {#if s.featured}<span class="p-status-label--positive speaker__badge">Featured</span>{/if}
          {#if s.photo}
            <img class="speaker__img" src={s.photo} alt={s.name} loading="lazy" />
          {:else}
            <span class="speaker__initials" aria-hidden="true">{initials(s.name)}</span>
          {/if}
        </div>
        <div class="p-card__inner speaker__body">
          <h3 class="p-card__title speaker__name">{s.name}</h3>
          {#if s.role}<p class="speaker__role">{s.role}</p>{/if}
          {#if s.category}<span class="p-chip"><span class="p-chip__value">{s.category}</span></span>{/if}
        </div>
      </div>
    </li>
  {/each}
</ul>

{#if totalPages > 1}
  <nav class="pagination" aria-label="Speaker pages">
    <button type="button" class="pg pg--edge" disabled={page === 1} onclick={() => (page -= 1)}>‹ Previous</button>
    {#each Array(totalPages) as _, i}
      <button
        type="button"
        class="pg"
        class:is-active={page === i + 1}
        aria-current={page === i + 1 ? 'page' : undefined}
        onclick={() => (page = i + 1)}
      >{i + 1}</button>
    {/each}
    <button type="button" class="pg pg--edge" disabled={page === totalPages} onclick={() => (page += 1)}>Next ›</button>
  </nav>
{/if}

<style>
  /* Filter chips - square Vanilla-style, dark active. */
  .filters { display: flex; flex-wrap: wrap; gap: 0.75rem; margin: 0 0 2rem; }
  .chip {
    border: 0;
    border-radius: 2px;
    padding: 0.35rem 0.75rem;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    background: #f0f0f0;
    color: #1a1a1a;
    font-family: inherit;
  }
  .chip:hover { background: #e0e0e0; }
  .chip.is-active { background: #262626; color: #fff; }

  .grid {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.5rem;
  }
  .grid > li { display: flex; }

  /* Vanilla p-card, brand-squared, with a full-bleed media header. */
  .speaker {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0;
    border-radius: 0;
    overflow: hidden;
  }
  .speaker__media {
    position: relative;
    aspect-ratio: 4 / 3;
    display: grid;
    place-items: center;
    background: var(--u-aubergine);
    overflow: hidden;
  }
  .speaker__img { width: 100%; height: 100%; object-fit: cover; }
  .speaker__initials {
    color: #fff;
    font-size: 2.5rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    opacity: 0.85;
  }
  .speaker__badge { position: absolute; top: 0.5rem; left: 0.5rem; margin: 0; }
  .speaker__body { display: flex; flex-direction: column; gap: 0.4rem; flex: 1; }
  .speaker__name { margin: 0; color: var(--u-aubergine); font-size: 1.125rem; }
  .speaker__role { margin: 0; color: #595959; font-size: 0.9rem; line-height: 1.4; flex: 1; }
  .speaker__body .p-chip { align-self: flex-start; margin: 0.35rem 0 0; }

  .pagination { display: flex; flex-wrap: wrap; gap: 0.25rem; justify-content: center; margin-top: 2.5rem; }
  .pg {
    border: 0;
    background: #fff;
    color: #06c;
    padding: 0.35rem 0.7rem;
    border-radius: 2px;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.95rem;
  }
  .pg:hover:not(:disabled) { text-decoration: underline; }
  .pg.is-active { background: #2c001e; color: #fff; font-weight: 600; }
  .pg--edge { color: #666; }
  .pg:disabled { color: #bbb; cursor: default; }
</style>
