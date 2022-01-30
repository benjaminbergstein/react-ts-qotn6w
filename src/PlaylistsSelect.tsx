import React from "react";
import { Select } from "@chakra-ui/react";

import { useMyPlaylists } from "./hooks";
import { Playlist } from "./spotify";

type Props = {
  onSelect: (playlist: Playlist) => void;
  placeholder?: string;
  label?: string;
};

const PlaylistsSelect: React.FC<Props> = ({
  onSelect,
  placeholder = "End of queue",
  label = "Add to a playlist:",
}) => {
  const selectRef = React.useRef<HTMLSelectElement>(null);
  const playlists = useMyPlaylists();

  const handleSelect = () => {
    const val = selectRef?.current?.value;
    onSelect(val ? JSON.parse(val) : undefined);
  };

  if (!playlists) return null;

  return (
    <Select
      id="add-to"
      ref={selectRef}
      onChange={handleSelect}
      placeholder={placeholder}
    >
      <optgroup label={label}>
        {playlists.map((playlist) => (
          <option value={JSON.stringify(playlist)}>{playlist.name}</option>
        ))}
      </optgroup>
    </Select>
  );
};

export default PlaylistsSelect;
