import React, { FC } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Switch,
  VStack,
  Text,
  Divider,
  Select,
} from "@chakra-ui/react";

import { WarningIcon } from "@chakra-ui/icons";
import { useView, useSetting, usePlaylist, useMyPlaylists } from "./hooks";

const SettingsView: React.FC = () => {
  const selectRef = React.useRef<HTMLSelectElement>(null);
  const [view, setView] = useView();
  const [_playlist, setPlaylist] = usePlaylist();
  const playlists = useMyPlaylists();
  const [wildMode, setWildMode] = useSetting("wildMode", false);

  const handleSelect = () => {
    const val = selectRef?.current?.value;
    setPlaylist(val ? JSON.parse(val) : undefined);
  };

  return (
    <VStack spacing={4} alignItems="start">
      <Box>
        <FormLabel htmlFor="add-to">Add to</FormLabel>
        {playlists && (
          <Select
            id="add-to"
            ref={selectRef}
            onChange={handleSelect}
            placeholder="End of queue"
          >
            <optgroup label="Add to a playlist:">
              {playlists.map((playlist) => (
                <option value={JSON.stringify(playlist)}>
                  {playlist.name}
                </option>
              ))}
            </optgroup>
          </Select>
        )}
        <Box pt={2}>
          <Text textAlign="left" fontSize="xs" color="gray.600">
            Where do you want to add tracks?
          </Text>
        </Box>
      </Box>
      <Divider borderColor="gray.200" borderWidth="2px" />
      <Box>
        <FormControl display="flex" alignItems="center">
          <Switch
            isChecked={wildMode}
            onChange={() => setWildMode(!wildMode)}
            id="wild-mode"
            colorScheme="red"
          />
          <FormLabel ml={2} mb={0} htmlFor="wild-mode">
            Wild mode
          </FormLabel>
        </FormControl>
        <Box pt={2}>
          <Text textAlign="left" fontSize="xs" color="gray.600">
            Danger zone! Wild mode will start adding to your queue or playlist
            every second. If this site freezes while in "Wild" mode, refresh the
            page.
          </Text>
        </Box>
      </Box>

      <Divider borderColor="gray.200" borderWidth="2px" />

      <Box>
        <FormLabel htmlFor="log-out">Session</FormLabel>
        <Button
          onClick={() => {
            setView("logout");
          }}
          leftIcon={<WarningIcon />}
          colorScheme="red"
        >
          Log out
        </Button>
        <Box pt={2}>
          <Text textAlign="left" fontSize="xs" color="gray.600">
            This will unauthorize this app for Spotify and clear all data stored
            about your session.
          </Text>
        </Box>
      </Box>
    </VStack>
  );
};

export default SettingsView;
