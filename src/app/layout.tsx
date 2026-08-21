import Providers from "./providers";
import AuthProvider from "@/components/providers/AuthProvider";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat GBR",
  description: "AI-powered code workspace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthProvider>{children}</AuthProvider>
        </Providers>
      </body>
    </html>
  );
}