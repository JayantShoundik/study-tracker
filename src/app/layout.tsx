import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "FocusForge — Study & Placement Command Center",
  description:
    "A shared study, technical interview, and placement preparation command center for Jayant and Rekha.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
