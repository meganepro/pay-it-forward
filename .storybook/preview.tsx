import { theme } from '@/styles/themes/extend';
import { ChakraProvider } from '@chakra-ui/react';
// import Fonts from '@/styles/Fonts';
import * as NextImage from 'next/image';

export const decorators = [
  (Story: Function) => {
    return (
      <ChakraProvider theme={theme}>
        {/* <Fonts /> */}
        <Story />
      </ChakraProvider>
    );
  },
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  chakra: {
    theme,
  },
};

// for NextImage
const OriginalNextImage = NextImage.default;
Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props: NextImage.ImageProps) => <OriginalNextImage {...props} unoptimized />,
});
