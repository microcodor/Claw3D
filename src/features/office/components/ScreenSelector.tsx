import { useOfficeLayout, type ActiveScreen } from '../hooks/useOfficeLayout';
import styles from './multi-screen-layout.module.css';

interface ScreenConfig {
  id: ActiveScreen;
  label: string;
  name: string;
}

const SCREENS: ScreenConfig[] = [
  { id: 'office', label: 'SCR-01', name: '数字办公室' },
  { id: 'trending', label: 'SCR-02', name: '热搜舆情中心' },
  { id: 'creation', label: 'SCR-03', name: '创作工作室' },
];

export function ScreenSelector() {
  const { screenMode, activeScreen, setActiveScreen } = useOfficeLayout();
  
  // Only show in single-screen mode
  if (screenMode !== 'single') {
    return null;
  }
  
  return (
    <div className={styles.screenTabs}>
      {SCREENS.map((screen, index) => (
        <div key={screen.id}>
          {index > 0 && <span className={styles.separator} />}
          <button
            className={`${styles.screenTab} ${activeScreen === screen.id ? styles.active : ''}`}
            onClick={() => setActiveScreen(screen.id)}
            title={`${screen.label} ${screen.name}`}
          >
            {screen.label} {screen.name}
          </button>
        </div>
      ))}
    </div>
  );
}
