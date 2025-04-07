import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MainLayout } from "@/components/layout/MainLayout";
import { audioStorageApi } from "@/lib/audioStorage";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Audio Viewer",
  description: "View and manage your audio projects",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = audioStorageApi.getUser();
  return (
    <html lang="en">
      {JSON.stringify(token)}
      <body className={inter.className}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
