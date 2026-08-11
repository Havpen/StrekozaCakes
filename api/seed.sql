-- Примеры отзывов (после копирования фото в api/uploads/reviews/)
-- Либо оставьте пустым: фронт покажет статические примеры, пока нет одобждённых.

INSERT INTO reviews (name, text, photo_path, status, created_at) VALUES
(
  'Анна',
  'Заказывала бенто ко дню рождения — декор один в один как на фото, вкус нежный. Буду ещё!',
  'examples/anna.webp',
  'approved',
  DATE_SUB(NOW(), INTERVAL 12 DAY)
),
(
  'Мария',
  'Муссовый торт на праздник — гости спрашивали, где заказывали. В Direct всё быстро согласовали.',
  'examples/maria.webp',
  'approved',
  DATE_SUB(NOW(), INTERVAL 7 DAY)
),
(
  'Екатерина',
  'Трайфлы и моти на корпоратив — красиво упаковали, всем зашло. Спасибо STREKOZA!',
  'examples/ekaterina.webp',
  'approved',
  DATE_SUB(NOW(), INTERVAL 3 DAY)
);
