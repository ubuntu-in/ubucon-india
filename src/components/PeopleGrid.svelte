<script>
  import PersonPlaceholder from './PersonPlaceholder.svelte';

  let {
    people = [],
    label = 'People',
    pageSize = 12,
    categoryIcons = {},
  } = $props();

  const categories = $derived([
    'All',
    ...Array.from(new Set(people.map((person) => person.category).filter(Boolean))),
  ]);

  let active = $state('All');
  let page = $state(1);

  const filtered = $derived(
    active === 'All' ? people : people.filter((person) => person.category === active),
  );
  const totalPages = $derived(Math.max(1, Math.ceil(filtered.length / pageSize)));
  const shown = $derived(filtered.slice((page - 1) * pageSize, page * pageSize));

  function pick(cat) {
    active = cat;
    page = 1;
  }
</script>

{#if categories.length > 1}
  <div role="group" aria-label="Filter {label.toLowerCase()} by category">
    {#each categories as cat}
      <button
        type="button"
        class="p-chip"
        aria-pressed={active === cat}
        onclick={() => pick(cat)}
      >
        <i class="p-icon--{categoryIcons[cat] || 'topic'}"></i>
        <span class="p-chip__value">{cat}</span>
      </button>
    {/each}
  </div>
{/if}

<div class="grid-row--25-25-25-25 u-sv3" role="list">
  {#each shown as person (person.id)}
    <div class="grid-col p-card u-no-padding" role="listitem">
      <div class="p-image-container--square is-cover">
        {#if person.featured}<span class="p-status-label--positive featured-badge">Featured</span>{/if}
        {#if person.photo}
          <img
            class="p-image-container__image"
            src={person.photo}
            alt={person.name}
            loading="lazy"
          />
        {:else}
          <PersonPlaceholder name={person.name} />
        {/if}
      </div>
      <div class="p-card__inner">
        <h3 class="p-heading--4 u-no-margin--bottom">{person.name}</h3>
        {#if person.role}<p class="u-text--muted u-no-margin--bottom">{person.role}</p>{/if}
      </div>
    </div>
  {/each}
</div>

{#if totalPages > 1}
  <nav class="p-pagination u-align--center" aria-label="{label} pages">
    <ol class="p-pagination__items">
      <li class="p-pagination__item">
        <button
          type="button"
          class="p-pagination__link--previous"
          disabled={page === 1}
          onclick={() => (page -= 1)}
        >
          <i class="p-icon--chevron-down"></i>
          <span>Previous</span>
        </button>
      </li>
      {#each Array.from({ length: totalPages }) as _, i}
        <li class="p-pagination__item">
          <button
            type="button"
            class="p-pagination__link"
            aria-current={page === i + 1 ? 'page' : undefined}
            onclick={() => (page = i + 1)}
          >
            {i + 1}
          </button>
        </li>
      {/each}
      <li class="p-pagination__item">
        <button
          type="button"
          class="p-pagination__link--next"
          disabled={page === totalPages}
          onclick={() => (page += 1)}
        >
          <span>Next</span>
          <i class="p-icon--chevron-down"></i>
        </button>
      </li>
    </ol>
  </nav>
{/if}

<style>
  .featured-badge {
    position: absolute;
    z-index: 1;
    top: 0.5rem;
    left: 0.5rem;
    margin: 0;
  }
</style>
