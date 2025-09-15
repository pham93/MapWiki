import { X } from 'lucide-react';
import { Button } from './button';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface CountryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  country: Record<string, any> | null;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function CountryDrawer({
  isOpen,
  onClose,
  country,
}: CountryDrawerProps) {
  if (!isOpen || !country) return null;

  // Determine if this is a state or country based on properties
  const isState = country.STATE !== undefined;
  const title = isState ? 'State Information' : 'Country Information';
  const name = country.NAME || country.name || 'Unknown';
  const clickText = isState
    ? 'Click on another state to view its information'
    : 'Click on another country to view its information';

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-background border-l shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Name
          </label>
          <p className="text-lg font-medium">{name}</p>
        </div>

        {isState ? (
          <>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                State Code
              </label>
              <p className="text-sm">{country.STATE || 'N/A'}</p>
            </div>

            {country.CENSUSAREA && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Area
                </label>
                <p className="text-sm">
                  {country.CENSUSAREA.toLocaleString()} km²
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                ISO Code
              </label>
              <p className="text-sm">
                {country.iso_a2 || country.iso_a3 || 'N/A'}
              </p>
            </div>

            {country.capital && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Capital
                </label>
                <p className="text-sm">{country.capital}</p>
              </div>
            )}

            {country.population && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Population
                </label>
                <p className="text-sm">{country.population.toLocaleString()}</p>
              </div>
            )}

            {country.area && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Area
                </label>
                <p className="text-sm">{country.area.toLocaleString()} km²</p>
              </div>
            )}

            {country.continent && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Continent
                </label>
                <p className="text-sm">{country.continent}</p>
              </div>
            )}
          </>
        )}

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">{clickText}</p>
        </div>
      </div>
    </div>
  );
}
