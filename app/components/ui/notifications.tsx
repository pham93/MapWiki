import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useNotifications } from '~/lib/global-state';
import { Button } from './button';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: 'text-green-600 bg-green-50 border-green-200',
  error: 'text-red-600 bg-red-50 border-red-200',
  warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  info: 'text-blue-600 bg-blue-50 border-blue-200',
};

export function Notifications() {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => {
        const Icon = iconMap[notification.type];

        return (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border shadow-lg animate-in slide-in-from-right-2 ${colorMap[notification.type]}`}
          >
            <div className="flex items-start gap-3">
              <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeNotification(notification.id)}
                className="h-6 w-6 p-0 hover:bg-black/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
