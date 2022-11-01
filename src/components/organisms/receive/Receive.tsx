/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Box,
  Button,
  Heading,
  HStack,
  Img,
  Input,
  SlideFade,
  Spacer,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import * as fcl from '@onflow/fcl';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { useTransaction } from '@/hooks/fcl/useTransaciton';
import FclUtils from '@/utils/fcl';

const simpleTransaction = `\
import NonFungibleToken from ${process.env.ContractAddress!}
import PayItForward from ${process.env.ContractAddress!}

// user(bob)
transaction(from: Address, context: String) {
  let gifterCap: Capability<&AnyResource{PayItForward.CollectionPublic}>
  let gifteeRef: &AnyResource{PayItForward.Giftee}
  let context: String
  prepare(user: AuthAccount) {
    //args
    let from: Address = 0xf8d6e0586b0a20c7
    let context = "for test"
    //##################################
    // context
    //##################################
    assert(context.length > 0, message: "Context length must be more than 0.")
    self.context = context
    //##################################
    // Gifter check
    //##################################
    self.gifterCap = getAccount(from).getCapability<&AnyResource{PayItForward.CollectionPublic}>(PayItForward.CollectionPublicPath)
    //##################################
    // Giftee initialize
    //##################################
    // storage path
    if user.borrow<&PayItForward.Collection>(from: PayItForward.CollectionStoragePath) == nil {
      user.save(<- PayItForward.createEmptyCollection(), to: PayItForward.CollectionStoragePath)
    }
    // public path
    if user.getCapability(PayItForward.CollectionPublicPath).borrow<&{PayItForward.CollectionPublic}>() == nil {
      user.link<&{PayItForward.CollectionPublic}>(
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
  address?: string;
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
        fcl.args([fcl.arg(props.address, FclUtils.Address), fcl.arg('hoge', FclUtils.String)]),
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

  // console.log(data);

  return (
    <>
      <SlideFade
        in={isOpen}
        offsetY="20px"
        delay={1}
        transition={{ enter: { ease: 'easeIn', duration: '1' } }}
      >
        <Box p={5} shadow="md" borderWidth="1px" mb="1">
          <HStack mb="2">
            <Box w="40vw">
              <Text alignSelf="baseline" pl="10" mt={4}>
                {props.address}さんへの感謝を次につなげてください。
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
        </Box>
      </SlideFade>
      <Box h="5" />
      <SlideFade
        in={isOpen}
        offsetY="20px"
        delay={1}
        transition={{ enter: { ease: 'easeIn', duration: '1' } }}
      >
        <HStack>
          <Img src="/images/00022.png" shadow="dark-lg" />
        </HStack>
      </SlideFade>
    </>
  );
};

export default Receive;
