import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';

import styled from '@emotion/styled';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import {
  POKEMON_NAME_ERROR_MESSAGE,
  TRAINER_AGE_ERROR_MESSAGE,
  TRAINER_NAME_ERROR_MESSAGE,
} from '@/constants/error_messages';
import { SuccessModal } from '@/features/SuccessModal';
import { useGetPokemonDetailByIdQuery } from '@/lib/api/detail_pokemon_api';
import { useSearchPokemonsQuery } from '@/lib/api/search_pokemon_api';
import { breakpoints } from '@/utils/breakpoints';
import { convertToUpperCase } from '@/utils/convert_to_upper_case';

import AutocompleteInput, { AutocompleteOption } from '../components/AutocompleteInput';

interface RegistrationFormProps {
  currentDate: string;
}

interface FormData {
  trainerName: string;
  trainerAge: number | null;
  pokemonName: string;
}

const validationSchema = yup.object({
  trainerName: yup
    .string()
    .required(TRAINER_NAME_ERROR_MESSAGE)
    .min(2, TRAINER_NAME_ERROR_MESSAGE)
    .max(20, TRAINER_NAME_ERROR_MESSAGE),
  trainerAge: yup
    .number()
    .transform((value, originalValue) => {
      // Transform empty string or non-numeric strings to null
      if (originalValue === '' || isNaN(originalValue)) {
        return null;
      }
      return Number(originalValue);
    })
    .required(TRAINER_AGE_ERROR_MESSAGE)
    .min(16, TRAINER_AGE_ERROR_MESSAGE)
    .max(99, TRAINER_AGE_ERROR_MESSAGE)
    .nullable(),
  pokemonName: yup.string().required(POKEMON_NAME_ERROR_MESSAGE),
});

export default function RegistrationForm({ currentDate }: RegistrationFormProps) {
  const [selectedPokemon, setSelectedPokemon] = useState<{ name: string; id: number } | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      trainerName: '',
      trainerAge: null,
      pokemonName: '',
    },
  });

  const pokemonName = watch('pokemonName');

  const {
    data: pokemonData,
    isLoading: isLoadingSearch,
    error: searchError,
  } = useSearchPokemonsQuery(debouncedSearchTerm, {
    skip: !debouncedSearchTerm.trim(),
  });

  const pokemonOptions: AutocompleteOption[] = useMemo(() => {
    if (!debouncedSearchTerm.trim() || searchError || !pokemonData?.data) {
      return [];
    }

    return pokemonData.data.map((result) => ({
      value: result.item.name,
      label: convertToUpperCase(result.item.name),
      id: result.item.id,
    }));
  }, [pokemonData?.data, debouncedSearchTerm, searchError]);

  useEffect(() => {
    if (pokemonName?.trim()) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        setDebouncedSearchTerm(pokemonName.trim());
      }, 300); // 300ms debounce

      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    } else {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      setDebouncedSearchTerm('');
    }
  }, [pokemonName]);

  const { data: pokemonDetail, isLoading: isLoadingDetail } = useGetPokemonDetailByIdQuery(
    selectedPokemon?.id ?? -1,
    {
      skip: !selectedPokemon?.id,
    }
  );

  const handlers = {
    pokemonSelect: (option: { value: string; label: string; id: number }) => {
      setValue('pokemonName', option.value, { shouldValidate: true });
      setSelectedPokemon({ name: option.value, id: option.id });
    },
    pokemonChange: (value: string) => {
      setValue('pokemonName', value, { shouldValidate: true });
      if (!value) {
        setSelectedPokemon(null);
      }
    },
    onSubmit: () => {
      setIsSuccessModalOpen(true);
    },
    resetForm: () => {
      reset();
      setSelectedPokemon(null);
      setIsSuccessModalOpen(false);
    },
  };

  return (
    <>
      <FormContainer>
        <DateDisplay>{currentDate}</DateDisplay>
        <Form onSubmit={handleSubmit(handlers.onSubmit)}>
          <TwoColumnGrid>
            <Input
              id="trainerName"
              type="text"
              label="Trainer's name"
              placeholder="Trainer's name"
              {...register('trainerName')}
              error={!!errors.trainerName}
              errorMessage={errors.trainerName?.message}
            />

            <Input
              id="trainerAge"
              type="number"
              label="Trainer's age"
              placeholder="Trainer's age"
              min="1"
              {...register('trainerAge')}
              error={!!errors.trainerAge}
              errorMessage={errors.trainerAge?.message}
            />
          </TwoColumnGrid>

          <AutocompleteInput
            value={pokemonName || ''}
            onChange={handlers.pokemonChange}
            onSelect={handlers.pokemonSelect}
            placeholder="Choose"
            label="Pokemon name"
            error={!!errors.pokemonName}
            errorMessage={errors.pokemonName?.message}
            options={pokemonOptions}
            isLoading={isLoadingSearch}
            queryError={searchError}
          />

          <PokemonDisplayArea>
            {!selectedPokemon ? (
              <PlaceholderText>Your pokemon</PlaceholderText>
            ) : isLoadingDetail ? (
              <PlaceholderText>Loading pokemon details...</PlaceholderText>
            ) : pokemonDetail ? (
              <PokemonDisplayContent>
                <PokemonSprite>
                  <Image
                    src={pokemonDetail.sprites?.front_default}
                    alt={pokemonDetail.name}
                    width={194}
                    height={196}
                  />
                </PokemonSprite>
                <PokemonInfoContainer>
                  <PokemonName>Name: {convertToUpperCase(pokemonDetail.name ?? '')}</PokemonName>
                  <PokemonInfo>
                    Type:{' '}
                    {pokemonDetail.types?.map(({ type }, index) => (
                      <Label key={index}>{convertToUpperCase(type.name)}</Label>
                    ))}
                  </PokemonInfo>
                  <PokemonInfo>Base experience: {pokemonDetail.base_experience}</PokemonInfo>
                  <PokemonInfo>Id: {pokemonDetail.id}</PokemonInfo>
                </PokemonInfoContainer>
              </PokemonDisplayContent>
            ) : (
              <PlaceholderText>Your pokemon</PlaceholderText>
            )}
          </PokemonDisplayArea>

          <ButtonContainer>
            <Button type="button" variant="soft" onClick={handlers.resetForm}>
              Reset
            </Button>
            <Button type="submit" variant="primary">
              Submit
            </Button>
          </ButtonContainer>
        </Form>
      </FormContainer>
      <SuccessModal isOpen={isSuccessModalOpen} onReset={handlers.resetForm} />
    </>
  );
}

const FormContainer = styled.div`
  background: #ffffff;
  display: flex;
  flex-direction: column;
  border: var(--colors-grey-400) 1px solid;
  border-radius: 2px;
  padding: 31px;
  gap: 24px;
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  min-height: 614px;
  box-sizing: border-box;
`;

const DateDisplay = styled.div`
  text-align: right;
  align-self: flex-end;
  width: 100%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
`;

const PokemonDisplayArea = styled.div`
  width: 100%;
  min-height: 254px;
  border: var(--colors-grey-400) 1px solid;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlaceholderText = styled.p`
  color: var(--colors-grey-200);
`;

const PokemonDisplayContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 10px;
  width: 100%;

  @media (min-width: ${breakpoints.xs}) {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 24px;
  }
`;

const PokemonSprite = styled.div`
  flex-shrink: 0;

  @media (min-width: ${breakpoints.sm}) {
    width: 194px;
    height: 196px;
  }
`;

const PokemonInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;

  @media (min-width: ${breakpoints.xs}) {
    align-items: flex-start;
  }
`;

const PokemonName = styled.div`
  font-size: 14px;
  color: var(--colors-grey-100);
  margin: 0;
`;

const PokemonInfo = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  gap: 8px;
  flex-wrap: wrap;
`;
const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;

  @media (min-width: ${breakpoints.xs}) {
    justify-content: flex-end;
  }
`;
