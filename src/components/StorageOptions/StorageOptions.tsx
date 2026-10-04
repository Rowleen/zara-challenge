import type { ProductStorageOption } from "@/lib/types/product";

import "./storage-options.sass";

type StorageOptionsProps = {
  options: ProductStorageOption[];
  selected: string | null;
  onSelect: (capacity: string) => void;
};

export function StorageOptions({
  options,
  selected,
  onSelect,
}: StorageOptionsProps) {
  return (
    <fieldset className="storage-options">
      <legend className="storage-options__legend">
        STORAGE. HOW MUCH SPACE DO YOU NEED?
      </legend>

      <div
        className="storage-options__list"
        role="radiogroup"
        aria-label="Storage capacity"
      >
        {options.map((option) => {
          const isSelected = selected === option.capacity;

          return (
            <button
              key={option.capacity}
              type="button"
              className={
                isSelected
                  ? "storage-options__option is-selected"
                  : "storage-options__option"
              }
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(option.capacity)}
            >
              {option.capacity}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
