import React from 'react';
import styles from './Skeleton.module.css';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rect' | 'circle';
  animation?: 'pulse' | 'wave';
  className?: string;
}

export default function Skeleton({
  width = '100%',
  height = '20px',
  variant = 'rect',
  animation = 'pulse',
  className = '',
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  const variantClass = styles[variant] || styles.rect;
  const animationClass = styles[animation] || styles.pulse;

  return (
    <div
      className={`${styles.skeleton} ${variantClass} ${animationClass} ${className}`}
      style={style}
      aria-busy="true"
      aria-live="polite"
    />
  );
}
