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

## GitHub Pages

Деплой идёт автоматически при пуше в `main` (workflow `.github/workflows/deploy-pages.yml`).

Один раз в настройках репозитория:

1. **Settings → Pages → Build and deployment → Source:** GitHub Actions
2. Дождаться зелёного workflow после пуша

## Контент

Тексты, цены, Instagram и город — в [`src/content/site.ts`](src/content/site.ts).  
Фото для сайта — в `public/images/`.
