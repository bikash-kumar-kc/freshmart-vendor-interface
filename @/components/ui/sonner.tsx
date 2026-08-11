import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
  classNames: {
    toast: "rounded-xl border shadow-lg font-sans",
    title: "font-medium",
    description: "text-sm text-muted-foreground",
    actionButton: "bg-primary text-primary-foreground",
    cancelButton: "bg-muted text-muted-foreground",
    success:
      "bg-green-50! text-green-900! border-green-300! dark:bg-green-950! dark:text-green-200!",
    error:
      "bg-red-50! text-red-900! border-red-300! dark:bg-red-950! dark:text-red-200!",
    warning:
      "bg-yellow-50! text-yellow-900! border-yellow-300! dark:bg-yellow-950! dark:text-yellow-200!",
    info:
      "bg-blue-50! text-blue-900! border-blue-300! dark:bg-blue-950! dark:text-blue-200!",
  },
}}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      // toastOptions={{
      //   classNames: {
      //     toast: "cn-toast",
      //   },
      // }}
      {...props}
    />
  );
};

export { Toaster };
