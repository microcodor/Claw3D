import React from 'react';
import styles from './Spinner.module.css';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  fullscreen?: boolean;
  className?: string;
}

export default function Spinner({
  size = 'md',
  color = '#ff9500',
  fullscreen = false,
  className = '',
}: SpinnerProps) {
  const sizeClass = styles[size] || styles.md;

  const spinner = (
    <div
      className={`${styles.spinner} ${sizeClass} ${className}`}
      style={{ borderTopColor: color }}
      role="status"
      aria-label="加载中"
    >
      <span className={styles.srOnly}>加载中...</span>
    </div>
  );

  if (fullscreen) {
    return (
      <div className={styles.fullscreen}>
        {spinner}
      </div>
    );
  }

  return spinner;
}
