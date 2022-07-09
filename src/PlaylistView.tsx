import React, { FC, useEffect } from "react";
import {
  GetObjectQuery,
  GetObjectQueryVariables,
  GetPlaylistQuery,
  GetPlaylistQueryVariables,
  ObjectType,
} from "./generated/graphql";

import { loader } from "graphql.macro";
import { useRouter } from "./hooks";
import useQuery from "./useQuery";
import { Box, HStack } from "@chakra-ui/react";
import { Track } from "./spotify";
import { isServer } from "./constants";

const GetPlaylist = loader("./GetPlaylist.graphql");
const GetObject = loader("./GetObject.graphql");

const TrackView: FC<{ id: string }> = ({ id }) => {
  const { data } = useQuery<{ data: GetObjectQuery }, GetObjectQueryVariables>({
    query: GetObject,
    variables: {
      id,
      type: ObjectType.SpotifyTrack,
    },
  });
  if (!data?.data) return null;
  const track = JSON.parse(data?.data?.getObject?.data) as Track;

  const image = track?.album?.images[2];
  return (
    <HStack>
      <img src={image.url} />
      <Box>
        {track.name} by {track.artists[0].name}
      </Box>
    </HStack>
  );
};

const PlaylistView: FC = () => {
  const {
    args: [playlistId],
  } = useRouter();

  const { data } = useQuery<
    { data: GetPlaylistQuery },
    GetPlaylistQueryVariables
  >({
    query: GetPlaylist,
    variables: {
      id: playlistId,
    },
  });

  const playlist = data?.data?.getPlaylist;
  if (isServer) return null;

  return (
    <>
      <Box>{playlist?.title}</Box>
      {playlist?.tracks?.map((trackId) => (
        <TrackView id={trackId} />
      ))}
    </>
  );
};

export default () => {
  if (isServer) return <>Loading playlist...</>;
  return <PlaylistView />;
};
