// app/page.tsx
"use client";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/clientApp";
import { loginWithGoogle } from "@/firebase/firebaseAuth";
import { useRouter } from "next/navigation";
import React from "react";
import db from '@/firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      
      <div className="flex flex-col items-center justify-center pt-16 pb-12">
        <div className="text-center max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6 text-gray-800">
            Welcome back, <span className="text-blue-600">{user.displayName?.split(' ')[0]}</span>!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Ready to continue your trading journey? Explore stocks, manage your portfolio, and track your progress.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/stocks')}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 text-lg font-semibold"
            >
              📈 Browse Stocks
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="px-8 py-4 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 hover:shadow-xl transition-all duration-200 text-lg font-semibold"
            >
              💼 View Portfolio
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Your Trading Dashboard</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Quick Trade</h3>
            </div>
            <p className="text-gray-600 mb-4">Search and trade stocks instantly with real-time market data.</p>
            <button 
              onClick={() => router.push('/stocks')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Start Trading →
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Portfolio</h3>
            </div>
            <p className="text-gray-600 mb-4">Monitor your investments and track performance over time.</p>
            <button 
              onClick={() => router.push('/profile')}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              View Portfolio →
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Account Settings</h2>
            <p className="text-lg text-gray-600 mb-6">
              Customize your trading experience and manage your account preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                🔔 Notifications
              </button>
              <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                🎨 Theme
              </button>
              <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                👤 Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex flex-col items-center justify-center pt-20 pb-16">
        <h1 className="text-6xl font-bold mb-6 text-center text-gray-800">
          Play and learn about Wall Street <br /> 
          <span className="text-blue-600">without risking real money.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 text-center max-w-2xl">
          Master the art of stock trading with real-time data in a risk-free environment
        </p>
        <button 
          onClick={loginWithGoogle} 
          className="px-8 py-4 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 ease-in-out text-lg font-semibold"
        >
          Get Started Free
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Why Choose Our Platform?</h2>
        
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200"></div>
          
          <div className="relative flex items-start mb-12">
            <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center z-10">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div className="ml-6 bg-white rounded-lg shadow-md p-6 flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Real-Time Stock Data</h3>
              <p className="text-gray-600">Trade with live market data from major exchanges. Experience real market conditions without the real risk.</p>
            </div>
          </div>

          <div className="relative flex items-start mb-12">
            <div className="flex-shrink-0 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center z-10">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div className="ml-6 bg-white rounded-lg shadow-md p-6 flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Portfolio Management</h3>
              <p className="text-gray-600">Track your investments, monitor performance, and analyze your trading patterns with comprehensive portfolio tools.</p>
            </div>
          </div>

          <div className="relative flex items-start mb-12">
            <div className="flex-shrink-0 w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center z-10">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <div className="ml-6 bg-white rounded-lg shadow-md p-6 flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Learn as You Trade</h3>
              <p className="text-gray-600">Build your financial knowledge through hands-on experience. Perfect for beginners and experienced traders alike.</p>
            </div>
          </div>

          <div className="relative flex items-start mb-12">
            <div className="flex-shrink-0 w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center z-10">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div className="ml-6 bg-white rounded-lg shadow-md p-6 flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Risk-Free Environment</h3>
              <p className="text-gray-600">Make mistakes, learn strategies, and build confidence without losing a single dollar of real money.</p>
            </div>
          </div>

          <div className="relative flex items-start">
            <div className="flex-shrink-0 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center z-10">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <div className="ml-6 bg-white rounded-lg shadow-md p-6 flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Performance Analytics</h3>
              <p className="text-gray-600">Detailed insights into your trading performance with charts, metrics, and personalized recommendations.</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Start Your Trading Journey?</h3>
          <button 
            onClick={loginWithGoogle} 
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:px-10 hover:py-5 transition-all duration-200 ease-in-out text-lg font-semibold"
          >
            Sign Up Now - It's Free!
          </button>
        </div>
      </div>
    </div>
  );
}
