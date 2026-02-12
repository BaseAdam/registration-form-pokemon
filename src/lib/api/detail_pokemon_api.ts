import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface PokemonDetail {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  base_experience: number;
  sprites: { front_default: string };
}

export const detailPokemonApi = createApi({
  reducerPath: 'detailPokemonApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://pokeapi.co/api/v2/',
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: ['PokemonDetail'],
  endpoints: (builder) => ({
    getPokemonDetailById: builder.query<PokemonDetail, number>({
      query: (id) => `pokemon/${id}`,
      keepUnusedDataFor: 3600, // cache for 1 hour
    }),
  }),
});

export const { useGetPokemonDetailByIdQuery } = detailPokemonApi;
