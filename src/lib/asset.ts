/** Prefix public assets for GitHub Pages (`/StrekozaCakes/`) and local (`/`). */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL
  return `${base}${path.replace(/^\//, '')}`
}
