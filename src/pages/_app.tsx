import { ChakraProvider } from '@chakra-ui/react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { RecoilRoot } from 'recoil';
import awsExports from '../aws-exports';
import { theme } from '@/styles/themes/extend';

Amplify.configure({ ...awsExports, ssr: false });

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      {/* <link rel="shortcut icon" href="/favicon.png" key="shortcutIcon" />
      <link rel="manifest" href="/manifest.json" /> */}
    </Head>
    <ChakraProvider theme={theme}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </ChakraProvider>
  </>
);

export default App;
