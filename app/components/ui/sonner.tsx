import { Toaster as Sonner } from "sonner"
import type { ToasterProps } from "sonner"

type Props = ToasterProps & {
  theme?: ToasterProps["theme"] // "light" | "dark" | "system"
}

const Toaster = ({ theme = "light", ...props }: Props) => {
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }