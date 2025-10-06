import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { ThemeProvider } from '~/lib/theme-provider';
import { LayerProvider } from '~/lib/layer-context';
import { GlobalStateProvider } from '~/lib/global-state';
import { EnvironmentProvider } from '~/lib/env-provider';
import { Sidebar } from '~/components/ui/sidebar';
import type { Route } from './+types/root';
import './app.css';
import { DetailDrawer } from './components/ui/detail-drawer';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [vectorOpacity, setVectorOpacity] = useState(0.7);
  return (
    <EnvironmentProvider>
      <GlobalStateProvider>
        <ThemeProvider defaultTheme="system" storageKey="map-visual-ui-theme">
          <LayerProvider
            vectorOpacity={vectorOpacity}
            setVectorOpacity={setVectorOpacity}
          >
            <Sidebar />
            <DetailDrawer />
            <Outlet />
          </LayerProvider>
        </ThemeProvider>
      </GlobalStateProvider>
    </EnvironmentProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
