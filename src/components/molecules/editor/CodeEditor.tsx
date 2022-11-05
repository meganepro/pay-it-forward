import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-tomorrow';

type CodeEditorType = {
  value: string;
  onChange?: ((value: string, event?: unknown) => void) | undefined;
  maxLines?: number;
};

const CodeEditor: FC<CodeEditorType> = ({ value, maxLines = 30, onChange }) => (
  <Box borderWidth="1px" borderRadius="sm">
    <AceEditor
      mode="javascript"
      theme="tomorrow"
      value={value}
      onChange={onChange}
      name="UNIQUE_ID_OF_DIV"
      width="70vw"
      wrapEnabled
      maxLines={Number(maxLines)}
      setOptions={{ useWorker: false }}
    />
  </Box>
);

export default CodeEditor;
