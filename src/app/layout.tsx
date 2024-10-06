import type { Metadata } from "next";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

export const metadata: Metadata = {
  title: "OpenAI Assistants 管理器",
  description: "管理您的 OpenAI Assistants",
  manifest: "/manifest.json",
  themeColor: "#4F46E5",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <Theme
          appearance="light"
          accentColor="indigo"
          grayColor="slate"
          radius="medium"
          scaling="100%"
        >
          {children}
        </Theme>
      </body>
    </html>
  );
}
