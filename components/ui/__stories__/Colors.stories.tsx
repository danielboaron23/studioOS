import type { Meta, StoryObj } from '@storybook/nextjs-vite'

const TOKENS = [
  'background',
  'foreground',
  'card',
  'primary',
  'secondary',
  'muted',
  'accent',
  'destructive',
  'border',
  'ring',
]

const CHARTS = ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5']

function Swatch({ token }: { token: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="h-16 w-full rounded-md border"
        style={{ background: `var(--${token})` }}
      />
      <code className="text-muted-foreground text-xs">--{token}</code>
    </div>
  )
}

const meta = {
  title: 'Design System/Colors',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Tokens: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 text-sm font-medium">Semantic tokens</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {TOKENS.map((t) => (
            <Swatch key={t} token={t} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium">Chart palette</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {CHARTS.map((t) => (
            <Swatch key={t} token={t} />
          ))}
        </div>
      </div>
    </div>
  ),
}
