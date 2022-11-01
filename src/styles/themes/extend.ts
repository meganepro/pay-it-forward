import { extendTheme } from '@chakra-ui/react';

const styles = {
  global: {
    '*': {
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
    },
    'html, body': {},
  },
};

const fonts = {
  body: 'EB Garamond',
  heading: 'EB Garamond',
};

const colors = {
  brand: {
    900: '#063DAD',
    800: '#0D68B5',
    700: '#0D74CA',
    600: '#1D9CD7',
    500: '#1D9EA5',
    400: '#0C648A',
    300: '#1D759B',
    200: '#2E86AC',
    100: '#3F97BD',
    50: '#4FA8CE',
    header: '#181818',
  },
  palette: {
    pureWhite: '#FFFFFF',
    white: '#F8F8F8',
    lightGray: '#B5B5B6',
    darkGray: '#3A3736',
    blue: '#3264FF',
    red: '#FF0000',
    green: '#5AB739',
    black: '#211613',
    pureBlack: '#000000',
  },
};
export const theme = extendTheme({
  styles,
  fonts,
  colors,
});
