import type { Meta, StoryObj } from '@storybook/react';

import { NestedDragDrop } from './NestedDragDrop';

const meta = {
  title: 'Features/NestedDragDrop',
  component: NestedDragDrop,
} satisfies Meta<typeof NestedDragDrop>;

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
