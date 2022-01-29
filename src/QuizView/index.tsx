import React, { FC, useState } from "react";
import {
  Text,
  Heading,
  Button,
  VStack,
  Flex,
  ButtonGroup,
  Divider,
  Box,
} from "@chakra-ui/react";

import Copyright from "../Copyright";
import { useQuizStep } from "../hooks";
import Quiz from "./Quiz";
import Playlist from "./Playlist";

const QuizView: React.FC = () => {
  const [step] = useQuizStep();

  return (
    <Flex flex={1} direction="row" align="center" width="100%" justify="center">
      {step === "quiz" && <Quiz />}
      {step === "generate" && <Playlist />}
      <Copyright layout="fixed" />
    </Flex>
  );
};

export default QuizView;
