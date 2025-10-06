import { useGlobalState } from './global-state';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
  autoHide?: boolean;
  duration?: number;
}

export function useNotifications() {
  const {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  } = useGlobalState();
  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    addSuccess: (message: string) =>
      addNotification({ type: 'success', message }),
    addError: (message: string) => addNotification({ type: 'error', message }),
    addWarning: (message: string) =>
      addNotification({ type: 'warning', message }),
    addInfo: (message: string) => addNotification({ type: 'info', message }),
  };
}
