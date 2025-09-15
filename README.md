# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Environment Variables

This application uses environment variables for configuration. Copy `.env.example` to `.env` and update the values as needed:

```bash
cp .env.example .env
```

### Available Environment Variables

| Variable                      | Description                         | Default                     |
| ----------------------------- | ----------------------------------- | --------------------------- |
| `VITE_API_BASE_URL`           | Base URL for API calls              | `http://localhost:3001/api` |
| `VITE_API_TIMEOUT`            | API request timeout in milliseconds | `10000`                     |
| `VITE_MAP_DEFAULT_CENTER_LAT` | Default map center latitude         | `39.8283`                   |
| `VITE_MAP_DEFAULT_CENTER_LNG` | Default map center longitude        | `-98.5795`                  |
| `VITE_MAP_DEFAULT_ZOOM`       | Default map zoom level              | `4`                         |
| `VITE_MAP_MAX_ZOOM`           | Maximum map zoom level              | `18`                        |
| `VITE_MAP_MIN_ZOOM`           | Minimum map zoom level              | `1`                         |
| `VITE_ENABLE_DEBUG_MODE`      | Enable debug logging                | `false`                     |
| `VITE_ENABLE_ANALYTICS`       | Enable analytics tracking           | `true`                      |
| `VITE_ENABLE_NOTIFICATIONS`   | Enable notification system          | `true`                      |
| `VITE_GOOGLE_MAPS_API_KEY`    | Google Maps API key                 | -                           |
| `VITE_OPENWEATHER_API_KEY`    | OpenWeather API key                 | -                           |
| `VITE_APP_NAME`               | Application name                    | `Map Visual`                |
| `VITE_APP_VERSION`            | Application version                 | `1.0.0`                     |
| `VITE_APP_ENVIRONMENT`        | Application environment             | `development`               |

### Using Environment Variables in Components

```tsx
import { useEnvironment, useApiConfig, useMapConfig } from '~/lib/env-provider';

function MyComponent() {
  // Access all environment variables
  const env = useEnvironment();

  // Access specific configurations
  const apiConfig = useApiConfig();
  const mapConfig = useMapConfig();

  return (
    <div>
      <p>API Base URL: {apiConfig.baseUrl}</p>
      <p>Map Center: {mapConfig.defaultCenter.join(', ')}</p>
    </div>
  );
}
```

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
