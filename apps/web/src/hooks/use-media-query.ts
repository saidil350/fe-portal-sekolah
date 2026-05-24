import * as React from 'react';

export function useMediaQuery(query: string): boolean {
  const [value, setValue] = React.useState(false);

  React.useEffect(() => {
    function handler(e: MediaQueryListEvent) {
      setValue(e.matches);
    }

    const result = window.matchMedia(query);
    setValue(result.matches);
    result.addEventListener('change', handler);

    return () => result.removeEventListener('change', handler);
  }, [query]);

  return value;
}
