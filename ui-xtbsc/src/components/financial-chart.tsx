import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { mapStockData } from '../mappers/stock-data.mapper';
import { Card, CardBody, CardHeader, Spinner } from '@heroui/react';
import { DataPoint } from '../interfaces/data-point';
import { calculateTrend } from '../utils/trend-calculator';
import { ChartType, Trend } from '../interfaces/enums';
import { getColor } from '../utils/trend-color-util';

interface FinancialChartProps {
  symbol: string;
  chartType: ChartType;
  title: string
}

export const FinancialChart: React.FC<FinancialChartProps> = ({ symbol, chartType, title }) => {

  const [data, setData] = useState<Array<DataPoint>>([]);
  const [trend, setTrend] = useState<Trend>();
  const [color, setColor] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  fetch(`http://localhost:8080/${chartType === ChartType.STOCK ? 'stock' : 'currency'}/data?symbol=${symbol}`)
    .then(response => response.json())
    .then(json => {
        const mappedData = mapStockData(json, symbol);
        setData(mappedData);
        setTrend(calculateTrend(mappedData, symbol));
        setColor(getColor(calculateTrend(mappedData, symbol)));
        setLoading(false);
      })
    .catch(error => {
      console.error('There was an error!', error);
      setLoading(false);
    });
}, []);

  return (
    <Card key={symbol} className="col-span-1">
      <CardHeader>
        <h3 className="text-1xl font-semibold"> {title}</h3>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={400}>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner />
            </div>
          ) : (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2c" />
              <XAxis dataKey="date" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
              <defs>
                <linearGradient id={`color-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>

              </defs>
              <Area type="monotone" dataKey={symbol} stroke={color} fillOpacity={1} fill={`url(#color-${symbol})`} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};