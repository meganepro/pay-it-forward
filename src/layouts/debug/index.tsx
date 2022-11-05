/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Box } from '@chakra-ui/react';
import * as fcl from '@onflow/fcl';
import React, { FC, useEffect } from 'react';
import { FiHome, FiStar, FiSettings, FiCpu, FiCreditCard } from 'react-icons/fi';
import { useRecoilState } from 'recoil';
import { Sidebar } from '@/components/molecules/sidebar/Sidebar';
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
      'accessNode.api': process.env.FlowAccessNodeApi!,
      'discovery.wallet': process.env.FlowDiscoveryWalletApi!,
      'app.detail.title': 'PayItForward',
      'app.detail.icon':
        'https://assets.website-files.com/5f6294c0c7a8cdd643b1c820/5f6294c0c7a8cd5704b1c939_favicon.png',
    });
  }, [network]);

  const linkItems = [
    { name: 'Home', icon: FiHome, linkTo: '/' },
    { name: 'Debug(CurrentUser)', icon: FiStar, linkTo: '/debug/current-user' },
    {
      name: 'Debug(GetAccount)',
      icon: FiSettings,
      linkTo: '/debug/get-account',
    },
    { name: 'Debug(RunScript)', icon: FiCpu, linkTo: '/debug/run-script' },
    {
      name: 'Debug(SendTransaction)',
      icon: FiCreditCard,
      linkTo: '/debug/send-transaction',
    },
    {
      name: 'Debug(deployContract)',
      icon: FiCreditCard,
      linkTo: '/debug/deploy-contract',
    },
    {
      name: 'Debug(01_AgentInitialize)',
      icon: FiCreditCard,
      linkTo: '/debug/01_AgentInitialize',
    },
    {
      name: 'Debug(02_AgentMintToSelf)',
      icon: FiCreditCard,
      linkTo: '/debug/02_AgentMintToSelf',
    },
    {
      name: 'Debug(03_UserReceiveNFT)',
      icon: FiCreditCard,
      linkTo: '/debug/03_UserReceiveNFT',
    },
    {
      name: 'Debug(06_Check)',
      icon: FiCreditCard,
      linkTo: '/debug/06_Check',
    },
  ];

  return (
    <>
      <Header loggedIn={loggedIn} signInOrOut={signInOrOut} address={address} />
      <Sidebar linkItems={linkItems}>
        <Box as="main" w="70vw" m="0 auto">
          {React.cloneElement(children, { loggedInAddress: address })}
        </Box>
      </Sidebar>
    </>
  );
};

export default DefaultLayout;
