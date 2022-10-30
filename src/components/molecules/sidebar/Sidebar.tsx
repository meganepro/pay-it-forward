import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
} from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';
import { IconType } from 'react-icons';
import { FiMenu } from 'react-icons/fi';

type LinkItemProps = {
  name: string;
  icon: IconType;
  linkTo: string;
};

type NavItemProps = FlexProps &
  LinkItemProps & {
    children: string;
  };

const NavItem = ({ icon, children, linkTo, ...rest }: NavItemProps) => (
  <Link href={linkTo} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{
        bg: 'cyan.400',
        color: 'gray.800',
      }}
      {...rest}
    >
      {icon && (
        <Icon
          mr="4"
          fontSize="16"
          _groupHover={{
            color: 'gray.800',
          }}
          as={icon}
        />
      )}
      {children}
    </Flex>
  </Link>
);

export type SidebarContentProps = BoxProps & {
  onClose: () => void;
  linkItems: Array<LinkItemProps>;
};

const SidebarContent: FC<SidebarContentProps> = ({ onClose, linkItems, ...rest }) => (
  <Box
    bg={useColorModeValue('gray.800', 'gray.900')}
    borderRight="1px"
    borderRightColor={useColorModeValue('gray.200', 'gray.700')}
    color="whiteAlpha.800"
    w={{ base: 'full', md: 60 }}
    pos="fixed"
    h="full"
    {...rest}
  >
    <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
      <Text fontSize="xl" fontWeight="bold" fontFamily="Polonium-Bold">
        Main Menu
      </Text>
      <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
    </Flex>
    {linkItems.map((link) => (
      <NavItem key={link.name} {...link}>
        {link.name}
      </NavItem>
    ))}
  </Box>
);

type MobileProps = FlexProps & {
  onOpen: () => void;
};

const MobileNav: FC<MobileProps> = ({ onOpen, ...rest }) => (
  <Flex
    ml={{ base: 0, md: 60 }}
    px={{ base: 4, md: 24 }}
    height="20"
    alignItems="center"
    bg={useColorModeValue('gray.800', 'gray.900')}
    color="whiteAlpha.800"
    borderBottomWidth="1px"
    borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
    justifyContent="flex-start"
    {...rest}
  >
    <IconButton variant="outline" onClick={onOpen} aria-label="open menu" icon={<FiMenu />} />

    <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
      Main Menu
    </Text>
  </Flex>
);

export type SidebarProps = {
  children: ReactNode;
  linkItems: Array<LinkItemProps>;
};

export const Sidebar: FC<SidebarProps> = (props) => {
  const { children, linkItems } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="91vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        linkItems={linkItems}
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent linkItems={linkItems} onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
};
