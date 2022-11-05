/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Box } from '@chakra-ui/react';
import * as fcl from '@onflow/fcl';
import React, { FC, useEffect } from 'react';
import { Header } from '@/containers/molecules/header';
import { useWalletLogin } from '@/hooks/fcl/useWalletLogin';

type DefaultLayoutProps = {
  children: React.ReactElement;
};

const DefaultLayout: FC<DefaultLayoutProps> = (props: DefaultLayoutProps) => {
  const { children } = props;
  const [loggedIn, signInOrOut, address] = useWalletLogin();

  useEffect(() => {
    console.log('config load');
    fcl.config({
      'accessNode.api': process.env.FlowAccessNodeApi!,
      'discovery.wallet': process.env.FlowDiscoveryWalletApi!,
      'app.detail.title': 'PayItForward',
      'app.detail.icon':
        'https://assets.website-files.com/5f6294c0c7a8cdd643b1c820/5f6294c0c7a8cd5704b1c939_favicon.png',
    });
  }, []);

  return (
    <>
      <Header loggedIn={loggedIn} signInOrOut={signInOrOut} address={address} />
      <Box as="main" w="70vw" m="0 auto" mt="5vh" mb="5vh">
        {React.cloneElement(children, { loggedInAddress: address })}
      </Box>
    </>
  );
};

export default DefaultLayout;
