// app/page.tsx
"use client";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/clientApp";
import { loginWithGoogle } from "@/firebase/firebaseAuth";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, []);

  return user ? (
    <div className="flex flex-col items-center justify-center">
      <div className="p-50 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Stock Market Game</h1>
        <p className="text-lg mb-2">Practice trading with real-time data and learn about the stock market.</p>
        
        <div className="flex space-x-4 mt-2">
          <button
            onClick={() => router.push('/stocks')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            View Stocks
          </button>
          <button
            onClick={() => router.push('/profile')}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            View Portfolio
          </button>
        </div>
        <p className="mt-4 text-gray-600">Explore stocks, track your portfolio, and learn as you trade.</p>
      </div>

      <div className="p-6 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Settings</h1>

        <p className="text-lg mb-2">Customize your trading experience and manage your account settings.</p>

      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4 justify-center">Practice Trading with Real-Time Data</h1>
      <button onClick={loginWithGoogle} className="px-6 py-3 bg-white/20 backdrop-blur-md border-2 border-black rounded-lg shadow-lg hover:bg-white/30 hover:shadow-xl transition-all duration-200 ease-in-out text-black font-medium">
        Get Started
        
      </button>
    </div>
  );
}
