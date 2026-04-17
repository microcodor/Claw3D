import { type ReactNode, Fragment, lazy, Suspense, useMemo } from 'react';
import { Link2 } from 'lucide-react';
import { useOfficeLayout } from '../hooks/useOfficeLayout';
import { ScreenSelector } from './ScreenSelector';
import { LayoutToggle } from './LayoutToggle';
import { RunningAvatarLoader } from '@/features/agents/components/RunningAvatarLoader';
import { createStudioSettingsCoordinator } from '@/lib/studio/coordinator';
import { useRuntimeConnection } from '@/lib/runtime/useRuntimeConnection';
import styles from './multi-screen-layout.module.css';

// Lazy load SCR-02 and SCR-03 to minimize performance impact
const TrendingCenter = lazy(() => import('@/features/trending-center/screens/TrendingCenterScreen'));
const CreationStudio = lazy(() => import('@/features/creation-studio/screens/CreationStudioScreen'));

interface MultiScreenLayoutProps {
  officeScreen: ReactNode;
}

function ScreenDivider({ vertical }: { vertical: boolean }) {
  return (
    <div className={`${styles.divider} ${vertical ? styles.vertical : styles.horizontal}`}>
      <div className={styles.dividerLine} />
      <div className={styles.dividerDots}>
        {[0, 1, 2].map((i) => (
          <div key={i} className={styles.dividerDot} />
        ))}
      </div>
      <div className={styles.dividerLine} />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-background"
      aria-label="Loading screen"
      role="status"
    >
      <div className="flex flex-col items-center gap-3">
        <RunningAvatarLoader
          size={28}
          trackWidth={76}
          label="Loading..."
          labelClassName="text-muted-foreground"
        />
      </div>
    </div>
  );
}

export function MultiScreenLayout({ officeScreen }: MultiScreenLayoutProps) {
  const { screenMode, activeScreen, layoutDirection } = useOfficeLayout();
  const settingsCoordinator = useMemo(() => createStudioSettingsCoordinator(), []);
  const { status } = useRuntimeConnection(settingsCoordinator);
  
  const isVertical = layoutDirection === 'column';
  const isSingleMode = screenMode === 'single';
  
  // Determine which screens to render
  const screens = isSingleMode
    ? [{ id: activeScreen, component: getScreenComponent(activeScreen, officeScreen) }]
    : [
        { id: 'office', component: officeScreen },
        { id: 'trending', component: <Suspense fallback={<LoadingFallback />}><TrendingCenter /></Suspense> },
        { id: 'creation', component: <Suspense fallback={<LoadingFallback />}><CreationStudio /></Suspense> },
      ];
  
  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500 animate-pulse';
      case 'disconnected':
      default:
        return 'bg-red-500';
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'CONNECTED';
      case 'connecting':
        return 'CONNECTING';
      case 'disconnected':
      default:
        return 'DISCONNECTED';
    }
  };
  
  const handleOpenConnectDialog = () => {
    // Dispatch custom event to trigger connect dialog in OfficeScreen
    window.dispatchEvent(new CustomEvent('openGatewayConnectDialog'));
  };
  
  return (
    <div className={styles.container}>
      {/* Control bar */}
      <div className={styles.controlBar}>
        <div className={styles.controlBarLeft}>
          <span className={styles.brand}>网络安全学堂·AI实验室</span>
          <span className={styles.version}>v2.4.1</span>
          <ScreenSelector />
        </div>
        <div className={styles.controlBarRight}>
          <div className={styles.statusIndicator}>
            <span className={`${styles.statusDot} ${getStatusColor()}`} />
            <span>{getStatusText()}</span>
          </div>
          <button
            type="button"
            className={styles.connectButton}
            onClick={handleOpenConnectDialog}
            aria-label="Open connection dialog"
            title="Gateway Connection"
          >
            <Link2 className="h-4 w-4" />
            <span>连接</span>
          </button>
          <LayoutToggle />
        </div>
      </div>
      
      {/* Screens container */}
      <div
        className={`${styles.screensContainer} ${isVertical ? styles.column : styles.row} ${
          isSingleMode ? styles.singleMode : styles.multiMode
        }`}
      >
        {screens.map((screen, index) => (
          <Fragment key={screen.id}>
            <div className={styles.screenWrapper}>
              {screen.component}
            </div>
            {index < screens.length - 1 && <ScreenDivider vertical={isVertical} />}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function getScreenComponent(screenId: string, officeScreen: ReactNode): ReactNode {
  switch (screenId) {
    case 'office':
      return officeScreen;
    case 'trending':
      return <Suspense fallback={<LoadingFallback />}><TrendingCenter /></Suspense>;
    case 'creation':
      return <Suspense fallback={<LoadingFallback />}><CreationStudio /></Suspense>;
    default:
      return officeScreen;
  }
}
