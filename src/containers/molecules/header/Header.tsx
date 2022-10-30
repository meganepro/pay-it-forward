import { FC } from 'react';
import { Header as HeaderComponents } from '@/components/molecules/header';
import { useWalletLogin } from '@/hooks/fcl/useWalletLogin';

export const Header: FC = () => {
  const [loggedIn, signInOrOut, address] = useWalletLogin();

  return <HeaderComponents loggedIn={loggedIn} signInOrOut={signInOrOut} address={address} />;
};
