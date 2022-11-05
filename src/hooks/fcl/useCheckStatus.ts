/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as fcl from '@onflow/fcl';
import { useCallback, useState } from 'react';

const getCheckScript = (address: string) => `\
import NonFungibleToken from ${process.env.NonFungibleTokenAddress!}
import PayItForward from ${process.env.ContractAddress!}

pub fun main(): {String: AnyStruct} {

    let addresses: {String: Address} = {
      "user": ${address}
    }

    let res: {String: AnyStruct} = {}
    for name in addresses.keys {
      // collection -> item & nft
      let collectionRef = getAccount(addresses[name]!).getCapability(PayItForward.CollectionPublicPath)
      .borrow<&AnyResource{PayItForward.CollectionPublic, PayItForward.Gifter}>()
      if(collectionRef == nil){
        continue
      }
      // toPay
      let toPays = collectionRef!.borrowToPays()
      let toPayNfts: [AnyStruct] = []
      var count = toPays.length
      while count > 0 {
        let nft = toPays.removeFirst()
        toPayNfts.append({
          "id": nft.id,
          "originalNftId": nft.originalNftId,
          "context": nft.context,
          "createdAt": nft.timestamp,
          "gifter": nft.from,
          "giftee": ""
        })
        count = count - 1
      }

      // received
      let receivedIds = collectionRef!.getReceivedOriginalIds()
      let receivedNfts: [AnyStruct] = []
      for receivedId in receivedIds {
        let nft = collectionRef!.borrowReceiveds(originalId: receivedId)
        receivedNfts.append({
          "id": nft.id,
          "originalNftId": nft.originalNftId,
          "context": nft.context,
          "createdAt": nft.timestamp,
          "gifter": nft.from,
          "giftee": nft.owner!.address
        })
      }

      // proof
      let proofs: {UInt64: PayItForward.ProofData} = collectionRef!.proof
      let proofNfts: [AnyStruct] = []
      for proofId in proofs.keys {
        let proofData = proofs[proofId]!
        let collectionRef = getAccount(proofData.address).getCapability(PayItForward.CollectionPublicPath)
      .borrow<&AnyResource{PayItForward.CollectionPublic}>()!
        let nft = collectionRef!.borrowReceiveds(originalId: proofData.originalNftId)
        proofNfts.append({
          "id": nft.id,
          "originalNftId": nft.originalNftId,
          "context": nft.context,
          "createdAt": nft.timestamp,
          "gifter": nft.from,
          "giftee": nft.owner!.address
        })
      }
      // syu-kei
      res[name] = {
        "received": receivedNfts,
        "toPay": toPayNfts,
        "proof": proofNfts
      }
    }
    res["total"] = {"totalSupply": PayItForward.totalSupply}
    return res
}
`;

type CheckType = {
  total?: { totalSupply: string };
  user?: {
    received: Nft[];
    toPay: Nft[];
    proof: Nft[];
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
