import NextDocument, { Html, Head, Main, NextScript } from 'next/document';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

class Document extends NextDocument<Props> {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
