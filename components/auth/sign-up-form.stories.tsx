import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { SignUpForm } from "@/components/auth/sign-up-form"

const meta = {
  title: "Auth/SignUpForm",
  component: SignUpForm,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SignUpForm>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
