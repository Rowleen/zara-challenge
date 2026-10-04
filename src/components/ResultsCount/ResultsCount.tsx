import "./results-count.sass";

type ResultsCountProps = {
  id: string;
  count: number;
};

export function ResultsCount({ id, count }: ResultsCountProps) {
  return (
    <p
      id={id}
      className="results-count"
      aria-live="polite"
      aria-atomic="true"
    >
      {count} RESULTS
    </p>
  );
}
