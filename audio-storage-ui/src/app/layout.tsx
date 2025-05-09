import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MainLayout } from "@/components/layout/MainLayout";
// import { audioStorageApi } from "@/lib/audioStorage";
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
  // const token = audioStorageApi.getUser();
  return (
    <div lang="en" className="bg-gray-700 ">
      {/* {token && <p className="border boder-color-gray-300 p-4 bg-teal-700/30 text-orange-300 mx-auto text-center">
        {JSON.stringify(token)}
      </p>} */}
      <article className={inter.className}>
        <MainLayout>{children}</MainLayout>
      </article>
    </div>
  );
}
