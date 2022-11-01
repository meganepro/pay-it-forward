import * as fcl from '@onflow/fcl';
import { useCallback, useEffect, useState } from 'react';
import FclUtils from '@/utils/fcl';

export const useTransaction = (): [
  string,
  fcl.TransactionObject | undefined,
  string | null,
  (tranOptions: unknown[]) => Promise<void>,
] => {
  const [tranId, setTranId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Not started');
  const [result, setResult] = useState<fcl.TransactionObject>();

  const startWithOption = async (tranOptions: unknown[]) => {
    setStatus('Resolving...');
    try {
      const { transactionId } = await fcl.send(tranOptions);
      setStatus('Transaction sent, waiting for confirmation');
      setTranId(transactionId);
    } catch (error) {
      // eslint-disable-next-line no-console
      // console.error(error);
      setStatus('Signatures Declined');
    }
  };

  const subscribeTransaction = useCallback(() => {
    let unsub: (() => Promise<unknown>) | null = null;
    if (tranId) {
      try {
        unsub = fcl.tx(tranId).subscribe((currentTransaction) => {
          setResult(currentTransaction);
          console.log(currentTransaction);
          if (FclUtils.isSealed(currentTransaction)) {
            setStatus('Transaction is Sealed');
            if (unsub !== null) {
              void unsub();
            }
          } else if (FclUtils.isExecuted(currentTransaction)) {
            setStatus('Transaction is Executed');
          } else if (FclUtils.isFinalized(currentTransaction)) {
            setStatus('Transaction is Finalized');
          }
          setResult(currentTransaction);
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        setStatus('Transaction failed');
        if (unsub !== null) {
          void unsub();
        }
      }
    }

    return unsub;
  }, [tranId]);

  //   useEffect(() => {
  //     if (!tranId) {
  //       void startWithOption(transactionOptions);
  //     }
  //   }, [tranId, transactionOptions]);

  useEffect(() => {
    const unsub = subscribeTransaction();

    return () => {
      if (unsub !== null) {
        void unsub();
      }
    };
  }, [subscribeTransaction]);

  return [status, result, tranId, startWithOption];
};
