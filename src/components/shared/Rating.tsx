interface RatingProps {
  rating: number;
  reviewCount?: number;
}

function StarIcon({
  filled,
  half,
}: {
  filled: boolean;
  half: boolean;
}): React.JSX.Element {
  if (half) {
    return (
      <svg
        className="h-4 w-4 text-oolong"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="half-fill">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          fill="url(#half-fill)"
          stroke="currentColor"
          strokeWidth="0.5"
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        />
      </svg>
    );
  }

  return (
    <svg
      className={`h-4 w-4 ${filled ? 'text-oolong' : 'text-sage'}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export function Rating({
  rating,
  reviewCount,
}: RatingProps): React.JSX.Element {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const roundedUp = rating - fullStars >= 0.75;
  const totalFilled = roundedUp ? fullStars + 1 : fullStars;

  return (
    <div className="flex items-center gap-1">
      <div className="flex" aria-label={`Rating: ${rating} out of 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <StarIcon
            key={i}
            filled={i < totalFilled}
            half={!roundedUp && hasHalfStar && i === fullStars}
          />
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className="ml-1 text-sm text-charcoal/50">
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
}
