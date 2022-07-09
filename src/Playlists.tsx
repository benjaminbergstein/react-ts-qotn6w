import { Button, VStack } from "@chakra-ui/react";
import React, { FC } from "react";
import { FaHeart } from "react-icons/fa";
import Drawer from "./Drawer";
import { useManagedPlaylists } from "./hooks";

const Playlists: FC = () => {
  const [playlists] = useManagedPlaylists();

  return (
    <Drawer placement="right" toggle={<FaHeart />} title="Playlists">
      <VStack>
        {Object.entries(playlists).map(([id, playlist]) => (
          <a href={`/v/managePlaylist/${id}`}>
            <Button>{playlist?.name || id}</Button>
          </a>
        ))}
      </VStack>
    </Drawer>
  );
};

export default Playlists;
