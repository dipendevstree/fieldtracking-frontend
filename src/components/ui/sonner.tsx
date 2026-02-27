import { Toaster as Sonner, ToasterProps } from "sonner";
import { useTheme } from "@/context/theme-context";
import { TOAST_CONFIG } from "@/data/app.data";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group [&_div[data-content]]:w-full"
      duration={TOAST_CONFIG.duration}
      position={TOAST_CONFIG.position}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
