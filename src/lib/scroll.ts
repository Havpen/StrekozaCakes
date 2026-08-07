/** Плавный скролл к секции без якоря в адресной строке. */
export function scrollToSection(
  id: string,
  event?: { preventDefault(): void },
) {
  event?.preventDefault()

  const target = document.getElementById(id)
  if (!target) return

  target.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const clean =
    window.location.pathname + window.location.search ||
    import.meta.env.BASE_URL
  if (window.location.hash || window.location.href.endsWith('#')) {
    window.history.replaceState(null, '', clean)
  }
}

/** Убрать hash из URL при загрузке (если кто-то открыл старую ссылку). */
export function stripHashFromUrl() {
  if (!window.location.hash) return
  const clean = window.location.pathname + window.location.search
  window.history.replaceState(null, '', clean || import.meta.env.BASE_URL)
}
