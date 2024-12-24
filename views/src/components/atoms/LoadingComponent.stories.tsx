import type { Meta, StoryObj } from '@storybook/react';

import { ThemeProvider } from '@mui/material/styles';
import LoadingComponent from './LoadingComponent';
import { darkTheme, lightTheme } from '@providers/contexts/themeModeTypes';

const meta = {
  component: LoadingComponent,
  decorators: [
    (Story) => (
      <ThemeProvider theme={lightTheme}>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof LoadingComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    state: {
      loading: true,
      content: 'poll',
      timeout: 1,
    },
  },
};
