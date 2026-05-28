interface BrewingGuideProps {
  temperature: number;
  time: number;
  caffeineLevel: string;
}

function formatBrewTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds} sec`;
  }
  if (seconds === 0) {
    return `${minutes} min`;
  }
  return `${minutes} min ${seconds} sec`;
}

const caffeineLevels: Record<string, { dots: number; label: string }> = {
  none: { dots: 0, label: 'Caffeine Free' },
  low: { dots: 1, label: 'Low Caffeine' },
  medium: { dots: 2, label: 'Medium Caffeine' },
  high: { dots: 3, label: 'High Caffeine' },
};

export function BrewingGuide({
  temperature,
  time,
  caffeineLevel,
}: BrewingGuideProps): React.JSX.Element {
  const caffeine = caffeineLevels[caffeineLevel] ?? {
    dots: 0,
    label: caffeineLevel,
  };

  return (
    <div className="rounded-2xl bg-steam p-6">
      <h3 className="mb-6 text-lg font-semibold text-charcoal">
        Brewing Guide
      </h3>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Temperature */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-matcha/10">
            <svg
              className="h-5 w-5 text-matcha"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-charcoal/50">Temperature</p>
            <p className="text-lg font-semibold text-charcoal">
              {temperature}&deg;C
            </p>
          </div>
        </div>

        {/* Brew Time */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-oolong/10">
            <svg
              className="h-5 w-5 text-oolong"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-charcoal/50">Brew Time</p>
            <p className="text-lg font-semibold text-charcoal">
              {formatBrewTime(time)}
            </p>
          </div>
        </div>

        {/* Caffeine Level */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-matcha/10">
            <svg
              className="h-5 w-5 text-matcha"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 8h1a4 4 0 010 8h-1" />
              <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-charcoal/50">Caffeine</p>
            <p className="text-lg font-semibold text-charcoal">
              {caffeine.label}
            </p>
            <div className="mt-1 flex gap-1">
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  className={`h-2 w-6 rounded-full ${
                    i < caffeine.dots ? 'bg-matcha' : 'bg-sage'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
