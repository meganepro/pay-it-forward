/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as fcl from '@onflow/fcl';
import { useCallback, useState } from 'react';

const getCheckScript = (address: string) => `\
import NonFungibleToken from ${process.env.ContractAddress!}
import PayItForward from ${process.env.ContractAddress!}

pub fun main(): {String: AnyStruct} {

    // Bob: 0x179b6b1cb6755e31, Charlie: 0xf3fcd2c1a78f5eee
    let addresses: {String: Address} = {
      "user": ${address}
    }

    let res: {String: AnyStruct} = {}
    for name in addresses.keys {
      // collection -> item & nft
      let collectionRef = getAccount(addresses[name]!).getCapability(PayItForward.CollectionPublicPath)
      .borrow<&AnyResource{PayItForward.CollectionPublic}>()
      if(collectionRef == nil){
        continue
      }
      // toPay
      let toPays = collectionRef!.borrowToPays()
      let nfts: {UInt64: AnyStruct} = {}
      var count = toPays.length
      while count > 0 {
        let nft = toPays.removeFirst()
        nfts[nft.id] = {"oriId": nft.originalNftId, "context": nft.context}
        count = count - 1
      }

      // received
      let receiveds: {UInt64: AnyStruct} = {}
      let receivedIds = collectionRef!.getReceivedOriginalIds()
      for receivedId in receivedIds {
        let nftRef = collectionRef!.borrowReceiveds(originalId: receivedId)
        receiveds[nftRef.id] = nftRef.originalNftId
      }

      // syu-kei
      res[name] = {
        "received": receiveds,
        "toPays": nfts
      }
    }
    res["total"] = {"totalSupply": PayItForward.totalSupply}
    return res
}
`;

type CheckType = {
  total?: { totalSupply: string };
  user?: {
    received: { [key in number]: string };
    toPays: {
      [key in number]: {
        oriId: string;
        context: string;
      };
    };
  };
  error?: string;
};

export const useCheckStatus = (address: string): [() => Promise<void>, CheckType] => {
  const [data, setData] = useState<CheckType>({
    total: undefined,
    user: undefined,
    error: undefined,
  });
  const runScript = useCallback(async () => {
    await fcl
      .send([fcl.script(getCheckScript(address))])
      .then(async (response) => {
        const decodedResponse = await fcl.decode(response);
        setData(decodedResponse);
      })
      .catch((error) => {
        setData({ ...error });
      });
  }, [address]);

  return [runScript, data];
};

export default useCheckStatus;
