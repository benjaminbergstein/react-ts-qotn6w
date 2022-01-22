import React, { FC, useRef } from "react";
import {
  Drawer as _Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  Button,
  Box,
  ButtonGroup,
} from "@chakra-ui/react";

import {
  HamburgerIcon,
  SearchIcon,
  SettingsIcon,
  QuestionIcon,
  DeleteIcon,
} from "@chakra-ui/icons";

import Filters from "./Filters";
import Settings from "./Settings";
import SearchDrawer from "./SearchDrawer";
import Help from "./Help";
import Drawer from "./Drawer";
import ClearButton from "./ClearButton";

const Navbar: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Box position="fixed" left="0" bottom="0" width="100vw" zIndex={999}>
        <Box position="absolute" right="0px" bottom="0px">
          <Button
            onClick={onOpen}
            width="60px"
            height="60px"
            borderRadius={60}
            colorScheme="pink"
            margin={4}
          >
            <HamburgerIcon />
          </Button>
        </Box>
      </Box>
      <_Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>

          <DrawerBody>
            <VStack>
              <SearchDrawer closeParent={onClose} />

              <Filters />

              <Drawer toggle={<SettingsIcon />} title="Settings">
                <Settings />
              </Drawer>

              <Drawer toggle={<QuestionIcon />} title="Help">
                <Help />
              </Drawer>
              <ClearButton closeParent={onClose} />
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </_Drawer>
    </>
  );
};

export default Navbar;
