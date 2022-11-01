import { Box } from '@chakra-ui/react';
import * as fcl from '@onflow/fcl';
import React, { FC, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { Header } from '@/containers/molecules/header';
import { useWalletLogin } from '@/hooks/fcl/useWalletLogin';
import networkState from '@/store';

type DefaultLayoutProps = {
  children: React.ReactElement;
};

const DefaultLayout: FC<DefaultLayoutProps> = (props: DefaultLayoutProps) => {
  const { children } = props;
  const [network] = useRecoilState(networkState);
  const [loggedIn, signInOrOut, address] = useWalletLogin();

  useEffect(() => {
    console.log('config load');
    fcl.config({
      'accessNode.api':
        // eslint-disable-next-line no-nested-ternary
        network === 'testnet'
          ? 'https://rest-testnet.onflow.org'
          : network === 'mainnet'
          ? 'https://rest-mainnet.onflow.org'
          : 'http://localhost:8888',
      'discovery.wallet':
        // eslint-disable-next-line no-nested-ternary
        network === 'testnet'
          ? 'https://fcl-discovery.onflow.org/testnet/authn'
          : network === 'mainnet'
          ? 'https://fcl-discovery.onflow.org/authn'
          : 'http://localhost:8701/fcl/authn',
      'app.detail.title': 'PayItForward',
      'app.detail.icon':
        'https://assets.website-files.com/5f6294c0c7a8cdd643b1c820/5f6294c0c7a8cd5704b1c939_favicon.png',
    });
  }, [network]);

  return (
    <>
      <Header loggedIn={loggedIn} signInOrOut={signInOrOut} address={address} />
      <Box as="main" w="70vw" m="0 auto" mt="5vh">
        {React.cloneElement(children, { loggedInAddress: address })}
      </Box>
    </>
  );
};

export default DefaultLayout;
