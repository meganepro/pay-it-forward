import {
  Box,
  Text,
  HStack,
  VStack,
  Heading,
  Center,
  Divider,
  Tooltip,
  Image,
} from '@chakra-ui/react';
// import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';
import { gravatarUrl } from '@/utils/tools';

const NftCard: FC<Nft> = (props) => {
  const { id, originalNftId, gifter, giftee, context, createdAt } = props;

  return (
    <Box key={id} p={4} shadow="md" borderWidth="1px" mb="1">
      <HStack alignItems="normal">
        <VStack w="10vw">
          <Heading alignSelf="baseline" fontSize="xs">
            Parent ID
          </Heading>
          <Text alignSelf="baseline" mt={4}>
            {originalNftId}
          </Text>
        </VStack>
        <Center height="auto">
          <Divider orientation="vertical" borderColor="blackAlpha.300" ml="1" mr="1" />
        </Center>
        <VStack w="10vw">
          <Heading alignSelf="baseline" fontSize="xs">
            NFT ID
          </Heading>
          <Text alignSelf="baseline" mt={4}>
            {id}
          </Text>
        </VStack>
        <Center height="auto">
          <Divider orientation="vertical" borderColor="blackAlpha.300" ml="1" mr="1" />
        </Center>
        <VStack w="10vw">
          <Heading alignSelf="baseline" fontSize="xs">
            Datetime
          </Heading>
          <Text alignSelf="baseline" mt={4}>
            {new Date(parseInt(createdAt, 10) * 1000).toLocaleDateString()}
          </Text>
        </VStack>
        <Center height="auto">
          <Divider orientation="vertical" borderColor="blackAlpha.300" ml="1" mr="1" />
        </Center>
        <VStack w="20vw">
          <Heading alignSelf="baseline" fontSize="xs">
            Pay It Forward
          </Heading>
          <HStack spacing={2}>
            <Tooltip hasArrow label={gifter} bg="yellow.100" color="yellow.700">
              <Box>
                <Link href={`/${gifter}/info`}>
                  <Box cursor="pointer">
                    <Image src={gravatarUrl(gifter)} minWidth="30px" width="30px" height="30px" />
                  </Box>
                </Link>
              </Box>
            </Tooltip>
            <Text mt={4}>▶</Text>
            {giftee ? (
              <Tooltip hasArrow label={giftee} bg="yellow.100" color="yellow.700">
                <Box>
                  <Link href={`/${giftee}/info`}>
                    <Box cursor="pointer">
                      <Image src={gravatarUrl(giftee)} minWidth="30px" width="30px" height="30px" />
                    </Box>
                  </Link>
                </Box>
              </Tooltip>
            ) : (
              <Box w="30px" />
            )}
          </HStack>
        </VStack>
        <Center height="auto">
          <Divider orientation="vertical" borderColor="blackAlpha.300" ml="1" mr="1" />
        </Center>
        <VStack w="50vw">
          <Heading alignSelf="baseline" fontSize="xs">
            Context
          </Heading>
          <Text alignSelf="baseline" mt={4}>
            {context}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

export default NftCard;
