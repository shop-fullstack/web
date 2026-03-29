const CATEGORY_VISUALS: Record<string, { emoji: string; gradient: string }> = {
  "식자재": { emoji: "🍳", gradient: "from-orange-100 via-amber-50 to-yellow-100" },
  "소모품": { emoji: "🧴", gradient: "from-blue-100 via-sky-50 to-cyan-100" },
  "포장재": { emoji: "📦", gradient: "from-yellow-100 via-amber-50 to-orange-50" },
  "뷰티용품": { emoji: "💄", gradient: "from-pink-100 via-rose-50 to-fuchsia-50" },
  "인테리어": { emoji: "🪑", gradient: "from-emerald-100 via-green-50 to-teal-50" },
  "기타": { emoji: "📋", gradient: "from-slate-100 via-gray-50 to-zinc-100" },
};

const DEFAULT_VISUAL = { emoji: "📦", gradient: "from-gray-100 via-gray-50 to-slate-100" };

export function getCategoryVisual(category: string) {
  return CATEGORY_VISUALS[category] || DEFAULT_VISUAL;
}
