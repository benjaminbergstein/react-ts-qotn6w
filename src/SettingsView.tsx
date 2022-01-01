import React, { FC } from "react";
import {
  FormControl,
  FormLabel,
  Switch,
  VStack,
  Text,
  Divider,
  Select,
} from "@chakra-ui/react";

import { useSetting, usePlaylist, useMyPlaylists } from "./hooks";

const SettingsView: React.FC = () => {
  const selectRef = React.useRef<HTMLSelectElement>(null);
  const [_playlist, setPlaylist] = usePlaylist();
  const playlists = useMyPlaylists();
  const [berzerkModeEnabled, setBerzerkModeEnabled] = useSetting(
    "berzerModeEnabled",
    false
  );

  const handleSelect = () => {
    const val = selectRef?.current?.value;
    setPlaylist(val ? JSON.parse(val) : undefined);
  };

  return (
    <VStack>
      <Text fontSize="xs" color="gray.600">
        Where do you want to add tracks?
      </Text>
      <Divider />
      {playlists && (
        <Select
          ref={selectRef}
          onChange={handleSelect}
          placeholder="Add to queue"
        >
          <optgroup label="Add to playlist:">
            {playlists.map((playlist) => (
              <option value={JSON.stringify(playlist)}>{playlist.name}</option>
            ))}
          </optgroup>
        </Select>
      )}
      <Divider />
      <FormControl display="flex" alignItems="center">
        <Switch
          isChecked={berzerkModeEnabled}
          onChange={() => setBerzerkModeEnabled(!berzerkModeEnabled)}
          id="berzerk-mode"
          colorScheme="red"
        />
        <FormLabel ml={2} mb={0} htmlFor="berzerk-mode">
          Berzerk mode enabled
        </FormLabel>
      </FormControl>
      <Divider />
    </VStack>
  );
};

export default SettingsView;
