import React from "react";
import { Skeleton, Flex } from "@chakra-ui/react";

type ItemProps = {
  context?: "default" | "badge" | "search";
};

const Item: React.FC<ItemProps> = () => {
  const isSeed = false;
  const isUsed = true;

  return (
    <Flex
      position="relative"
      width={isSeed ? undefined : "100%"}
      direction="row"
      opacity={isSeed && !isUsed ? 0.5 : 1}
      height={isSeed ? "100%" : "20vw"}
      maxHeight="100px"
    >
      <Skeleton
        flex={1}
        maxHeight="100px"
        height={isSeed ? "100%" : "20vw"}
        minHeight={isSeed ? "80px" : "80px"}
      />
    </Flex>
  );
};
export default Item;
