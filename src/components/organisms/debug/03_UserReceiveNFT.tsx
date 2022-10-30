import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Checkbox, Code, Container, Box, Link, Button, Input, Text } from '@chakra-ui/react';
import * as fcl from '@onflow/fcl';
import React, { ChangeEvent, FC, MouseEvent, useState } from 'react';
import CodeEditor from '@/components/molecules/editor/CodeEditor';
import JsonViewer from '@/components/molecules/viewer/JsonViewer';
import { useTransaction } from '@/hooks/fcl/useTransaciton';

const simpleTransaction = `\
import NonFungibleToken from 0xf8d6e0586b0a20c7
import PayItForward from 0xf8d6e0586b0a20c7

// user(bob)
transaction {
  let gifterCap: Capability<&AnyResource{PayItForward.CollectionPublic}>
  let gifteeRef: &AnyResource{PayItForward.Giftee}
  let context: String
  prepare(user: AuthAccount) {
    //args
    let from: Address = 0xf8d6e0586b0a20c7
    let context = "for test"
    //##################################
    // context
    //##################################
    assert(context.length > 0, message: "Context length must be more than 0.")
    self.context = context
    //##################################
    // Gifter check
    //##################################
    self.gifterCap = getAccount(from).getCapability<&AnyResource{PayItForward.CollectionPublic}>(PayItForward.CollectionPublicPath)
    //##################################
    // Giftee initialize
    //##################################
    // storage path
    if user.borrow<&PayItForward.Collection>(from: PayItForward.CollectionStoragePath) == nil {
      user.save(<- PayItForward.createEmptyCollection(), to: PayItForward.CollectionStoragePath)
    }
    // public path
    if user.getCapability(PayItForward.CollectionPublicPath).borrow<&{PayItForward.CollectionPublic}>() == nil {
      user.link<&{PayItForward.CollectionPublic}>(
        PayItForward.CollectionPublicPath,
        target: PayItForward.CollectionStoragePath
      )
    }
    // private path
    if user.getCapability(PayItForward.CollectionPrivatePath).borrow<&{PayItForward.Giftee}>() == nil {
      // private path
      user.link<&{PayItForward.Giftee}>(
        PayItForward.CollectionPrivatePath,
        target: PayItForward.CollectionStoragePath
      )
    }
    self.gifteeRef = user.getCapability(PayItForward.CollectionPrivatePath).borrow<&{PayItForward.Giftee}>()!
  }
  execute{
    self.gifteeRef.deposit(gifterCapability: self.gifterCap, context: self.context)
  }
}
`;

export const SendTransaction: FC = () => {
  const [transactionCode, setTransactionCode] = useState(simpleTransaction);
  const [gas, setGas] = useState(1000);
  const [authorize, setAuthorize] = useState(true);
  const [status, transactionResult, transactionId, startWithOption] = useTransaction();

  const updateGas = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const intValue = parseInt(event.target.value, 10);
    setGas(intValue);
  };

  const updateTransactionCode = (value: string) => {
    setTransactionCode(value);
  };

  const sendTransaction = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const isSealed = false;
    const blockResponse = await fcl.send([fcl.getBlock(isSealed)]);
    const block = await fcl.decode(blockResponse);

    const createTxOptions = (gasValue: number, isRequiredAuthorized: boolean): unknown[] => {
      const txOptions = [
        fcl.transaction(transactionCode),
        fcl.limit(gasValue),
        fcl.proposer(fcl.currentUser.authorization),
        fcl.payer(fcl.currentUser.authorization),
        fcl.ref(block.id),
      ];
      if (isRequiredAuthorized) {
        txOptions.push(fcl.authorizations([fcl.currentUser.authorization]));
      }

      return txOptions;
    };
    const txOptions = createTxOptions(gas, authorize);
    await startWithOption(txOptions);
  };

  return (
    <Container m={4} maxWidth="3xl">
      <Box p={2}>
        <Text variant="h1">Send Transaction</Text>
      </Box>
      <Box p={2}>
        <Checkbox
          defaultChecked
          checked={authorize}
          onChange={() => {
            setAuthorize(!authorize);
          }}
        >
          Authorization required.
        </Checkbox>
      </Box>
      <Box p={2}>
        <Text variant="h4">Computation Limit:</Text>
        <Input value={gas} onChange={updateGas} size="sm" />
      </Box>
      <Box p={2}>
        <Text variant="h4">Transaction:</Text>
        <CodeEditor value={transactionCode} onChange={updateTransactionCode} />
      </Box>
      <Box p={2}>
        <Button
          type="button"
          onClick={(e) => {
            void sendTransaction(e);
          }}
        >
          Send
        </Button>
      </Box>
      <Box p={2}>
        <Text variant="h4">Result:</Text>
        <Box p={2}>
          <Code w="100%">Status: {status}</Code>
        </Box>
        {transactionId ? (
          <Box p={2}>
            Tx Detail:&nbsp;
            <Link href={`https://flow-view-source.com/testnet/tx/${transactionId}`} isExternal>
              {`https://flow-view-source.com/testnet/tx/${transactionId}`}{' '}
              <ExternalLinkIcon mx="2px" />
            </Link>
          </Box>
        ) : null}
        <JsonViewer value={JSON.stringify(transactionResult, null, 2)} />
      </Box>
    </Container>
  );
};

export default SendTransaction;
