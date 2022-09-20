import { useCallback } from 'react';
import { useRouter } from 'next/router';

export const useUrlParamsUpdate = (paramKey: string) => {
  const router = useRouter();

  const setQueryStringKeyValue = useCallback((newValue?: string | null) => {
    if (newValue) {
      router.query[paramKey] = newValue;
    } else {
      delete router.query[paramKey];
    }
    router.push(router, undefined, { shallow: true });
  }, [router, paramKey]);

  return [router.query[paramKey] as string, setQueryStringKeyValue] as const;
};
