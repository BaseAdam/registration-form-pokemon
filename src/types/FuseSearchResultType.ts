import { PokemonItemSearchType } from './PokemonItemSearchType';

export interface FuseSearchResultType {
  item: PokemonItemSearchType;
  refIndex: number;
  id: number;
  score?: number | undefined;
}
