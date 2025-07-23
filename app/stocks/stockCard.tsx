import React, { useState, useEffect } from "react";
import db from '@/firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';
import { auth } from '@/firebase/clientApp';

export default function StockCard({ symbol }: { symbol: string }) {
  const [buyButton, setBuyButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(0);
  const [currentStock, setCurrentStock] = useState({
    symbol: symbol,
    price: 0,
    change: 0,
    changePercent: 0,
  });

  const user = auth.currentUser;
  const uid = user?.uid;

  // Fix: Only add to Firebase when buy button is actually clicked
  const handleBuyStock = async () => {
    if (!uid || !currentStock.symbol) return;
    
    try {
      const docRef = await addDoc(collection(db, `users/${uid}/stocks`), {
        symbol: currentStock.symbol,
        price: currentStock.price,
        quantity: amount,
        purchaseDate: new Date(),
        totalCost: currentStock.price * amount
      });
      console.log("Stock purchased with ID: ", docRef.id);
      setBuyButton(true);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const getStocks = async () => {
    try {
      const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`);
      const data = await response.json();
      
      if (data.c && data.c !== 0) {
        setCurrentStock({
          symbol: symbol,
          price: data.c,
          change: data.d,
          changePercent: data.dp,
        });
      } else {
        throw new Error("Invalid stock symbol");
      }
      setLoading(false);
    } catch (error) {
      alert("Please enter a valid stock symbol");
      setCurrentStock({
        symbol: symbol,
        price: 0,
        change: 0,
        changePercent: 0,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (symbol) {
      setLoading(true);
      getStocks();
    }
  }, [symbol]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-2">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-2 text-gray-800">
        {currentStock.symbol}
      </h2>
      
      <div className="text-center mb-4">
        <p className="text-2xl font-semibold text-blue-600">
          ${currentStock.price.toFixed(2)}
        </p>
        <p className={`text-sm ${currentStock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {currentStock.change >= 0 ? '+' : ''}${currentStock.change.toFixed(2)} 
          ({currentStock.changePercent.toFixed(2)}%)
        </p>
      </div>

      <div>
        <input
          placeholder="Enter amount"
          className="border-2 border-gray-300 rounded-lg p-2 mb-4 w-full max-w-md"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>

      <button 
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold" 
        onClick={handleBuyStock}
        disabled={buyButton}
      >
        {buyButton ? 'Stock Purchased!' : 'Buy Stock'}
      </button>
      
      {buyButton && (
        <p className="mt-2 text-green-600 text-sm">✓ Stock added to your portfolio</p>
      )}
    </div>
  );
}
