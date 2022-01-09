import React, { FC } from 'react';

import {
  Box, Button, Text, VStack,
} from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons';
import { useSetting } from './hooks';

export function TooltipParagraph({ children }) {
  return <Text fontSize="16px">{children}</Text>;
}

type TooltipProps = {
  label: string;
  id: string;
  closeMessage?: string;
  color?: string;
};

const Tooltip: FC<TooltipProps> = ({
  id,
  label,
  closeMessage = 'Got it!',
  color = 'blue',
  children,
}) => {
  const [isOpen, setIsOpen] = useSetting(`tooltip:${id}`, true);

  if (!isOpen) {
    return (
      <Box my="10px">
        <Button
          size="xs"
          onClick={() => setIsOpen(true)}
          variant="ghost"
          leftIcon={
            <QuestionIcon color="gray.500" height="15px" width="15px" />
          }
        >
          <Text
            color="gray.500"
            fontSize="14px"
            ml={2}
            fontWeight="normal"
            textTransform="uppercase"
          >
            Tip:
            {' '}
            {label}
          </Text>
        </Button>
      </Box>
    );
  }

  return (
    <VStack
      my="10px"
      color={`${color}.600`}
      spacing="12px"
      borderWidth="1px"
      borderRadius={4}
      p={4}
      borderColor={`${color}.100`}
      bg={`${color}.50`}
    >
      <Text textTransform="uppercase" fontSize="16px">
        <QuestionIcon width="15px" height="15px" />
        &nbsp;&nbsp;
        {label}
      </Text>

      {children}

      <Button
        variant="unstyled"
        onClick={() => {
          setIsOpen(false);
        }}
      >
        <Text textTransform="uppercase" fontSize="16px">
          {closeMessage}
        </Text>
      </Button>
    </VStack>
  );
};

export default Tooltip;
