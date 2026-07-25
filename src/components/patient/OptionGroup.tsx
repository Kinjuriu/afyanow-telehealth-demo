import type { IntakeOption } from "@/lib/intake";

type OptionGroupProps = {
  options: IntakeOption[];
  selected: string[];
  onToggle: (id: string) => void;
};

export default function OptionGroup({ options, selected, onToggle }: OptionGroupProps) {
  return (
    <div className="flex flex-wrap gap-2.5" role="group">
      {options.map((option) => {
        const isSelected = selected.includes(option.id);
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onToggle(option.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150 ${
              isSelected
                ? "border-indigo-600 bg-indigo-600 text-white"
                : "border-indigo-200 bg-white text-slate-700 hover:border-indigo-400"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
