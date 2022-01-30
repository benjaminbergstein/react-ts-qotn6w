import React from "react";
import { Flex } from "@chakra-ui/react";

import Copyright from "../Copyright";
import { useQuizStep } from "../hooks";
import Quiz from "./Quiz";
import PickTopSong from "./PickTopSong";
import PickPlaylist from "./PickPlaylist";

const QuizView: React.FC = () => {
  const [step] = useQuizStep();

  return (
    <Flex flex={1} direction="row" align="center" width="100%" justify="center">
      {step === "quiz" && <Quiz />}
      {step === "generate" && <PickTopSong />}
      {step === "from-playlist" && <PickPlaylist />}
      <Copyright layout="fixed" />
    </Flex>
  );
};

export default QuizView;
