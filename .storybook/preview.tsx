import type { Preview } from "@storybook/nextjs-vite"
import { ThemeProvider } from "@/components/theme-provider"
import "../app/globals.css"

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="min-h-screen bg-background p-6 text-foreground">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "app-bg",
      values: [
        { name: "app-bg", value: "hsl(0 0% 100%)" },
        { name: "app-bg-dark", value: "hsl(0 0% 12%)" },
      ],
    },
    a11y: {
      test: "todo",
    },
  },
}

export default preview
