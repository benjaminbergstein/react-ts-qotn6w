import React, { FC, useRef } from "react";
import {
  Button,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

type Props = {
  title: string;
  controls?: React.ComponentType;
};

const Drawer: FC<Props> = ({ title, children, controls: Controls }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        flex="1"
        variant="outline"
        py={3}
        ref={btnRef}
        colorScheme="teal"
        onClick={onOpen}
      >
        {title}
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{title}</DrawerHeader>

          <DrawerBody>{children}</DrawerBody>

          <DrawerFooter>
            {Controls && <Controls />}
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Drawer;
