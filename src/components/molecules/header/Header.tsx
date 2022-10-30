import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Link,
  Spacer,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from '@chakra-ui/react';
import { FC, MouseEvent } from 'react';

export type HeaderProps = {
  loggedIn: boolean;
  signInOrOut: (event: MouseEvent<HTMLButtonElement>) => Promise<void>;
  address: string;
};

export const Header: FC<HeaderProps> = (props) => (
  <Box
    // bgGradient="linear(to-l, brand.900, brand.800,brand.500,brand.400)"
    backgroundColor="white"
    borderBottom="1px"
    borderBottomColor="white"
    color="black"
    position="sticky"
    top="0"
    m="0"
    boxShadow="lg"
    zIndex={100}
  >
    <Flex alignItems="center" h="10vh">
      <Text variant="h4" m="5" ml="10">
        <Link href="/" style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
          Pay It Forward
        </Link>
      </Text>
      <Spacer />
      {!props.loggedIn ? (
        <Flex alignItems="center" alignSelf="stretch">
          <Button
            colorScheme="yellow"
            variant="solid"
            onClick={(e) => {
              void props.signInOrOut(e);
            }}
          >
            Connect Wallet
          </Button>
        </Flex>
      ) : (
        <Flex alignItems="center" alignSelf="stretch">
          <Menu>
            <MenuButton
              as={Button}
              colorScheme="yellow"
              variant="outline"
              rightIcon={<ChevronDownIcon />}
            >
              {props.address}
            </MenuButton>
            <MenuList backgroundColor="yellow.50">
              <MenuItem>MyPage</MenuItem>
              <MenuItem
                onClick={(e) => {
                  void props.signInOrOut(e);
                }}
              >
                Sign Out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      )}
    </Flex>
  </Box>
);
