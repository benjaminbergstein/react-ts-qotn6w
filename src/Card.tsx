import React, { FC } from "react";
import { VStack } from "@chakra-ui/react";

const Card: FC = ({ children }) => (
  <VStack
    spacing="10px"
    borderWidth="1px"
    m="10px"
    p="10px"
    borderRadius="10px"
  >
    {children}
  </VStack>
);

export default Card;
