import { Box, HStack, Img, SlideFade, Text, useDisclosure } from '@chakra-ui/react';
import React, { FC, useEffect } from 'react';
import { getActivity } from '@/utils/api';

type HomeProps = {
  loggedInAddress?: string;
};
const Home: FC<HomeProps> = (props) => {
  const { isOpen, onToggle } = useDisclosure();
  const { loggedInAddress: address } = props;

  useEffect(() => {
    if (!isOpen) {
      onToggle();
    }
    // onToggle();
  }, [onToggle, isOpen]);

  useEffect(() => {
    const fetch = async () => {
      if (address) {
        await getActivity([address]).then((response) => {
          console.log(response);
        });
      }
    };
    void fetch();
  }, [address]);

  return (
    <SlideFade
      in={isOpen}
      offsetY="20px"
      delay={1}
      transition={{ enter: { ease: 'easeIn', duration: '1' } }}
    >
      <HStack>
        <Img w="60vw" src="/images/00025.png" shadow="dark-lg" />
        <Box w="3vw" />
        <Box w="40vw">
          <Text>
            The quick brown fox jumps over the lazy dog is an English-language pangram—a sentence
            that contains all of the letters of the English alphabet. Owing to its existence, Chakra
            was created.
          </Text>
        </Box>
      </HStack>
    </SlideFade>
  );
};

export default Home;
