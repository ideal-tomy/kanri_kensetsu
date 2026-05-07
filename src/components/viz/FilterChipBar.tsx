"use client";

interface FilterChipOption<T extends string> {
  id: T;
  label: string;
  count?: number;
}

interface FilterChipBarProps<T extends string> {
  label?: string;
  options: FilterChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function FilterChipBar<T extends string>({
  label,
  options,
  value,
  onChange,
}: FilterChipBarProps<T>) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {label ? (
        <span className="text-xs font-semibold text-zinc-500">{label}</span>
      ) : null}
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`min-h-9 rounded-full px-3 py-1.5 text-sm font-medium transition ${
              active
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            {opt.label}
            {opt.count != null ? (
              <span className="ml-1 text-xs opacity-80">({opt.count})</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
