import { ExternalLinkIcon } from '@chakra-ui/icons';
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
  Link as ChakraLink,
  LinkBox,
  Spacer,
} from '@chakra-ui/react';
// import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';
import { gravatarUrl } from '@/utils/tools';

const TransactionResultCard: FC<Transaction> = (props) => {
  const { fromAddress, toAddress, fromNftId, toNftId, context, timestamp, transactionId } = props;

  return (
    <Box key={toNftId} p={4} shadow="md" borderWidth="1px" mb="1" minW="70vw">
      <HStack alignItems="normal" fontSize="xs">
        <VStack w="7vw">
          <Spacer />
          <LinkBox>
            <ChakraLink href={`${process.env.FlowScanUrl}/${transactionId}`} isExternal>
              <HStack>
                <Image src="/images/flow.png" minWidth="30px" width="30px" height="30px" />
                <ExternalLinkIcon mx="2px" />
              </HStack>
            </ChakraLink>
          </LinkBox>
          <Spacer />
        </VStack>
        <Center height="auto">
          <Divider orientation="vertical" borderColor="blackAlpha.300" ml="1" mr="1" />
        </Center>
        <VStack w="10vw">
          <Heading alignSelf="baseline" fontSize="xs">
            Parent ID
          </Heading>
          <Text alignSelf="baseline" mt={4}>
            {fromNftId}
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
            {toNftId}
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
            {new Date(timestamp * 1000).toLocaleDateString()}
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
            <Tooltip hasArrow label={fromAddress} bg="yellow.100" color="yellow.700">
              <Box>
                <Link href={`/${fromAddress}/info`}>
                  <Box cursor="pointer">
                    <Image
                      src={gravatarUrl(fromAddress)}
                      minWidth="30px"
                      width="30px"
                      height="30px"
                    />
                  </Box>
                </Link>
              </Box>
            </Tooltip>
            <Text mt={4}>▶</Text>
            <Tooltip hasArrow label={toAddress} bg="yellow.100" color="yellow.700">
              <Box>
                <Link href={`/${toAddress}/info`}>
                  <Box cursor="pointer">
                    <Image
                      src={gravatarUrl(toAddress)}
                      minWidth="30px"
                      width="30px"
                      height="30px"
                    />
                  </Box>
                </Link>
              </Box>
            </Tooltip>
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

export default TransactionResultCard;
