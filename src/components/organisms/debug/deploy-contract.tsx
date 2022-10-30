import { Buffer } from 'buffer';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Code, Container, Box, Link, HStack, Text, Button } from '@chakra-ui/react';
import * as fcl from '@onflow/fcl';
// import * as t from '@onflow/types';
import React, { FC, MouseEvent, useState } from 'react';
import CodeEditor from '@/components/molecules/editor/CodeEditor';
import JsonViewer from '@/components/molecules/viewer/JsonViewer';
import { useTransaction } from '@/hooks/fcl/useTransaciton';
import FclUtils from '@/utils/fcl';

const deployTransaction = `\
transaction(code: String) {
  prepare(acct: AuthAccount) {
    acct.contracts.add(name: "HelloWorld", code: code.decodeHex())
  }
}

`;
const removeTransaction = `\
transaction {
  prepare(acct: AuthAccount) {
    acct.contracts.remove(name: "HelloWorld")
  }
}
`;

const simpleContract = `\
pub contract HelloWorld {
  pub let greeting: String
  pub event HelloEvent(message: String)

  init() {
    self.greeting = "Hello, World!"
  }

  pub fun hello(message: String): String {
    emit HelloEvent(message: message)
    return self.greeting
  }
}
`;

const DeployContract: FC = () => {
  const [transactionCode1, setTransactionCode1] = useState(deployTransaction);
  const [transactionCode2, setTransactionCode2] = useState(removeTransaction);
  const [contractCode, setContractCode] = useState(simpleContract);
  const [, setContractName] = useState('HelloWorld');
  const [gas] = useState(999);
  const [status, transactionResult, transactionId, startWithOption] = useTransaction();
  // const [status, setStatus] = useState('Not started');
  // const [transactionResult, setTransactionResult] = useState<fcl.TransactionObject>();

  const updateContractName = (contractName: string) => {
    setContractName(contractName);
    const string1 = `\
transaction(code: String) {
  prepare(acct: AuthAccount) {
    acct.contracts.add(name: "${contractName}", code: code.decodeHex())
  }
}
`;
    const string2 = `\
transaction(code: String) {
  prepare(acct: AuthAccount) {
    acct.contracts.remove(name: "${contractName}")
  }
}
`;
    setTransactionCode1(string1);
    setTransactionCode2(string2);
  };

  const updateContractCode = (value: string) => {
    setContractCode(value);
    const regexResult = value.match(/pub\s+contract\s+(.+?)\s*{/);
    const contractName = regexResult && regexResult.length >= 1 ? regexResult[1] : '';
    updateContractName(contractName);
  };

  const sendTransaction = async (
    event: MouseEvent<HTMLButtonElement>,
    type: 'deploy' | 'remove',
  ) => {
    event.preventDefault();

    const isSealed = false;
    const blockResponse = await fcl.send([fcl.getBlock(isSealed)]);
    const block = await fcl.decode(blockResponse);

    const createTxOptions = (gasValue: number): unknown[] => {
      const txOptions = [
        fcl.transaction(type === 'deploy' ? transactionCode1 : transactionCode2),
        fcl.limit(gasValue),
        fcl.proposer(fcl.currentUser.authorization),
        fcl.authorizations([fcl.currentUser.authorization]),
        fcl.payer(fcl.currentUser.authorization),
        fcl.ref(block.id),
      ];
      if (type === 'deploy') {
        txOptions.push(
          fcl.args([fcl.arg(Buffer.from(contractCode, 'utf8').toString('hex'), FclUtils.String)]),
        );
      }

      return txOptions;
    };

    const txOptions = createTxOptions(gas);
    await startWithOption(txOptions);
  };

  return (
    <Container m={4} maxWidth="3xl">
      <Box p={2}>
        <Text variant="h1">Deploy Contract</Text>
      </Box>
      <Box p={2}>
        <Text variant="h4">Please edit the contract to be deployed.</Text>
        <CodeEditor value={contractCode} onChange={updateContractCode} />
      </Box>
      <Box p={2}>
        <Text variant="h4">Transaction(generated automatically)</Text>
        <HStack>
          <JsonViewer value={transactionCode1} height="230px" width="35vw" />
          <JsonViewer value={transactionCode2} height="230px" width="35vw" />
        </HStack>
      </Box>
      <Box p={2}>
        <HStack mr="10">
          <Button
            type="button"
            onClick={(e) => {
              void sendTransaction(e, 'deploy');
            }}
          >
            Deploy Contract
          </Button>
          <Button
            type="button"
            onClick={(e) => {
              void sendTransaction(e, 'remove');
            }}
          >
            Remove Contract
          </Button>
        </HStack>
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

export default DeployContract;
