"use client";

import React from "react";
import { useState, useEffect } from 'react';
import db from '@/firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { auth } from '@/firebase/clientApp';
import { stockCache, PortfolioHolding, PortfolioSummary } from '../utils/stockCache';

interface Stock {
  id: string;
  symbol: string;
  price: number;
  quantity?: number;
  totalCost?: number;
  purchaseDate?: any;
  averagePrice?: number;
}

export default function ProfilePage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const user = auth.currentUser;
  const uid = user?.uid;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthLoading(false);
      } else {
        setAuthLoading(true);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchStocks = async () => {
      if (uid) {
        try {
          setLoading(true);
          const stocksCollection = collection(db, `users/${uid}/stocks/`);
          const stocksSnapshot = await getDocs(stocksCollection);
          const stocksList = stocksSnapshot.docs.map(doc => ({
            id: doc.id,
            symbol: doc.data().symbol || '',
            price: doc.data().price || 0,
            quantity: doc.data().quantity || 1,
            totalCost: doc.data().totalCost || 0,
            purchaseDate: doc.data().purchaseDate,
            averagePrice: doc.data().averagePrice || doc.data().price || 0,
            ...doc.data()
          })) as Stock[];
          
          setStocks(stocksList);
          
          // Convert stocks to PortfolioHolding objects for summary calculation
          const holdings: PortfolioHolding[] = stocksList.map(stock => ({
            symbol: stock.symbol,
            quantity: stock.quantity || 1,
            averagePrice: stock.averagePrice || stock.price || 0,
            totalCost: stock.totalCost || (stock.price * (stock.quantity || 1)),
            purchaseDate: stock.purchaseDate
          }));
          
          // Calculate portfolio summary using the cache
          const summary = await stockCache.calculatePortfolioSummary(holdings);
          setPortfolioSummary(summary);
          
          
        } catch (error) {
          console.error("Error fetching stocks:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchStocks();
  }, [uid]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading your portfolio...</p>
      </div>
    );
  }

  return (
    <div className="p-30 min-h-screen bg-gray-50 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Your Portfolio</h1>
          
          {portfolioSummary && (
            <>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-600 mb-2">Portfolio Value</h2>
                  <p className="text-3xl font-bold text-blue-600">${portfolioSummary.totalValue.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-600 mb-2">Total Gain/Loss</h2>
                  <p className={`text-3xl font-bold ${portfolioSummary.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${portfolioSummary.totalGainLoss >= 0 ? '+' : ''}${portfolioSummary.totalGainLoss.toFixed(2)}
                  </p>
                  <p className={`text-sm ${portfolioSummary.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ({portfolioSummary.totalGainLoss >= 0 ? '+' : ''}{portfolioSummary.totalGainLossPercent.toFixed(2)}%)
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-600 mb-2">Total Investment</h2>
                  <p className="text-3xl font-bold text-gray-700">${portfolioSummary.totalCost.toFixed(2)}</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Stocks</h2>
          
          {stocks.length > 0 ? (
            <div className="grid gap-4">
              {stocks.map((stock, index) => (
                <div key={stock.id || index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {stock.symbol}
                      </h3>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-gray-600">Purchase Price</p>
                          <p className="text-lg font-semibold text-blue-600">
                            ${stock.price ? stock.price.toFixed(2) : '0.00'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Quantity</p>
                          <p className="text-lg font-semibold text-gray-700">
                            {stock.quantity || 1}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Cost</p>
                          <p className="text-lg font-semibold text-green-600">
                            ${stock.totalCost ? stock.totalCost.toFixed(2) : (stock.price || 0).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Purchase Date</p>
                          <p className="text-sm text-gray-700">
                            {stock.purchaseDate ? new Date(stock.purchaseDate.seconds * 1000).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-lg p-8">
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No stocks in your portfolio</h3>
                <p className="text-gray-500 mb-4">Start building your portfolio by purchasing some stocks!</p>
                <button 
                  onClick={() => window.location.href = '/stocks'}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                >
                  Browse Stocks
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
