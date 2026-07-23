'use client';

export default function StarRating({ value, onChange, readonly = false, size = 24 }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      {stars.map((star) => {
        const isFilled = star <= value;
        return (
          <svg
            key={star}
            onClick={() => !readonly && onChange && onChange(star)}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={isFilled ? 'var(--color-warning)' : 'none'}
            stroke={isFilled ? 'var(--color-warning)' : 'var(--color-text-muted)'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              cursor: readonly ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: (readonly && !isFilled) ? 0.3 : 1
            }}
            onMouseEnter={(e) => {
              if (!readonly && onChange) {
                e.currentTarget.style.transform = 'scale(1.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (!readonly && onChange) {
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      })}
    </div>
  );
}
