import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import EmotionRegistry from '@/lib/emotion-registry';

import '../../../pokemon-registration/src/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Pokemon Registration Form</title>
      </Head>
      <EmotionRegistry>
        <Component {...pageProps} />
      </EmotionRegistry>
    </>
  );
}
