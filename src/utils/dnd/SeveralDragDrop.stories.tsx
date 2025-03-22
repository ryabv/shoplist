import type { Meta, StoryObj } from '@storybook/react';

import { SeveralDragDrop } from './SeveralDragDrop';

const meta = {
  title: 'Features/SeveralDragDrop',
  component: SeveralDragDrop,
} satisfies Meta<typeof SeveralDragDrop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithAnimation: Story = {
  args: {
    shouldAnimateOnHover: true,
  },
};

export const WithDragHandler: Story = {
  args: {
    shouldUseDragElement: true,
    shouldAnimateOnHover: true,
  },
};
