<script>
  let { speakers = [], pageSize = 12 } = $props();

  const categories = $derived(['All', ...Array.from(new Set(speakers.map((s) => s.category).filter(Boolean)))]);

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

  const catIcon = {
    'AI & ML': 'generative-ai',
    'Cloud & Infrastructure': 'machines',
    'Desktop': 'desktop',
    'DevOps & Security': 'security',
    'Docs & Community': 'comments',
    'Embedded Systems & IoT': 'connected',
  };

  const initials = (name) =>
    name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
</script>

{#if categories.length > 1}
  <div class="filters" role="group" aria-label="Filter speakers by category">
    {#each categories as cat}
      <button
        class="p-chip"
        class:is-active={active === cat}
        aria-pressed={active === cat}
        onclick={() => pick(cat)}
      >
        <i class="p-icon--{catIcon[cat] || 'topic'}"></i>
        <span class="p-chip__value">{cat}</span>
      </button>
    {/each}
  </div>
{/if}

<ul class="grid">
  {#each shown as s (s.name)}
    <li>
      <div class="p-card p-card--highlighted u-no-padding">
        <div class="speaker__media">
          {#if s.featured}<span class="p-status-label--positive speaker__badge">Featured</span>{/if}
          {#if s.photo}
            <img class="p-card__image" src={s.photo} alt={s.name} loading="lazy" />
          {:else}
            <span class="speaker__initials" aria-hidden="true">{initials(s.name)}</span>
          {/if}
        </div>
        <div class="p-card__inner">
          <h3 class="p-heading--5">{s.name}</h3>
          {#if s.role}<p class="p-card__content u-text--muted">{s.role}</p>{/if}
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
  .filters { display: flex; flex-wrap: wrap; gap: 0.75rem; margin: 0 0 2rem; }

  .grid {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.5rem;
  }
  .grid > li { display: flex; }

  .grid > li > .p-card {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .speaker__media {
    position: relative;
    aspect-ratio: 4 / 3;
    display: grid;
    place-items: center;
    background: var(--u-aubergine);
    overflow: hidden;
  }
  .speaker__initials {
    color: #fff;
    font-size: 2.5rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    opacity: 0.85;
  }
  .speaker__badge { position: absolute; top: 0.5rem; left: 0.5rem; margin: 0; }
  .p-card__content { font-size: 0.9rem; line-height: 1.4; }

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
