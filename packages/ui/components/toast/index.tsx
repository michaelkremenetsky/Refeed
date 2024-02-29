"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:border-border group-[.toaster]:border-neutral-200 group-[.toaster]:shadow-[0px_20px_70px_-10px_hsla(227,30%,20%,0.08),0px_10px_24px_-8px_hsla(227,30%,20%,0.04),0px_1px_4px_-1px_hsla(227,30%,20%,0.06)] group-[.toaster]:dark:border-neutral-700/80 group-[.toaster]:dark:bg-[#0f0f10] group-[.toaster]:text-sm group-[.toaster]:dark:shadow-none",
          title:
            "font-[550] group-[.toast-title]:text-neutral-700  group-[.toast-title]:dark:text-stone-200 group-[.toast]:subpixel-antialiased",
          description:
            "group-[.toast]:text-neutral-450 group-[.toaster]:text-sm group-[.toast]:dark:text-stone-500/80 group-[.toast]:subpixel-antialiased",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:subpixel-antialiased",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:subpixel-antialiased",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
