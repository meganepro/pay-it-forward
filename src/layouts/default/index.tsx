import { Box } from '@chakra-ui/react';
import * as fcl from '@onflow/fcl';
import { FC, useEffect } from 'react';
import { FiHome, FiStar, FiSettings, FiCpu, FiCreditCard } from 'react-icons/fi';
import { useRecoilState } from 'recoil';
import { Sidebar } from '@/components/molecules/sidebar/Sidebar';
import { Header } from '@/containers/molecules/header';
import networkState from '@/store';

type DefaultLayoutProps = {
  children: React.ReactNode;
};

const DefaultLayout: FC<DefaultLayoutProps> = (props: DefaultLayoutProps) => {
  const { children } = props;
  const [network] = useRecoilState(networkState);

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
  ];

  return (
    <>
      <Header />
      <Sidebar linkItems={linkItems}>
        <Box as="main" w="70vw" m="0 auto">
          {children}
        </Box>
      </Sidebar>
    </>
  );
};

export default DefaultLayout;
