import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';
import AceEditor, { IAceEditorProps } from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-tomorrow';

type JsonViewerType = IAceEditorProps & {
  value: string;
  onChange?: ((value: string, event?: unknown) => void) | undefined;
  height?: string;
};
const JsonViewer: FC<JsonViewerType> = ({ value, onChange, height = '80vh', ...rest }) => (
  <Box borderWidth="1px" borderRadius="sm">
    <AceEditor
      mode="json"
      theme="tomorrow"
      showGutter={false}
      readOnly
      value={value}
      height={height}
      onChange={onChange}
      name="UNIQUE_ID_OF_DIV"
      width="70vw"
      wrapEnabled
      {...rest}
    />
  </Box>
);

export default JsonViewer;
