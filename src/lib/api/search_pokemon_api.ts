import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { FuseSearchResultType } from '@/types/FuseSearchResultType';

interface PokemonSearchResponse {
  data: FuseSearchResultType[];
}

export const searchPokemonApi = createApi({
  reducerPath: 'searchPokemonApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: ['Pokemon'],
  endpoints: (builder) => ({
    searchPokemons: builder.query<PokemonSearchResponse, string>({
      query: (name) => ({
        url: 'search',
        params: { name },
      }),
      keepUnusedDataFor: 3600, // cache for 1 hour
    }),
  }),
});

export const { useSearchPokemonsQuery } = searchPokemonApi;
