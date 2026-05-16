export interface Category {
  id: string;
  label: string;
  icon: string;
  description: string;
  color: string;
  bgColor: string;
  systemContext: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "career",
    label: "Career",
    icon: "Briefcase",
    description: "Jobs, promotions, side projects",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10 border-blue-400/20",
    systemContext: "The user is asking about a career decision — jobs, promotions, business, side projects, or professional choices.",
  },
  {
    id: "relationships",
    label: "Relationships",
    icon: "Heart",
    description: "Dating, family, friendships",
    color: "text-rose-400",
    bgColor: "bg-rose-400/10 border-rose-400/20",
    systemContext: "The user is asking about a relationships decision — dating, romantic partnerships, family dynamics, or friendships.",
  },
  {
    id: "money",
    label: "Money",
    icon: "DollarSign",
    description: "Spending, investing, debt",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10 border-emerald-400/20",
    systemContext: "The user is asking about a financial decision — spending, investing, debt, budgeting, or major purchases.",
  },
  {
    id: "health",
    label: "Health",
    icon: "Activity",
    description: "Fitness, diet, medical",
    color: "text-orange-400",
    bgColor: "bg-orange-400/10 border-orange-400/20",
    systemContext: "The user is asking about a health decision — fitness, nutrition, medical choices, mental health, or lifestyle habits.",
  },
  {
    id: "life",
    label: "Life",
    icon: "Compass",
    description: "Big decisions & life changes",
    color: "text-violet-400",
    bgColor: "bg-violet-400/10 border-violet-400/20",
    systemContext: "The user is asking about a major life decision — moving cities, changing direction, big personal choices, or anything that doesn't fit another category.",
  },
];

export function getCategoryById(id: string | null): Category | undefined {
  if (!id) return undefined;
  return CATEGORIES.find((c) => c.id === id);
}
