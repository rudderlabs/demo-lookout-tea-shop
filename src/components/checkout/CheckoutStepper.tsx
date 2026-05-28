interface CheckoutStepperProps {
  currentStep: number;
  steps: string[];
}

function CheckIcon(): React.JSX.Element {
  return (
    <svg
      className="h-5 w-5 text-white"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function CheckoutStepper({
  currentStep,
  steps,
}: CheckoutStepperProps): React.JSX.Element {
  return (
    <nav aria-label="Checkout progress" className="mb-8">
      <ol className="flex items-center justify-center gap-0">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isFuture = stepNumber > currentStep;

          return (
            <li key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'border-matcha bg-matcha'
                      : isCurrent
                        ? 'border-matcha bg-white'
                        : 'border-sage bg-white'
                  }`}
                >
                  {isCompleted ? (
                    <CheckIcon />
                  ) : (
                    <span
                      className={`text-sm font-semibold ${
                        isCurrent ? 'text-matcha' : 'text-charcoal/40'
                      }`}
                    >
                      {stepNumber}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`mt-2 text-xs font-medium ${
                    isCompleted
                      ? 'text-matcha'
                      : isCurrent
                        ? 'text-charcoal'
                        : isFuture
                          ? 'text-charcoal/40'
                          : 'text-charcoal/40'
                  }`}
                >
                  {step}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`mx-2 mb-6 h-0.5 w-16 transition-colors duration-300 sm:w-24 ${
                    stepNumber < currentStep ? 'bg-matcha' : 'bg-sage'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
