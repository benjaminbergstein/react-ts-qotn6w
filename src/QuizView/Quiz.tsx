import React, { FC, useEffect, useRef } from "react";
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

import { useQuizSelections, useQuizStep } from "../hooks";
import { QuestionType } from "../types";

const Question: FC<QuestionType> = ({
  slug,
  title,
  labels = ["Less", "Neutral", "High"],
}) => {
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
      <Heading size="md">{title}</Heading>
      <Heading color="gray.600" size="xs">
        (1 = less {slug}, 5 = more {slug})
      </Heading>
      <ButtonGroup isAttached>
        {new Array(3).fill("").map((_, idx) => (
          <Button
            colorScheme="pink"
            onClick={handleClick(idx)}
            variant={quizSelections[slug] === idx ? "solid" : "outline"}
          >
            {labels[idx] || idx + 1}
          </Button>
        ))}
      </ButtonGroup>
      <Divider />
    </VStack>
  );
};

const questions: QuestionType[] = [
  { slug: "danceability", title: "How Dance-y" },
  { slug: "energy", title: "How energetic?" },
  { slug: "tempo", title: "What tempo?" },
  { slug: "valence", title: "How positive feeling?" },
  { slug: "popularity", title: "How popular?" },
  {
    slug: "size",
    title: "How many tracks?",
    labels: ["10", "25", "50"],
  },
];

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
          <Question {...question} />
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
