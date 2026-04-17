import { useOfficeLayout } from '../hooks/useOfficeLayout';
import styles from './multi-screen-layout.module.css';

function RowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="3" width="4" height="10" rx="1" fill="currentColor" opacity="0.9"/>
      <rect x="6" y="3" width="4" height="10" rx="1" fill="currentColor" opacity="0.9"/>
      <rect x="11" y="3" width="4" height="10" rx="1" fill="currentColor" opacity="0.9"/>
    </svg>
  );
}

function ColumnIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="1" width="10" height="4" rx="1" fill="currentColor" opacity="0.9"/>
      <rect x="3" y="6" width="10" height="4" rx="1" fill="currentColor" opacity="0.9"/>
      <rect x="3" y="11" width="10" height="4" rx="1" fill="currentColor" opacity="0.9"/>
    </svg>
  );
}

function SingleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="12" height="12" rx="1" fill="currentColor" opacity="0.9"/>
    </svg>
  );
}

function MultiIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="0.5" fill="currentColor" opacity="0.9"/>
      <rect x="9" y="1" width="6" height="6" rx="0.5" fill="currentColor" opacity="0.9"/>
      <rect x="1" y="9" width="6" height="6" rx="0.5" fill="currentColor" opacity="0.9"/>
      <rect x="9" y="9" width="6" height="6" rx="0.5" fill="currentColor" opacity="0.9"/>
    </svg>
  );
}

export function LayoutToggle() {
  const { screenMode, layoutDirection, toggleScreenMode, toggleLayoutDirection } = useOfficeLayout();
  
  return (
    <div className={styles.layoutControls}>
      {/* Screen mode toggle */}
      <button
        className={`${styles.layoutBtn} ${screenMode === 'single' ? styles.active : ''}`}
        onClick={toggleScreenMode}
        title={screenMode === 'single' ? '切换到多屏模式' : '切换到单屏模式'}
      >
        {screenMode === 'single' ? <SingleIcon /> : <MultiIcon />}
      </button>
      
      {/* Layout direction toggle (only in multi-screen mode) */}
      {screenMode === 'multi' && (
        <>
          <span className={styles.separator} />
          <button
            className={`${styles.layoutBtn} ${layoutDirection === 'row' ? styles.active : ''}`}
            onClick={toggleLayoutDirection}
            title="横向并排"
          >
            <RowIcon />
          </button>
          <button
            className={`${styles.layoutBtn} ${layoutDirection === 'column' ? styles.active : ''}`}
            onClick={toggleLayoutDirection}
            title="纵向排列"
          >
            <ColumnIcon />
          </button>
        </>
      )}
    </div>
  );
}
