import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { mapStockData } from '../mappers/stock-data.mapper';
import { Card, CardBody, CardHeader, Spinner } from '@heroui/react';
import { DataPoint } from '../interfaces/data-point';
import { calculatePercentage, calculateTrend } from '../utils/trend-calculator';
import { ChartType, Trend } from '../interfaces/enums';
import { getColor } from '../utils/trend-color-util';
import { TrendIndicator } from './trend-indicator.component';
import { useDispatch } from 'react-redux';
import { setCurrentData } from '../state/current-data-reducer';

interface FinancialChartProps {
  symbol: string;
  chartType: ChartType;
  title?: string
  soloMode?: boolean;
}

export const FinancialChart: React.FC<FinancialChartProps> = ({ symbol, chartType, title, soloMode }) => {
  const dispatch = useDispatch();

  const [data, setData] = useState<Array<DataPoint>>([]);
  const [trend, setTrend] = useState<Trend>();
  const [color, setColor] = useState<string>();
  const [percentage, setPercentage] = useState<number>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setData([]);

    fetch(`http://localhost:8080/${chartType === ChartType.STOCK ? 'stock' : 'currency'}/data?symbol=${symbol}`)
      .then(response => response.json())
      .then(json => {
        const mappedData = mapStockData(json, symbol);
        setData(mappedData);
        setTrend(calculateTrend(mappedData, symbol));
        setColor(getColor(calculateTrend(mappedData, symbol)));
        setPercentage(calculatePercentage(mappedData, symbol));
        setLoading(false);
        if(soloMode) {
          dispatch(setCurrentData(mappedData));
        }
      })
      .catch(error => {
        console.error('There was an error!', error);
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, [symbol, chartType]);

  return (
    <Card key={symbol} className="col-span-1">
      <CardHeader>
        <h3 className="text-1xl font-semibold mr-2">{title}</h3>
        <TrendIndicator value={percentage} trend={trend} color={color}></TrendIndicator>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={400}>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner />
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-40 text-red-500">
              {error}
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