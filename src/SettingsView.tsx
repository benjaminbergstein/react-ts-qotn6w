import React, { FC } from 'react';
import { VStack, Text, Divider, Select } from '@chakra-ui/react';

import {
  usePlaylist,
  useMyPlaylists,
} from './hooks';

const SettingsView: React.FC = () => {
  const selectRef = React.useRef<HTMLSelectElement>(null);
  const [_playlist, setPlaylist] = usePlaylist();
  const playlists = useMyPlaylists();

  const handleSelect = () => {
    const val = selectRef?.current?.value;
    setPlaylist(val ? JSON.parse(val) : undefined);
  };

  return <VStack>
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
            <option value={JSON.stringify(playlist)}>
              {playlist.name}
            </option>
          ))}
        </optgroup>
      </Select>
    )}
  </VStack>
};

export default SettingsView;
