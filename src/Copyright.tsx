import React from "react";
import { Box, Text } from "@chakra-ui/react";

const Copyright = ({ layout }) => (
  <Box
    position={layout === "static" ? "static" : "fixed"}
    bottom={layout === "static" ? undefined : "0px"}
    height={layout === "static" ? "120px" : undefined}
    display="flex"
    alignItems="end"
    flexShrink={0}
    flexGrow={0}
    p={1}
  >
    <Text fontSize="10px" color="gray.700">
      &copy;2022 Ben Bergstein
    </Text>
  </Box>
);

export default Copyright;
