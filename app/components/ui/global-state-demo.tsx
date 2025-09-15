import { Button } from './button';
import {
  useSidebar,
  useTheme,
  useLoading,
  useError,
  useNotifications,
  useMapSettings,
  useGlobalValue,
} from '~/lib/global-state';

export function GlobalStateDemo() {
  const sidebar = useSidebar();
  const theme = useTheme();
  const loading = useLoading();
  const error = useError();
  const notifications = useNotifications();
  const mapSettings = useMapSettings();

  // Custom global value example
  const [customValue, setCustomValue] = useGlobalValue('customCounter', 0);

  const handleAddNotification = () => {
    notifications.addSuccess('This is a success notification!');
  };

  const handleAddError = () => {
    notifications.addError('This is an error notification!');
  };

  const handleSetLoading = () => {
    loading.startLoading();
    setTimeout(() => loading.stopLoading(), 2000);
  };

  const handleSetError = () => {
    error.setError('This is a demo error message');
    setTimeout(() => error.clearError(), 3000);
  };

  const handleCustomValue = () => {
    setCustomValue(customValue + 1);
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border max-w-sm">
      <h3 className="text-lg font-semibold mb-3">Global State Demo</h3>

      <div className="space-y-2">
        {/* Sidebar Controls */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={sidebar.isOpen ? 'default' : 'outline'}
            onClick={sidebar.toggle}
          >
            {sidebar.isOpen ? 'Close' : 'Open'} Sidebar
          </Button>
        </div>

        {/* Theme Controls */}
        <div className="flex gap-2">
          {(['light', 'dark', 'system'] as const).map((t) => (
            <Button
              key={t}
              size="sm"
              variant={theme.theme === t ? 'default' : 'outline'}
              onClick={() => theme.setTheme(t)}
            >
              {t}
            </Button>
          ))}
        </div>

        {/* Loading State */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleSetLoading}
            disabled={loading.isLoading}
          >
            {loading.isLoading ? 'Loading...' : 'Start Loading'}
          </Button>
        </div>

        {/* Error State */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleSetError}
            disabled={!!error.error}
          >
            {error.error ? 'Error Set' : 'Set Error'}
          </Button>
          {error.error && (
            <Button size="sm" variant="outline" onClick={error.clearError}>
              Clear Error
            </Button>
          )}
        </div>

        {/* Notifications */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleAddNotification}>
            Add Success
          </Button>
          <Button size="sm" variant="outline" onClick={handleAddError}>
            Add Error
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={notifications.clearNotifications}
          >
            Clear All
          </Button>
        </div>

        {/* Custom Global Value */}
        <div className="flex gap-2 items-center">
          <Button size="sm" variant="outline" onClick={handleCustomValue}>
            Increment Counter
          </Button>
          <span className="text-sm">Count: {customValue}</span>
        </div>

        {/* Map Settings */}
        <div className="text-xs text-gray-600 dark:text-gray-400">
          <div>Zoom: {mapSettings.mapSettings.zoom}</div>
          <div>Center: [{mapSettings.mapSettings.center.join(', ')}]</div>
          <div>
            Controls: {mapSettings.mapSettings.showControls ? 'On' : 'Off'}
          </div>
        </div>

        {/* Current State Summary */}
        <div className="text-xs text-gray-600 dark:text-gray-400 border-t pt-2 mt-2">
          <div>Sidebar: {sidebar.isOpen ? 'Open' : 'Closed'}</div>
          <div>Theme: {theme.theme}</div>
          <div>Loading: {loading.isLoading ? 'Yes' : 'No'}</div>
          <div>Error: {error.error ? 'Yes' : 'No'}</div>
          <div>Notifications: {notifications.notifications.length}</div>
        </div>
      </div>
    </div>
  );
}
