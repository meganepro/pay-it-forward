import {
  Box,
  Center,
  Divider,
  Heading,
  HStack,
  Img,
  SlideFade,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { FC, useEffect } from 'react';
import { useCheckStatus } from '@/hooks/fcl/useCheckStatus';

type UserProps = {
  address?: string;
};
const User: FC<UserProps> = (props) => {
  const { isOpen, onToggle } = useDisclosure();
  const [script, data] = useCheckStatus(props.address ?? '');

  useEffect(() => {
    if (!isOpen) {
      onToggle();
    }
    // onToggle();
  }, [onToggle, isOpen]);

  useEffect(() => {
    void script();
  }, [script]);
  console.log(data);

  return (
    <>
      <SlideFade
        in={isOpen}
        offsetY="20px"
        delay={1}
        transition={{ enter: { ease: 'easeIn', duration: '1' } }}
      >
        <HStack>
          <Box w="40vw">
            <Text>
              The quick brown fox jumps over the lazy dog is an English-language pangram—a sentence
              that contains all of the letters of the English alphabet. Owing to its existence,
              Chakra was created.
            </Text>
          </Box>
          <Box w="3vw" />
          <Img w="60vw" src="/images/00029.png" shadow="dark-lg" />
        </HStack>
      </SlideFade>
      <Box h="10" />
      <SlideFade
        in={isOpen}
        offsetY="20px"
        delay={1}
        transition={{ enter: { ease: 'easeIn', duration: '1' } }}
      >
        <Box>
          <Heading alignSelf="baseline" fontSize="md" mb="3">
            あなたが受け取った想い
          </Heading>
        </Box>
        {data.user ? (
          Object.entries(data.user.received).map(([nftId, value]) => (
            <Box key={nftId} p={4} shadow="md" borderWidth="1px" mb="1">
              <HStack>
                <VStack w="15vw">
                  <Heading alignSelf="baseline" fontSize="xs">
                    NFT ID
                  </Heading>
                  <Text alignSelf="baseline" mt={4}>
                    {nftId}
                  </Text>
                </VStack>
                <Center height="7vh">
                  <Divider orientation="vertical" borderColor="blackAlpha.300" ml="1" mr="1" />
                </Center>
                <VStack w="15vw">
                  <Heading alignSelf="baseline" fontSize="xs">
                    Original NFT ID
                  </Heading>
                  <Text alignSelf="baseline" mt={4}>
                    {value}
                  </Text>
                </VStack>
                <Center height="7vh">
                  <Divider orientation="vertical" borderColor="blackAlpha.300" ml="1" mr="1" />
                </Center>
                {/* <VStack w="50vw">
                  <Heading alignSelf="baseline" fontSize="xs">
                    Context
                  </Heading>
                  <Text alignSelf="baseline" mt={4}>
                    {value.context}
                  </Text>
                </VStack> */}
              </HStack>
            </Box>
          ))
        ) : (
          <Text>まだ、想いを受け取ってないようです</Text>
        )}
      </SlideFade>
      <Box h="10" />
      <SlideFade
        in={isOpen}
        offsetY="20px"
        delay={1}
        transition={{ enter: { ease: 'easeIn', duration: '1' } }}
      >
        <Box>
          <Heading alignSelf="baseline" fontSize="md" mb="3">
            あなたが渡せる想い
          </Heading>
        </Box>
        {data.user ? (
          Object.entries(data.user.toPays).map(([nftId, value]) => (
            <Box key={nftId} p={4} shadow="md" borderWidth="1px" mb="1">
              <HStack>
                <VStack w="15vw">
                  <Heading alignSelf="baseline" fontSize="xs">
                    NFT ID
                  </Heading>
                  <Text alignSelf="baseline" mt={4}>
                    {nftId}
                  </Text>
                </VStack>
                <Center height="7vh">
                  <Divider orientation="vertical" borderColor="blackAlpha.300" ml="1" mr="1" />
                </Center>
                <VStack w="15vw">
                  <Heading alignSelf="baseline" fontSize="xs">
                    Original NFT ID
                  </Heading>
                  <Text alignSelf="baseline" mt={4}>
                    {value.oriId}
                  </Text>
                </VStack>
                <Center height="7vh">
                  <Divider orientation="vertical" borderColor="blackAlpha.300" ml="1" mr="1" />
                </Center>
                <VStack w="50vw">
                  <Heading alignSelf="baseline" fontSize="xs">
                    Context
                  </Heading>
                  <Text alignSelf="baseline" mt={4}>
                    {value.context}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          ))
        ) : (
          <Text>まだ、想いを受け取ってないようです</Text>
        )}
      </SlideFade>
    </>
  );
};

export default User;