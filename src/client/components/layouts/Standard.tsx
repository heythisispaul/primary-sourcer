import {
  FunctionComponent, ReactNode, ReactElement,
} from 'react';
import Head from 'next/head';
import { Flex, Box } from '@chakra-ui/react';
import Header from '../Header';

export interface LayoutProps {
  title?: string;
  children?: ReactNode;
}

export const StandardLayout: FunctionComponent<LayoutProps> = ({
  children,
  title = 'Source Tracker',
}) => (
  <>
    <Head>
      <title>{title}</title>
    </Head>
    <Header />
    <Flex justifyContent="center">
      <Box id="layout-container" w="100%" maxW="1920px" as="main">
        {children}
      </Box>
    </Flex>
  </>
);

export const getLayout = (page: ReactElement) => (
  <StandardLayout>{page}</StandardLayout>
);
