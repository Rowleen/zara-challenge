import type { ChangeEvent, FormEvent } from "react";

import "./search-bar.sass";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  describedBy?: string;
};

export function SearchBar({ value, onChange, describedBy }: SearchBarProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form
      className="search-bar"
      role="search"
      onSubmit={handleSubmit}
      aria-label="Smartphones"
    >
      <label className="search-bar__label" htmlFor="smartphone-search">
        Search for a smartphone
      </label>

      <input
        id="smartphone-search"
        className="search-bar__input"
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Search for a smartphone..."
        autoComplete="off"
        aria-describedby={describedBy}
      />
    </form>
  );
}
