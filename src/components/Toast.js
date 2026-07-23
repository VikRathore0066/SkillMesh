'use client';
import { useState, useEffect, createContext, useContext, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        {toasts.map((toast) => (
          <div key={toast.id} className="card animate-slide-up" style={{
            padding: '1rem 1.5rem',
            borderLeft: `4px solid ${
              toast.type === 'success' ? 'var(--color-success)' :
              toast.type === 'error' ? 'var(--color-error)' :
              toast.type === 'warning' ? 'var(--color-warning)' : 'var(--color-primary)'
            }`,
            backgroundColor: 'var(--color-surface-2)'
          }}>
            <p style={{ margin: 0, fontWeight: 500, fontSize: '0.875rem' }}>{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
