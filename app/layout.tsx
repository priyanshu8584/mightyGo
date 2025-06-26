import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import  ConvexClientProvider  from "./ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import SyncUserWithConvex from "./SyncUserWithConvex";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MightyGo",
  description: "Your one-stop solution for event services",
 icons: {
    icon: "/logo.png", 
    shortcut: "/logo.png", 
  },
 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
       
       <ClerkProvider>

          <ConvexClientProvider>
            <SyncUserWithConvex/>
            {children}
            <Toaster position="top-right"/>
            
            </ConvexClientProvider>
        </ClerkProvider>
       
      </body>
    </html>
  );
}
