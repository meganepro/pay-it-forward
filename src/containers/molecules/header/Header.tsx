import { FC, MouseEvent } from 'react';
import { Header as HeaderComponents } from '@/components/molecules/header';

type HeaderProps = {
  loggedIn: boolean;
  signInOrOut: (event: MouseEvent<HTMLButtonElement>) => Promise<void>;
  address: string;
};
export const Header: FC<HeaderProps> = (props) => {
  const { loggedIn, signInOrOut, address } = props;

  return <HeaderComponents loggedIn={loggedIn} signInOrOut={signInOrOut} address={address} />;
};
