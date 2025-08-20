import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { mapStockData } from '../mappers/stock-data.mapper';


interface StockChartProps {
  symbol: string;
}

export const StockChart: React.FC<StockChartProps> = ({ symbol }) => {

  const [data, setData] = useState<Array<object>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  fetch(`http://localhost:8080/stock/data?symbol=${symbol}`)
    .then(response => response.json())
    .then(json => {
        const mappedData = mapStockData(json, symbol);
        setData(mappedData);
        setLoading(false);
      })
    .catch(error => {
      console.error('There was an error!', error);
      setLoading(false);
    });
}, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2c" />
        <XAxis dataKey="date" stroke="#888888" />
        <YAxis stroke="#888888" />
        <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
        <Legend/>
        <defs>
          <linearGradient id="colorAAPL" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
          </linearGradient>

        </defs>
        <Area type="monotone" dataKey={symbol} stroke="#8884d8" fillOpacity={1} fill="url(#colorAAPL)" />
         </AreaChart>
    </ResponsiveContainer>
  );
};