import React, { FC, useState, useRef } from "react";
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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

import { DeleteIcon } from "@chakra-ui/icons";
import { useQuizSelections, useQuizStep, useSeeds, useSliders } from "./hooks";

type Props = {
  closeParent: () => void;
};

const ClearButton: FC<Props> = ({ closeParent }) => {
  const [_, __, ___, ____, resetSeeds] = useSeeds();
  const [_sliders, _setSliders, resetSliders] = useSliders();
  const [_quizSelections, _setQuizSelections, resetQuizSelections] =
    useQuizSelections();
  const [_quizStep, _setQuizStep, resetQuizStep] = useQuizStep();

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();

  const onClear = () => {
    resetSeeds();
    resetSliders();
    resetQuizSelections();
    resetQuizStep();
    closeParent();
    onClose();
  };

  return (
    <>
      <Button
        leftIcon={<DeleteIcon />}
        onClick={() => {
          setIsOpen(true);
        }}
        width="100%"
        colorScheme="red"
        variant="outline"
        mr={3}
      >
        Clear
      </Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Clear data
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This will clear seeds and filters.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={onClear} ml={3}>
                Clear
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ClearButton;
