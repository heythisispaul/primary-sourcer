import {
  FunctionComponent, ReactNode, ReactElement,
} from 'react';
import Head from 'next/head';
import { Flex } from '@chakra-ui/react';
import Header from '../Header';
import Footer from '../Footer';

export interface LayoutProps {
  title?: string;
  children?: ReactNode;
}

const HEADER_HEIGHT = 68;
const FOOTER_HEIGHT = 60;
const delta = HEADER_HEIGHT + FOOTER_HEIGHT + 15;

export const StandardLayout: FunctionComponent<LayoutProps> = ({
  children,
  title = 'Source Tracker',
}) => (
  <>
    <Head>
      <title>{title}</title>
    </Head>
    <Header />
    <Flex justifyContent="center" minH={`calc(100vh - ${delta}px)`}>
      <Flex
        id="layout-container"
        w="100%"
        maxW="1280px"
        as="main"
        justifyContent="center"
      >
        {children}
      </Flex>
    </Flex>
    <Footer />
  </>
);

export const getLayout = (page: ReactElement) => (
  <StandardLayout>{page}</StandardLayout>
);
