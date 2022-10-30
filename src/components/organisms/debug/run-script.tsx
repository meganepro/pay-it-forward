import { Container, Box, Text, Button } from '@chakra-ui/react';
import * as fcl from '@onflow/fcl';
import React, { FC, MouseEvent, useState } from 'react';
import CodeEditor from '@/components/molecules/editor/CodeEditor';
import JsonViewer from '@/components/molecules/viewer/JsonViewer';

const scriptOne = `\
pub fun main(): Int {
  return 42 + 6
}
`;

export const RunScript: FC = () => {
  const [data, setData] = useState<string>('');
  const [script, setScript] = useState<string>(scriptOne);

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
