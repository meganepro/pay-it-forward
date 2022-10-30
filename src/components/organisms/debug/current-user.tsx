import { Container, Box, Text } from '@chakra-ui/react';
import * as fcl from '@onflow/fcl';
import React, { useState, useEffect, FC } from 'react';
import JsonViewer from '@/components/molecules/viewer/JsonViewer';

const CurrentUserInfo: FC = () => {
  const [user, setUser] = useState<fcl.CurrentUserObject>();

  useEffect(() => {
    fcl.currentUser.subscribe((currentUser) => setUser({ ...currentUser }));
  }, []);

  return (
    <Container m={4} maxWidth="3xl">
      <Box w="100%" p={2}>
        <Text variant="h1">Current User info</Text>
        <Text variant="h4">Result:</Text>
        <JsonViewer value={JSON.stringify(user, null, 2)} />
      </Box>
    </Container>
  );
};

export default CurrentUserInfo;
