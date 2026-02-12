import type { NextApiRequest, NextApiResponse } from 'next';

import Fuse from 'fuse.js';

import { FuseSearchResultType } from '@/types/FuseSearchResultType';

import pokemonData from '../../../pokemon.json';

interface SearchResponse {
  data?: FuseSearchResultType[];
  error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<SearchResponse>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name } = req.query;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(200).json({ data: [] });
    }

    const searchTerm = name.trim();

    const fuse = new Fuse(pokemonData.data, {
      keys: ['name'],
      threshold: 0.3,
      includeScore: true,
      minMatchCharLength: 2,
    });

    const searchResults = fuse.search(searchTerm);

    if (searchResults.length === 0) {
      return res.status(404).json({ error: 'No pokemons found' });
    }

    const mappedResults: FuseSearchResultType[] = searchResults.map((result) => ({
      item: result.item,
      refIndex: result.refIndex,
      id: result.item.id,
      score: result.score,
    }));

    return res.status(200).json({ data: mappedResults });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
