"use client";

import { CATEGORIES } from "@/lib/categories";
import { Briefcase, Heart, DollarSign, Activity, Compass } from "lucide-react";

const ICONS = {
  Briefcase,
  Heart,
  DollarSign,
  Activity,
  Compass,
};

interface CategorySelectorProps {
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export function CategorySelector({ selected, onSelect }: CategorySelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {CATEGORIES.map((cat) => {
        const Icon = ICONS[cat.icon as keyof typeof ICONS];
        const isSelected = selected === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(isSelected ? null : cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 cursor-pointer ${
              isSelected
                ? `${cat.bgColor} ${cat.color} border-current`
                : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Icon size={13} />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
