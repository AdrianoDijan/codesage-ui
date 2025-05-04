import type { Meta, StoryObj } from "@storybook/react";
import { NavUser } from "../../layouts/sidebar/nav-user";

const meta: Meta<typeof NavUser> = {
  title: "Components/NavUser",
  component: NavUser,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NavUser>;

export const Default: Story = {
  args: {},
};
