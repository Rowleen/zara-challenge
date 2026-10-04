import type { ProductColorOption } from "@/lib/types/product";

import "./color-options.sass";

type ColorOptionsProps = {
  options: ProductColorOption[];
  selected: string | null;
  onSelect: (name: string) => void;
};

export function ColorOptions({
  options,
  selected,
  onSelect,
}: ColorOptionsProps) {
  return (
    <fieldset className="color-options">
      <legend className="color-options__legend">
        COLOR. PICK YOUR FAVOURITE.
      </legend>

      <div className="color-options__list" role="radiogroup" aria-label="Color">
        {options.map((option) => {
          const isSelected = selected === option.name;

          return (
            <button
              key={option.name}
              type="button"
              className={
                isSelected
                  ? "color-options__swatch is-selected"
                  : "color-options__swatch"
              }
              style={{ backgroundColor: option.hexCode }}
              role="radio"
              aria-checked={isSelected}
              aria-label={option.name}
              onClick={() => onSelect(option.name)}
            />
          );
        })}
      </div>

      {selected ? (
        <p className="color-options__name" aria-live="polite">
          {selected}
        </p>
      ) : null}
    </fieldset>
  );
}
