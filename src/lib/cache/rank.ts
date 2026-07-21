// lib/rank.ts
export function getRank(xp: number) {
  if (xp >= 10000) return "Ascendant";
  if (xp >= 6000) return "Legend";
  if (xp >= 3000) return "Master";
  if (xp >= 1500) return "Architect";
  if (xp >= 700) return "Builder";
  if (xp >= 300) return "Coder";
  if (xp >= 100) return "Explorer";
  return "Rookie";
}
