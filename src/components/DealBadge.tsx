import { getDealLabel } from '../services/priceAnalyzer';

interface Props {
  discountPercent: number;
  size?: 'sm' | 'md';
}

export default function DealBadge({ discountPercent, size = 'sm' }: Props) {
  const { text, color } = getDealLabel(discountPercent);

  return (
    <span
      className={`inline-flex items-center font-bold border rounded-full ${color} ${
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1'
      }`}
    >
      {text} &middot; {discountPercent}% OFF
    </span>
  );
}
