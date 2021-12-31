import React, { FC } from 'react';

import { Divider, Button, Text, HStack, Box, VStack } from '@chakra-ui/react';
import { useSetting, useView } from './hooks';
import { View } from './types';

const Item: FC<{ view: View }> = ({ view, children }) => {
  const [_view, setView] = useView();
  const [navOpen, setNavOpen] = useSetting('nav:open');

  return (
    <Box width="100%">
      <Button
        onClick={() => {
          setNavOpen(false);
          setView(view);
        }}
        width="100%"
        variant="ghost"
      >
        {children}
      </Button>
    </Box>
  );
};

const NavBar: FC = () => {
  const [navOpen, setNavOpen] = useSetting('nav:open');

  return (
    <React.Fragment>
      <HStack spacing="20px" justify="space-between" m="10px">
        <Box>🎶</Box>
        <Box>
          <Text fontWeight={700} style={{ fontStyle: 'italic', fontVariant: "small-caps" }}>
            SpotifyTuner&trade;
          </Text>
        </Box>
        <Box>
          <Button onClick={() => setNavOpen(!navOpen)} variant="outline">
            🍔
          </Button>
        </Box>
      </HStack>
      {navOpen && (
        <VStack
          spacing="10px"
          borderWidth="1px"
          m="10px"
          p="10px"
          borderRadius="10px"
        >
          <Item view="search">Search</Item>
          <Divider />
          <Item view="tune">Tune</Item>
          <Divider />
          <Item view="settings">Settings</Item>
          <Divider />
          <Item view="logout">Log out</Item>
        </VStack>
      )}
    </React.Fragment>
  );
};

export default NavBar;
