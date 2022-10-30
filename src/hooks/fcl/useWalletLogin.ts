import * as fcl from '@onflow/fcl';
import { CurrentUserObject } from '@onflow/fcl';
import { MouseEvent, useEffect, useState } from 'react';

export const useWalletLogin = (): [
  boolean,
  (event: MouseEvent<HTMLButtonElement>) => Promise<void>,
  string,
] => {
  const [user, setUser] = useState<CurrentUserObject | null>();
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');

  const getUser = async () => {
    const currentUser = await fcl.currentUser.snapshot();
    setUser(currentUser);
  };

  useEffect(() => {
    if (user === null || user === undefined) {
      void getUser();
    } else {
      setLoggedIn(!!user.loggedIn);
      setAddress(user.addr ?? '');
    }
  }, [user]);

  const signInOrOut = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (user && user.loggedIn) {
      fcl.unauthenticate();
      setUser(null);
    } else {
      await fcl.authenticate();
      fcl.currentUser.subscribe((_currentUser: CurrentUserObject) => setUser({ ..._currentUser }));
    }
  };

  return [loggedIn, signInOrOut, address];
};
