function StarRating({ rating, count }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="d-flex gap-1 mb-3">
      {[...Array(fullStars)].map((_, i) => (
        <i key={`full-${i}`} className="bi bi-star-fill text-warning"></i>
      ))}

      {hasHalfStar && <i className="bi bi-star-half text-warning"></i>}

      {[...Array(emptyStars)].map((_, i) => (
        <i key={`empty-${i}`} className="bi bi-star text-warning"></i>
      ))}

      <span className="ms-2">{rating.toFixed(1)}</span>
      <span className="ms-2">({count} reviews)</span>
    </div>
  );
}

export default StarRating;
