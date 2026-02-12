import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';

import { render, RenderOptions } from '@testing-library/react';

import EmotionRegistry from '@/lib/emotion-registry';
import { store } from '@/lib/store';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <EmotionRegistry>
      <Provider store={store}>{children}</Provider>
    </EmotionRegistry>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
