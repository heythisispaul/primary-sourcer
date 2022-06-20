/* eslint-disable react/jsx-props-no-spreading */
import { ReactNode, ReactElement } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import theme from '../client/theme';

export type NextPageWithLayout<T = any> = NextPage<T> & {
  // eslint-disable-next-line no-unused-vars
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const queryClient = new QueryClient();
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ChakraProvider theme={theme}>
      <SessionProvider session={pageProps.session}>
        <QueryClientProvider client={queryClient}>
          {getLayout(<Component {...pageProps} />)}
        </QueryClientProvider>
      </SessionProvider>
    </ChakraProvider>
  );
}

export default MyApp;
