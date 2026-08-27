<script>
  let { name } = $props();

  const initials = $derived(
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase(),
  );
</script>

<div class="placeholder u-align--center u-vertically-center" aria-hidden="true">
  <span
    class="placeholder__initials p-heading--2 u-align--center u-no-margin--bottom u-vertically-center"
  >
    {initials}
  </span>
</div>

<style>
  .placeholder {
    position: absolute;
    inset: 0;
    overflow: hidden;
    background: var(--u-pink);
  }

  .placeholder::before,
  .placeholder::after {
    position: absolute;
    border-radius: 50%;
    content: '';
  }

  .placeholder::before {
    top: -24%;
    right: -20%;
    width: 82%;
    aspect-ratio: 1;
    background: var(--u-orange);
    opacity: 0.22;
  }

  .placeholder::after {
    bottom: -38%;
    left: -26%;
    width: 98%;
    aspect-ratio: 1;
    background: var(--u-aubergine);
    opacity: 0.14;
  }

  .placeholder__initials {
    width: 5.5rem;
    aspect-ratio: 1;
    position: relative;
    z-index: 1;
    border-radius: 50%;
    background: var(--u-aubergine);
    box-shadow: 0 0 0 0.5rem #fff;
    color: #fff;
  }
</style>
