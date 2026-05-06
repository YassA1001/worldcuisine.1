import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  count?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({ value, count, interactive, onRate, size = 'md' }: StarRatingProps) {
  const [hover, setHover] = useState(0);

  const sizes = { sm: 12, md: 16, lg: 20 };
  const px = sizes[size];

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => {
        const filled = i <= (interactive ? hover || value : value);
        return (
          <Star
            key={i}
            size={px}
            fill={filled ? '#f97316' : 'none'}
            stroke={filled ? '#f97316' : '#d1d5db'}
            className={interactive ? 'cursor-pointer transition-transform hover:scale-125' : ''}
            onMouseEnter={() => interactive && setHover(i)}
            onMouseLeave={() => interactive && setHover(0)}
            onClick={() => interactive && onRate?.(i)}
          />
        );
      })}
      {count !== undefined && (
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({count})</span>
      )}
    </div>
  );
}
