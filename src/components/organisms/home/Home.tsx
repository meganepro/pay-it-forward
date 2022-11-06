import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  Img,
  Link,
  LinkBox,
  LinkOverlay,
  SlideFade,
  Spacer,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
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
    <>
      <SlideFade
        in={isOpen}
        offsetY="20px"
        delay={1}
        transition={{ enter: { ease: 'easeIn', duration: '1' } }}
      >
        <VStack spacing={10}>
          <HStack w="80vw">
            <Img w="60vw" src="/images/00025.png" shadow="dark-lg" />
            <Spacer />
          </HStack>
          <Flex w="100%">
            <Spacer />
            <VStack w="50vw" spacing={2} alignItems="baseline">
              <Heading fontSize="2xl">Let&#39;s make the world a better place.</Heading>
              <Text fontSize="small" fontStyle="italic">
                ラスベガスに住むアルコール依存症の母と、家を出て行った家庭内暴力を振るう父との間に生まれた、少年トレバー。
                中学1年生（アメリカでは7年生）になったばかりの彼は、社会科の最初の授業で、担当のシモネット先生と出会う。先生は「もし自分の手で世界を変えたいと思ったら、何をする?」という課題を生徒たちに与える。生徒達のほとんどは、いかにも子供らしいアイディアしか提案できなかったが、トレバーは違った。彼の提案した考えは、「ペイ・フォワード」。自分が受けた善意や思いやりを、その相手に返すのではなく、別の3人に渡すというものだ。
              </Text>
              <Text color="blackAlpha.500" fontSize="2xs">
                「ペイ・フォワード 可能の王国」
                <br />
                『フリー百科事典 ウィキペディア日本語版』2022年9月3日 (土) 16:37 UTC
                <LinkBox>
                  <Link href="https://ja.wikipedia.org/wiki/%E3%83%9A%E3%82%A4%E3%83%BB%E3%83%95%E3%82%A9%E3%83%AF%E3%83%BC%E3%83%89_%E5%8F%AF%E8%83%BD%E3%81%AE%E7%8E%8B%E5%9B%BD">
                    <LinkOverlay>
                      https://ja.wikipedia.org <ExternalLinkIcon mx="2px" />
                    </LinkOverlay>
                  </Link>
                </LinkBox>
              </Text>
            </VStack>
          </Flex>
        </VStack>
      </SlideFade>
      <Box h="5vh" />
      <SlideFade
        in={isOpen}
        offsetY="20px"
        delay={2}
        transition={{ enter: { ease: 'easeIn', duration: '2' } }}
      >
        <VStack spacing={10} alignItems="center">
          <HStack w="70vw" alignItems="center">
            <Img w="70vw" src="/images/00078.png" shadow="dark-lg" />
          </HStack>
          <Text
            textAlign="center"
            fontSize="xl"
            fontWeight="medium"
            textShadow="0px 4px 4px rgba(0, 0, 0, 0.10)"
          >
            世界は少しずつ良くしていくことができる。 <br />
            <br />
            小さなことで良い。
            <br />
            目の前の人に手を差し伸べ、想いをつなごう。
          </Text>
        </VStack>
      </SlideFade>
      <Box h="5vh" />
      <Divider />
    </>
  );
};

export default Home;
