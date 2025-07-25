"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/clientApp";
import { loginWithGoogle, logout } from "@/firebase/firebaseAuth";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handleStocksClick = () => {
    router.push('/stocks');
  };

  const handleSettingsClick = () => {
    router.push('/settings');
  };

  const handleHomeClick = () => {
    router.push('/');
  };

  return user ? (
    <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl border-r border-gray-200 z-50">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Stock Market Game</h2>
          <p className="text-sm text-gray-500 mt-1">Welcome, {user.displayName?.split(' ')[0]}</p>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <button 
              onClick={handleHomeClick}
              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Home
            </button>

            <button 
              onClick={handleStocksClick}
              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Stocks
            </button>

            <button 
              onClick={handleProfileClick}
              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Portfolio
            </button>

            <button 
              onClick={handleSettingsClick}
              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200 flex items-center"
            >       
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Settings
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => {
              logout();
              router.push('/');
            }} 
            className="w-full px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="fixed top-0 left-0 right-0 z-50 mx-4">
      <div className="mt-4 rounded-2xl shadow-md bg-gray-100">
        <div className="flex justify-between items-center px-4 py-2">
          <button className="text-lg font-semibold" onClick={() => handleHomeClick()}>
            Stock Market Game
          </button>
          <button onClick={loginWithGoogle} className="px-4 py-2 text-black rounded-lg hover:bg-gray-600 hover:text-white transition-colors text-sm">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
