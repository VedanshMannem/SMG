import React, { useState, useEffect } from "react";
import db from '@/firebase/firestore';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { auth } from '@/firebase/clientApp';
import { stockCache } from '../utils/stockCache';

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

  const handleBuyStock = async () => {
    if (!uid || !currentStock.symbol || amount <= 0) return;
    
    try {
      const stocksCollection = collection(db, `users/${uid}/stocks`);
      const q = query(stocksCollection, where("symbol", "==", currentStock.symbol));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const existingDoc = querySnapshot.docs[0];
        const existingData = existingDoc.data();
        
        const newQuantity = (existingData.quantity || 0) + amount;
        const newTotalCost = (existingData.totalCost || 0) + (currentStock.price * amount);
        const averagePrice = newTotalCost / newQuantity;

        await updateDoc(doc(db, `users/${uid}/stocks`, existingDoc.id), {
          quantity: newQuantity,
          totalCost: newTotalCost,
          averagePrice: averagePrice,
          lastPurchaseDate: new Date(),
          lastPurchasePrice: currentStock.price
        });
        
        console.log("Stock holding updated for:", currentStock.symbol);
      } else {
        await addDoc(collection(db, `users/${uid}/stocks`), {
          symbol: currentStock.symbol,
          price: currentStock.price,
          quantity: amount,
          purchaseDate: new Date(),
          totalCost: currentStock.price * amount,
          averagePrice: currentStock.price
        });
        
        console.log("New stock purchased:", currentStock.symbol);
      }
      
      setBuyButton(true);
      setAmount(0);
    } catch (error) {
      console.error("Error processing stock purchase: ", error);
    }
  };

  const getStocks = async () => {
    try {
      const stockData = await stockCache.getStockData(symbol);
      
      if (stockData) {
        setCurrentStock({
          symbol: stockData.symbol,
          price: stockData.price,
          change: stockData.change,
          changePercent: stockData.changePercent,
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
      <div className="flex items-center justify-between w-full mb-2">
        <h2 className="text-3xl font-bold text-gray-800">
          {currentStock.symbol}
        </h2>
        <button 
          onClick={() => {
            setLoading(true);
            stockCache.refreshStock(symbol).then(() => getStocks());
          }}
          className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
          title="Refresh stock data"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        </button>
      </div>
      
      <div className="text-center mb-4">
        <p className="text-2xl font-semibold text-blue-600">
          ${currentStock.price.toFixed(2)}
        </p>
        <p className={`text-sm ${currentStock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {currentStock.change >= 0 ? '+' : ''}${currentStock.change.toFixed(2)} 
          ({currentStock.changePercent.toFixed(2)}%)
        </p>
      </div>

      <div className="w-full mb-4">
        <input
          placeholder="Enter number of shares"
          className="border-2 border-gray-300 rounded-lg p-2 w-full text-center"
          type="number"
          min="1"
          value={amount || ''}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        {amount > 0 && (
          <p className="text-sm text-gray-600 mt-1 text-center">
            Total: ${(currentStock.price * amount).toFixed(2)}
          </p>
        )}
      </div>

      <button 
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed" 
        onClick={handleBuyStock}
        disabled={buyButton || amount <= 0}
      >
        {buyButton ? 'Stock Purchased!' : amount > 0 ? `Buy ${amount} Share${amount > 1 ? 's' : ''}` : 'Enter Amount'}
      </button>
      
      
      {buyButton && (
        <p className="mt-2 text-green-600 text-sm">✓ Stock added to your portfolio</p>
      )}
    </div>
  );
}
