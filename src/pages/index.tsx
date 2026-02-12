import React from 'react';
import { GetServerSideProps } from 'next';

import MainContainer from '@/components/MainContainer';
import RegistrationForm from '@/features/RegistrationForm';
import { getCurrentDateFromAPI } from '@/lib/api/get_current_date_from_api';
import { formatDate } from '@/utils/format_date';

interface HomeProps {
  currentDate: string;
}

export default function Home({ currentDate }: HomeProps) {
  return (
    <MainContainer>
      <RegistrationForm currentDate={currentDate} />
    </MainContainer>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const currentDate = await getCurrentDateFromAPI('Europe/Warsaw');
  return {
    props: {
      currentDate: formatDate(currentDate.dateTime),
    },
  };
};
