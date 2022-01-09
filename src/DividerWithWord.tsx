import React, { FC } from 'react';
import {
  Box, Text, HStack, Divider,
} from '@chakra-ui/react';

const DividerWithWord: FC = ({ children }) => (
  <HStack my="30px">
    <Box flex="1">
      <Divider />
    </Box>
    <Box>
      <Text fontSize="xs" color="gray.600" textTransform="uppercase">
        {children}
      </Text>
    </Box>

    <Box flex="1">
      <Divider />
    </Box>
  </HStack>
);

export default DividerWithWord;
