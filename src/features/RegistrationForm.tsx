import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import styled from '@emotion/styled';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import {
  POKEMON_NAME_ERROR_MESSAGE,
  TRAINER_AGE_ERROR_MESSAGE,
  TRAINER_NAME_ERROR_MESSAGE,
} from '@/constants/error_messages';
import { breakpoints } from '@/utils/breakpoints';

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      trainerName: '',
      trainerAge: null,
      pokemonName: '',
    },
  });

  const handlers = {
    onSubmit: () => {
    },
    resetForm: () => {
      reset();
      setSelectedPokemon(null);
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
            <div>{selectedPokemon?.name}</div>
          </TwoColumnGrid>
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

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;

  @media (min-width: ${breakpoints.xs}) {
    justify-content: flex-end;
  }
`;
