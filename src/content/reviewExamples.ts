import { asset } from '@/lib/asset'

export type PublicReview = {
  id: string
  name: string
  text: string
  photoUrl: string
  createdAt?: string
  source: 'api' | 'example'
}

/** Примеры отзывов, пока в БД ещё нет одобренных / API недоступен локально */
export const REVIEW_EXAMPLES: PublicReview[] = [
  {
    id: 'ex-anna',
    name: 'Анна',
    text: 'Заказывала бенто ко дню рождения — декор один в один как на фото, вкус нежный. Буду ещё!',
    photoUrl: asset('images/reviews/anna.webp'),
    source: 'example',
  },
  {
    id: 'ex-maria',
    name: 'Мария',
    text: 'Муссовый торт на праздник — гости спрашивали, где заказывали. В Direct всё быстро согласовали.',
    photoUrl: asset('images/reviews/maria.webp'),
    source: 'example',
  },
  {
    id: 'ex-ekaterina',
    name: 'Екатерина',
    text: 'Трайфлы и моти на корпоратив — красиво упаковали, всем зашло. Спасибо STREKOZA!',
    photoUrl: asset('images/reviews/ekaterina.webp'),
    source: 'example',
  },
]
