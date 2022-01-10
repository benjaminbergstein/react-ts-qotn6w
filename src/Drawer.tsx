import React, { FC, useRef } from "react";
import {
  Button,
  useDisclosure,
  Drawer as _Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

type Props = {
  placement?: "right" | "left";
  title?: string | JSX.Element;
  toggle: string | JSX.Element;
  controls?: React.ComponentType;
};

const Drawer: FC<Props> = ({
  placement = "right",
  toggle = undefined,
  title = undefined,
  children,
  controls: Controls = undefined,
}) => {
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
        {toggle}
      </Button>
      <_Drawer
        isOpen={isOpen}
        placement={placement}
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
      </_Drawer>
    </>
  );
};

export default Drawer;
