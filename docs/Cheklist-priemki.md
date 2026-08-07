# Чеклист приёмки SEO (STREKOZA)

Отмечать после деплоя на https://havpen.github.io/StrekozaCakes/

## A. Инфраструктура

- [ ] `/StrekozaCakes/robots.txt` открывается, есть Sitemap
- [ ] `/StrekozaCakes/sitemap.xml` открывается, loc = канон
- [ ] canonical в head
- [ ] title + description по ТЗ
- [ ] Open Graph + twitter:card
- [ ] favicon / apple-touch-icon
- [ ] кастомная 404 со ссылкой на главную

## B. Контент

- [ ] один H1 про 4 направления + Гомель
- [ ] в каталоге равноправно: корпусные / муссовые / трайфлы / моти
- [ ] условия: муссовые от 3 дней
- [ ] условия: предоплата 50% за муссовые
- [ ] условия: доставка не в цене
- [ ] блок FAQ × 7
- [ ] CTA Direct `@strekoza_cakes_` работает

## C. DOM

- [ ] header / main / nav / section / footer
- [ ] H1 → H2 → H3 без скачков
- [ ] alt у контентных изображений

## D. Schema

- [ ] Bakery/LocalBusiness (Гомель, без улицы, sameAs IG)
- [ ] каталог Product/ItemList + BYN
- [ ] FAQPage
- [ ] нет фейковых Review/AggregateRating
- [ ] Rich Results Test без критических ошибок

## E. Пререндер

- [ ] View Source показывает H1 и текст FAQ
- [ ] в `dist/index.html` есть контент, не только пустой `#root`

## F. Скорость

- [ ] hero без lazy, желательно fetchpriority=high
- [ ] остальные img с lazy
- [ ] width/height или aspect-ratio (CLS)
- [ ] PageSpeed mobile прогнан, красный LCP/CLS по нашим картинкам убран

## G. Регрессии

- [ ] путь `/StrekozaCakes/` не сломан
- [ ] карусели/каталог/Direct как раньше
- [ ] dev-режим Vite работает
