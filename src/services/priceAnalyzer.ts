export function getDealLabel(discountPercent: number): { text: string; color: string } {
  if (discountPercent >= 40) return { text: 'INCREDIBLE DEAL', color: 'text-red-400 bg-red-500/20 border-red-500/30' };
  if (discountPercent >= 30) return { text: 'HOT DEAL', color: 'text-orange-400 bg-orange-500/20 border-orange-500/30' };
  if (discountPercent >= 20) return { text: 'GREAT PRICE', color: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30' };
  if (discountPercent >= 10) return { text: 'GOOD DEAL', color: 'text-green-400 bg-green-500/20 border-green-500/30' };
  return { text: 'DEAL', color: 'text-blue-400 bg-blue-500/20 border-blue-500/30' };
}
