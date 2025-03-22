import type { Meta, StoryObj } from '@storybook/react';

import { DragDrop } from './DragDrop';

const meta = {
  title: 'Features/DragDrop',
  component: DragDrop,
} satisfies Meta<typeof DragDrop>;

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
  },
};
