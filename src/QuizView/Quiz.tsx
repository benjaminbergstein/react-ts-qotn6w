import React, { FC, useEffect, useRef } from "react";
import {
  Text,
  Button,
  VStack,
  Flex,
  ButtonGroup,
  Divider,
  Box,
} from "@chakra-ui/react";

import { useQuizSelections, useQuizStep } from "../hooks";
import { QuestionType } from "../types";
import { questions } from "./questions";

const Question: FC<QuestionType> = ({ slug, low, high }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [quizSelections, setQuizSelections] = useQuizSelections();

  const handleClick = (idx) => () => {
    const { y, height } = containerRef.current.getBoundingClientRect();

    setQuizSelections((selections) => ({
      ...selections,
      [slug]: idx,
    }));
    setTimeout(() => {
      window.scrollBy({ left: 0, top: y + height, behavior: "smooth" });
    }, 50);
  };

  return (
    <VStack spacing="20px" ref={containerRef}>
      <ButtonGroup isAttached>
        <Button
          colorScheme="pink"
          onClick={handleClick("low")}
          variant={quizSelections[slug] === "low" ? "solid" : "outline"}
        >
          {low}
        </Button>
        <Button
          colorScheme="pink"
          onClick={handleClick("high")}
          variant={quizSelections[slug] === "high" ? "solid" : "outline"}
        >
          {high}
        </Button>
      </ButtonGroup>
      <Divider />
    </VStack>
  );
};

const Quiz: React.FC = () => {
  const [quizSelections] = useQuizSelections();
  const isComplete =
    Object.keys(quizSelections).length === Object.keys(questions).length;
  const [_step, setStep] = useQuizStep();
  useEffect(() => {
    window.scrollBy({ top: 0, left: 0 });
  }, []);

  return (
    <Flex
      p={3}
      flex={1}
      direction="row"
      align="center"
      width="100%"
      justify="center"
    >
      <VStack spacing="30px" center="right" maxWidth="600px">
        <Box>
          <Text fontSize="sm" textAlign="center">
            Let's find you some unfamiliar music.
          </Text>
          <Text pt={1} fontSize="xs" textAlign="center">
            Answer these 5 questions
            <br /> to generate a playlist.
          </Text>
        </Box>
        <Divider />
        {questions.map((question) => (
          <Question key={question.slug} {...question} />
        ))}
        {isComplete && (
          <Box pb={8} width="100%">
            <Button
              onClick={() => {
                setStep("generate");
                window.scrollBy({ top: 0, left: 0 });
              }}
              height="100px"
              my={4}
              width="100%"
              colorScheme="pink"
            >
              Let's go!
            </Button>
          </Box>
        )}
      </VStack>
    </Flex>
  );
};

export default Quiz;
