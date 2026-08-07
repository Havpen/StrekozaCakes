# STREKOZA

Одностраничный сайт крафтовых десертов на заказ в Гомеле.

Сайт: https://havpen.github.io/StrekozaCakes/

## Запуск

```bash
npm install
npm run dev
```

Сборка:

```bash
npm run build
npm run preview
```

## SEO / пререндер

После `npm run build` проверьте `dist/index.html`:

1. В `<head>` есть `canonical`, Open Graph, `application/ld+json`
2. Внутри `#root` есть текстовый H1 и блок FAQ (SEO-fallback до гидрации React)
3. Открываются `/robots.txt` и `/sitemap.xml` (на проде с префиксом `/StrekozaCakes/`)

Канонический URL и константы: [`src/config/siteSeo.ts`](src/config/siteSeo.ts).

## GitHub Pages

Деплой: push в `main` (workflow) и/или ветка `gh-pages`.

На проде `base` = `/StrekozaCakes/` (через `GITHUB_ACTIONS=true` при сборке).

## Контент

Тексты, цены, Instagram и город — в [`src/content/site.ts`](src/content/site.ts).  
FAQ и мета — в [`src/config/siteSeo.ts`](src/config/siteSeo.ts).  
Фото — в `public/images/`.
