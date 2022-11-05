/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CheckCircleIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Img,
  Input,
  LinkBox,
  LinkOverlay,
  SlideFade,
  Spacer,
  Text,
  useDisclosure,
  VStack,
  Link,
} from '@chakra-ui/react';
import * as fcl from '@onflow/fcl';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { QRCode } from 'react-qrcode-logo';
import { useTransaction } from '@/hooks/fcl/useTransaciton';
import FclUtils from '@/utils/fcl';

const simpleTransaction = `\
import NonFungibleToken from ${process.env.NonFungibleTokenAddress!}
import PayItForward from ${process.env.ContractAddress!}

// user(bob)
transaction(from: Address, context: String) {
  let gifterCap: Capability<&AnyResource{PayItForward.Gifter}>
  let gifteeRef: &AnyResource{PayItForward.Giftee}
  let context: String
  prepare(user: AuthAccount) {
    //args
    let from: Address = from
    let context = context
    //##################################
    // context
    //##################################
    assert(context.length > 0, message: "Context length must be more than 0.")
    self.context = context
    //##################################
    // Gifter check
    //##################################
    self.gifterCap = getAccount(from).getCapability<&AnyResource{PayItForward.Gifter}>(PayItForward.CollectionPublicPath)
    //##################################
    // Giftee initialize
    //##################################
    // storage path
    if user.borrow<&PayItForward.Collection>(from: PayItForward.CollectionStoragePath) == nil {
      user.save(<- PayItForward.createEmptyCollection(), to: PayItForward.CollectionStoragePath)
    }
    // public path
    if user.getCapability(PayItForward.CollectionPublicPath).borrow<&{PayItForward.CollectionPublic, PayItForward.Gifter}>() == nil {
      //user.unlink(PayItForward.CollectionPublicPath)
      user.link<&{PayItForward.CollectionPublic, PayItForward.Gifter}>(
        PayItForward.CollectionPublicPath,
        target: PayItForward.CollectionStoragePath
      )
    }
    // private path
    if user.getCapability(PayItForward.CollectionPrivatePath).borrow<&{PayItForward.Giftee}>() == nil {
      // private path
      user.link<&{PayItForward.Giftee}>(
        PayItForward.CollectionPrivatePath,
        target: PayItForward.CollectionStoragePath
      )
    }
    self.gifteeRef = user.getCapability(PayItForward.CollectionPrivatePath).borrow<&{PayItForward.Giftee}>()!
  }
  execute{
    self.gifteeRef.deposit(gifterCapability: self.gifterCap, context: self.context)
  }
}
`;

type ReceiveProps = {
  pathAddress?: string;
  loggedInAddress?: string;
};

const Receive: FC<ReceiveProps> = (props) => {
  const { isOpen, onToggle } = useDisclosure();
  const [context, setContext] = useState<string>('');

  const [gas, setGas] = useState(1000);
  const [status, transactionResult, transactionId, startWithOption] = useTransaction();

  const sendTransaction = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const isSealed = false;
    const blockResponse = await fcl.send([fcl.getBlock(isSealed)]);
    const block = await fcl.decode(blockResponse);

    const createTxOptions = (gasValue: number): unknown[] => {
      const txOptions = [
        fcl.transaction(simpleTransaction),
        fcl.args([fcl.arg(props.pathAddress, FclUtils.Address), fcl.arg(context, FclUtils.String)]),
        fcl.limit(gasValue),
        fcl.proposer(fcl.currentUser.authorization),
        fcl.payer(fcl.currentUser.authorization),
        fcl.ref(block.id),
      ];
      txOptions.push(fcl.authorizations([fcl.currentUser.authorization]));

      return txOptions;
    };
    const txOptions = createTxOptions(gas);
    await startWithOption(txOptions);
  };

  useEffect(() => {
    if (!isOpen) {
      onToggle();
    }
    // onToggle();
  }, [onToggle, isOpen]);

  useEffect(() => {
    if (transactionResult && transactionResult?.status >= 4) {
      setContext('');
    }
  }, [transactionResult]);

  return (
    <>
      <SlideFade
        in={isOpen}
        offsetY="20px"
        delay={0}
        transition={{ enter: { ease: 'easeIn', duration: '1' } }}
      >
        <Box p={5} shadow="md" borderWidth="1px" mb="1">
          {props.loggedInAddress !== props.pathAddress ? (
            <HStack mb="5">
              <Box w="40vw">
                <Text alignSelf="baseline" pl="5" mt={4}>
                  {props.pathAddress}さんからの
                  <br />
                  気持ちを次につなげてください。
                </Text>
              </Box>
              <Spacer />
              <VStack w="40vw">
                <Heading alignSelf="baseline" fontSize="xs">
                  何をしてもらいましたか？
                </Heading>
                <Input
                  placeholder="道を教えてもらった。"
                  onChange={(e) => {
                    setContext(e.target.value);
                  }}
                  value={context}
                />
                <Spacer />
                <Heading alignSelf="baseline" fontSize="xs">
                  気持ちを受け取り、次につなげますか？
                </Heading>
                <Button
                  w="100%"
                  disabled={!context}
                  variant="solid"
                  colorScheme="yellow"
                  size="md"
                  type="button"
                  onClick={(e) => {
                    void sendTransaction(e);
                  }}
                >
                  はい、つなげます
                </Button>
              </VStack>
            </HStack>
          ) : (
            <HStack mb="2">
              <Box w="40vw">
                <Text alignSelf="baseline" pl="5" mt={4}>
                  困った人を助け、
                  <br />
                  思いを紡ぎ
                  <br />
                  世界を少し良くしましょう。
                </Text>
              </Box>
              <Spacer />
              <VStack w="40vw">
                <QRCode
                  value={window.location.href}
                  bgColor="white"
                  fgColor="lightSeaGreen"
                  logoImage="/images/flow2.png"
                  removeQrCodeBehindLogo
                  qrStyle="dots"
                  size={192}
                />
                ,
              </VStack>
            </HStack>
          )}
          {transactionId ? (
            <>
              <Divider />
              <VStack alignItems="baseline" color="darkgray">
                <HStack minH="7vh">
                  <Heading minW="20vw" w="20vw" fontSize="xs">
                    TRANSACTION ID
                  </Heading>
                  {transactionResult?.events[0]?.transactionId ? (
                    <LinkBox>
                      <Link
                        href={`${process.env.FlowScanUrl}/${transactionResult?.events[0].transactionId}`}
                        isExternal
                      >
                        <LinkOverlay>
                          <Text overflowWrap="anywhere">
                            {transactionResult?.events[0].transactionId}
                            <ExternalLinkIcon mx="2px" />
                          </Text>
                        </LinkOverlay>
                      </Link>
                    </LinkBox>
                  ) : null}
                </HStack>
                <Divider borderColor="blackAlpha.300" />
                <HStack minH="7vh">
                  <Heading minW="20vw" w="20vw" fontSize="xs">
                    STATUS
                  </Heading>
                  <Text overflowWrap="anywhere">{status}</Text>
                </HStack>
                {transactionResult?.errorMessage ? (
                  <>
                    <Divider borderColor="blackAlpha.300" />
                    <HStack minH="7vh">
                      <Heading minW="20vw" w="20vw" fontSize="xs">
                        ERROR MESSAGE
                      </Heading>
                      <Text overflowWrap="anywhere" fontSize="small" color="red.500">
                        {transactionResult?.errorMessage.split('\n').slice(0, 10)}
                      </Text>
                    </HStack>
                  </>
                ) : null}
                {transactionResult?.status === 4 && transactionResult?.statusCode === 0 ? (
                  <>
                    <Divider borderColor="blackAlpha.300" />
                    <HStack minH="7vh">
                      <Heading minW="20vw" w="20vw" fontSize="xs">
                        MESSAGE
                      </Heading>
                      <Text overflowWrap="anywhere" fontSize="small" color="green.500">
                        Transaction SEALED Successfully <CheckCircleIcon />
                      </Text>
                    </HStack>
                  </>
                ) : null}
              </VStack>
            </>
          ) : null}
        </Box>
        {props.loggedInAddress === props.pathAddress ? (
          <Text textAlign="right" fontSize="small">
            ※このページのURLもしくはQRコードを助けた人に送りましょう。
          </Text>
        ) : null}
      </SlideFade>
      <Box h="5" />
      <SlideFade
        in={isOpen}
        offsetY="20px"
        delay={1}
        transition={{ enter: { ease: 'easeIn', duration: '2' } }}
      >
        <HStack>
          <Img src="/images/00022.png" shadow="dark-lg" />
        </HStack>
      </SlideFade>
    </>
  );
};

export default Receive;
