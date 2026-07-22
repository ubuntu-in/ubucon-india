// Prefix an internal path with the deploy base. Astro does NOT auto-prefix
// <a href> or asset paths — route every internal link through this.
// url('/about') -> '/india/about', url('/') -> '/india/'
const BASE = import.meta.env.BASE_URL.replace(/\/$/, ''); // '/india' (no trailing)

export function url(path = '/'): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return BASE + p;
}
