import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast, { ToastProps } from './Toast';
import styles from './ToastContainer.module.css';

export interface ToastContainerProps {
  toasts: Omit<ToastProps, 'onClose'>[];
  onClose: (id: string) => void;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

export default function ToastContainer({
  toasts,
  onClose,
  position = 'top-right',
}: ToastContainerProps) {
  const positionClass = styles[position] || styles.topRight;

  return (
    <div className={`${styles.container} ${positionClass}`}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
}
