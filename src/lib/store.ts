import { configureStore } from '@reduxjs/toolkit';

import { searchPokemonApi } from './api/search_pokemon_api';

export const store = configureStore({
  reducer: {
    [searchPokemonApi.reducerPath]: searchPokemonApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(searchPokemonApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
