import { Container, Box, Button, Input, Text } from '@chakra-ui/react';
import * as fcl from '@onflow/fcl';
import React, { ChangeEvent, FC, MouseEvent, useState } from 'react';
import JsonViewer from '@/components/molecules/viewer/JsonViewer';

const GetAccountInfo: FC = () => {
  const [data, setData] = useState<string>();
  const [addr, setAddr] = useState<string | null>(null);

  const updateAddr = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setAddr(event.target.value);
  };

  const runGetAccount = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (addr !== null) {
      const response = await fcl.send([fcl.getAccount(addr)]);
      const decodedResponse = await fcl.decode(response);
      setData(JSON.stringify(decodedResponse, null, 2));
    }
  };

  return (
    <Container m={4} maxWidth="3xl">
      <Box p={2}>
        <Text variant="h1">Get Account Information</Text>
      </Box>
      <Box p={2}>
        <Text variant="h4">Address:</Text>
        <Input placeholder="Enter Flow address" onChange={updateAddr} size="md" />
      </Box>
      <Box p={2}>
        <Button
          type="button"
          variant="outline"
          onClick={(e) => {
            void runGetAccount(e);
          }}
          disabled={!addr}
        >
          Check Balance
        </Button>
      </Box>
      <Box p={2}>
        <Text variant="h4">Result:</Text>
        <JsonViewer value={data ?? ''} />
      </Box>
    </Container>
  );
};

export default GetAccountInfo;
