import { Container, Box, Button, Text } from '@chakra-ui/react';
import * as fcl from '@onflow/fcl';
import React, { FC, MouseEvent, useState } from 'react';
import CodeEditor from '@/components/molecules/editor/CodeEditor';
import JsonViewer from '@/components/molecules/viewer/JsonViewer';

const scriptTemplate = `\
import NonFungibleToken from ${process.env.NonFungibleTokenAddress}
import PayItForward from ${process.env.ContractAddress}

pub fun main(): {String: AnyStruct} {

  // Bob: 0x179b6b1cb6755e31, Charlie: 0xf3fcd2c1a78f5eee
  let addresses: {String: Address} = {
    "alice": 0x01cf0e2f2f715450,
    "bob": 0x179b6b1cb6755e31,
    "charlie": 0xf3fcd2c1a78f5eee
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
}`;

export const RunScript: FC = () => {
  const [data, setData] = useState<string>('');
  const [script, setScript] = useState<string>(scriptTemplate);

  const updateScript = (value: string) => {
    setScript(value);
  };

  const runScript = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await fcl
      .send([fcl.script(script)])
      .then(async (response) => {
        const decodedResponse = await fcl.decode(response);
        setData(decodedResponse);
      })
      .catch((error) => {
        setData(String(error));
      });
  };

  return (
    <Container m={4} maxWidth="3xl">
      <Box p={2}>
        <Text variant="h1">Run Script</Text>
      </Box>
      <Box p={2}>
        <Text variant="h4">Script:</Text>
        <CodeEditor value={script} onChange={(e) => updateScript(e)} />
      </Box>
      <Box p={2}>
        <Button
          onClick={(e) => {
            void runScript(e);
          }}
        >
          Run Script
        </Button>
      </Box>
      <Box p={2}>
        <Text variant="h4">Result:</Text>
        {data !== null && <JsonViewer value={JSON.stringify(data, null, 2)} height="40vh" />}
      </Box>
    </Container>
  );
};

export default RunScript;
