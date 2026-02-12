import { type ReactNode, useMemo } from 'react';
import React from 'react';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

export default function EmotionRegistry({ children }: { children: ReactNode }) {
  const cache = useMemo(() => {
    return createCache({ key: 'css', prepend: true });
  }, []);

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
