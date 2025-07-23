"use client";
import React, { useState, useEffect } from "react";
import { Lexend } from "next/font/google";
import Navbar from "./navbar";
import "./globals.css";
import { auth } from "@/firebase/clientApp";

const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <html lang="en">
        <body className={lexend.className}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={lexend.className}>
        <div className="flex">
          <Navbar />
          <main className={`flex-1 ${user ? 'ml-64' : ''} transition-all duration-300 ease-in-out`}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
