import { site } from '../content/site'

export function Reviews() {
  const hasReviews = site.reviews.length > 0

  return (
    <section className="section" id="reviews">
      <div className="shell">
        <div className="section__head">
          <h2 className="section__title">{site.reviewsPlaceholder.title}</h2>
        </div>

        {hasReviews ? (
          <div className="reviews-grid">
            {site.reviews.map((review) => (
              <blockquote className="review" key={`${review.name}-${review.text.slice(0, 12)}`}>
                <p className="review__text">«{review.text}»</p>
                <cite className="review__name">{review.name}</cite>
              </blockquote>
            ))}
          </div>
        ) : (
          <div className="reviews-empty">
            <h3 className="condition__title">Скоро</h3>
            <p>{site.reviewsPlaceholder.text}</p>
          </div>
        )}
      </div>
    </section>
  )
}
