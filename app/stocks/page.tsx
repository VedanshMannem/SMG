"use client";

import React from "react";
import StockCard from "./stockCard";
import { auth } from '@/firebase/clientApp';

export default function StocksPage() {
  const user = auth.currentUser;
  const [searchButton, setSearchButton] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleSearch = () => {
    if (inputValue.trim()) {
      setSearchButton(true);
    }
  };

  return user ? (

    <div className="p-6 min-h-screen bg-gray-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="flex flex-col items-center space-y-4">
        <input
          placeholder="Enter a stock symbol"
          className="border-2 border-gray-300 rounded-lg p-2 mb-4 w-full max-w-md"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value.toUpperCase())}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2 mb-4 transition-colors"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {searchButton && inputValue && (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">Stock Information</h1>
          <StockCard symbol={inputValue} />
        </div>
      )}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Please Sign In to View Stocks</h1>
      <p className="text-lg">You need to be logged in to access stock information.</p>
    </div>
  );
}
