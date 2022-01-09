import React, { FC } from 'react';
import {
  VStack, Divider, Heading, ButtonGroup, Text,
} from '@chakra-ui/react';

import { SearchIcon, SettingsIcon, QuestionIcon } from '@chakra-ui/icons';

import Filters from './Filters';
import Settings from './Settings';
import SearchDrawer from './SearchDrawer';
import Help from './Help';
import Drawer from './Drawer';

const Navbar: FC = () => (
  <ButtonGroup display="flex" flex="1" isAttached>
    <Filters />

    <SearchDrawer />

    <Drawer toggle={<SettingsIcon />} title="Settings">
      <Settings />
    </Drawer>

    <Drawer toggle={<QuestionIcon />} title="Help">
      <Help />
    </Drawer>
  </ButtonGroup>
);

export default Navbar;
