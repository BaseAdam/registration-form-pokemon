import { configureStore } from '@reduxjs/toolkit';

import { detailPokemonApi } from './api/detail_pokemon_api';
import { searchPokemonApi } from './api/search_pokemon_api';

export const store = configureStore({
  reducer: {
    [searchPokemonApi.reducerPath]: searchPokemonApi.reducer,
    [detailPokemonApi.reducerPath]: detailPokemonApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(searchPokemonApi.middleware, detailPokemonApi.middleware),
});
