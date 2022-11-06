import {
  Box,
  Heading,
  HStack,
  Image,
  Img,
  SlideFade,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import Link from 'next/link';
import React, { FC, useEffect } from 'react';
import NftCard from '@/components/molecules/nft-card/NftCard';
import { useCheckStatus } from '@/hooks/fcl/useCheckStatus';
import { gravatarUrl } from '@/utils/tools';

type UserProps = {
  pathAddress?: string;
  loggedInAddress?: string;
};
const User: FC<UserProps> = (props) => {
  const { isOpen, onToggle } = useDisclosure();
  const [script, data] = useCheckStatus(props.pathAddress ?? '');

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
      <HStack>
        <Box w="40vw">
          <Heading
            letterSpacing="0.15em"
            textShadow="0px 4px 4px rgba(0, 0, 0, 0.10)"
            color="gray"
            fontWeight="thin"
          >
            <HStack>
              <Image
                src={gravatarUrl(props.pathAddress!)}
                minWidth="25px"
                width="25px"
                height="25px"
              />
              {props.pathAddress === props.loggedInAddress ? (
                <Text>Your</Text>
              ) : (
                <Text fontSize="3xl" letterSpacing={0}>{`${props.pathAddress ?? ''}'s`}</Text>
              )}
              <br />
            </HStack>
            Record
          </Heading>
        </Box>
        <Box w="3vw" />
        <SlideFade
          in={isOpen}
          offsetY="20px"
          delay={1}
          transition={{ enter: { ease: 'easeIn', duration: '1' } }}
        >
          <Img w="45vw" src="/images/00029-2.png" shadow="dark-lg" />
        </SlideFade>
      </HStack>
      <Box h="10" />
      <SlideFade
        in={isOpen}
        offsetY="20px"
        delay={1}
        transition={{ enter: { ease: 'easeIn', duration: '2' } }}
      >
        <Box>
          <Heading alignSelf="baseline" fontSize="md" mb="3">
            {props.pathAddress === props.loggedInAddress
              ? 'あなた'
              : `${props.pathAddress ?? ''}さん`}
            が受け取った想い
          </Heading>
        </Box>
        {data.user && data.user.received.length > 0 ? (
          data.user.received.map((nft) => <NftCard key={nft.id} {...nft} />)
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
            {props.pathAddress === props.loggedInAddress
              ? 'あなた'
              : `${props.pathAddress ?? ''}さん`}
            が渡した想い
          </Heading>
        </Box>
        {data.user && data.user.proof.length > 0 ? (
          data.user.proof.map((nft) => <NftCard key={nft.id} {...nft} />)
        ) : (
          <Text>まだ、想いを受け取ってもらっていないようです</Text>
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
            {props.pathAddress === props.loggedInAddress
              ? 'あなた'
              : `${props.pathAddress ?? ''}さん`}
            が渡せる想い
          </Heading>
        </Box>
        {data.user && data.user.toPay.length > 0 ? (
          data.user.toPay.map((nft, index) => {
            if (index === 0) {
              return (
                <Tooltip
                  label={
                    props.pathAddress === props.loggedInAddress
                      ? '受け取ってもらう'
                      : `${nft.gifter}さんから受け取る`
                  }
                  // bg="yellow.100"
                  // color="yellow.700"
                  placement="top-end"
                  key={nft.id}
                >
                  <Box>
                    <Link href={`/${nft.gifter}/receive`}>
                      <Box cursor="pointer" backgroundColor="yellow.50">
                        <NftCard key={nft.id} {...nft} />
                      </Box>
                    </Link>
                  </Box>
                </Tooltip>
              );
            }

            return <NftCard key={nft.id} {...nft} />;
          })
        ) : (
          <Text>まだ、渡せる想いを持っていないようです</Text>
        )}
      </SlideFade>
    </>
  );
};

export default User;
