import { useState, useEffect } from 'react';

type Breakpoints = 'base' | 'sm' | 'md' | 'lg' | 'xl';

function useResponsiveValue<T>(values: Partial<Record<Breakpoints, T>>, defaultValue?: T): T | undefined {
  const [value, setValue] = useState<T | undefined>(defaultValue);

  useEffect(() => {
    const calculateValue = () => {
      const screenWidth = window.innerWidth;
      let newValue: T | undefined = values.base ?? defaultValue;

      if (screenWidth >= 640 && values.sm !== undefined) {
        newValue = values.sm;
      }
      if (screenWidth >= 768 && values.md !== undefined) {
        newValue = values.md;
      }
      if (screenWidth >= 1024 && values.lg !== undefined) {
        newValue = values.lg;
      }
      if (screenWidth >= 1280 && values.xl !== undefined) {
        newValue = values.xl;
      }
      setValue(newValue);
    };

    calculateValue();
    window.addEventListener('resize', calculateValue);
    return () => window.removeEventListener('resize', calculateValue);
  }, [values, defaultValue]);

  return value;
}

export default useResponsiveValue;
