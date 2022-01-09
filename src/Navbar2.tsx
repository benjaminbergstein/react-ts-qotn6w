import React, { FC } from "react";
import { VStack, Divider, Heading, ButtonGroup, Text } from "@chakra-ui/react";

import { SearchIcon, SettingsIcon, QuestionIcon } from "@chakra-ui/icons";

import Filters from "./Filters";
import SettingsView from "./SettingsView";
import SearchView from "./SearchView";
import Drawer from "./Drawer";

const Navbar: FC = () => (
  <ButtonGroup display="flex" flex="1" isAttached>
    <Filters />

    <SearchView />

    <Drawer toggle={<SettingsIcon />} title="Settings">
      <SettingsView />
    </Drawer>
    <Drawer toggle={<QuestionIcon />} title="Help">
      <VStack alignItems="start" spacing={3}>
        <Heading size="sm">Recommendation "Seeds"</Heading>
        <Text>
          "Seeds" are tracks or artists used to get recommendations. As you select
          additional recommendations below, recommendations will update.
        </Text>
        <Text>
          Think of it as "surfing" or "meandering" through recommendations.
        </Text>
        <Text>
          Due to Spotify limitations, only the last 5 selections are used for
          seeding recommendations.
        </Text>
        <Divider />

        <Heading size="sm">Recommendation results</Heading>
        <Text>
          Click a recommendation below to budge discovery in that direction. This
          will also add that track to your queue.
        </Text>
        <Text>
          To add to a playlist instead, click the settings (<SettingsIcon />) in the nav bar, and then
          select the playlist you want instead of "Add to Queue"
        </Text>
      </VStack>
    </Drawer>
  </ButtonGroup>
);

export default Navbar;
