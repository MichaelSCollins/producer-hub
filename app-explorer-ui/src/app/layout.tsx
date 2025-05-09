import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/navbar";

export const metadata: Metadata = {
  title: "ProducerHub User Interface",
  description: "ProducerHub User Interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <div className="flex flex-col bg-gray-700">
          <Navbar />
          <main className="">{children}</main>
          <footer className="bg-gray-800 text-white text-center py-4 border w-full">
            &copy; {new Date().getFullYear()} ProducerHub. All rights reserved.
          </footer>
        </div>
      </body>
    </html>
  );
}
