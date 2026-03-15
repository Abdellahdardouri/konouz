'use client';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: '1rem',
            fontFamily: 'system-ui, sans-serif'
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>حدث خطأ!</h2>
          <button
            onClick={() => reset()}
            style={{
              padding: '0.75rem 2rem',
              background: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            حاول مرة أخرى
          </button>
        </div>
      </body>
    </html>
  );
}
