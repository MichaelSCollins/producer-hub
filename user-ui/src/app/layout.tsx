import type { Metadata } from "next";
import "./globals.css";


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
      <body
        className={`antialiased 
          w-full h-screen
          flex flex-col justify-center 
          items-center`}
      >
        {children}
      </body>
    </html>
  );
}
