import React, { useEffect, useState } from 'react';
import { StockChart } from './stock-chart';
import { Card, CardBody, CardHeader } from '@heroui/react';
import { StockMetadata } from '../interfaces/stock-metadata';

interface StockDashboardProps {
  type: string;
  limit: number;
}


export const StockDashboard: React.FC<StockDashboardProps> = ({type, limit}) => {

  const [data, setData] = useState<Array<StockMetadata>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  fetch(`http://localhost:8080/stock/metadata`)
    .then(response => response.json())
    .then(json => {
        const typesMap = json["typesMap"]; 
        const tickersFiltered: StockMetadata[] = [];
      // Iterate over the keys of the object
      Object.keys(typesMap).forEach(ticker => {
        // Access the stock data using the ticker
        const stockData = typesMap[ticker];
        if(stockData.type === type) {
            tickersFiltered.push({
                symbol: ticker,
                type: stockData.type,
                name: stockData.name,
            });
        }
      });
        setData(tickersFiltered.slice(0, limit));
        setLoading(false);
      })
    .catch(error => {
      console.error('There was an error!', error);
      setLoading(false);
    });
}, []);

  return (
    <div>
         <Card>
            <CardHeader>
                <h2 className="text-2xl font-bold mb-8 text-foreground">{type} Dashboard</h2>
            </CardHeader>
            <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.map((stock) => (
                    <Card key={stock.symbol} className="col-span-1">
                        <CardHeader>
                            <h3 className="text-1xl font-semibold"> {stock.symbol} {stock.name}</h3>
                        </CardHeader>
                        <CardBody>
                        <StockChart symbol={stock.symbol} />
                        </CardBody>
                    </Card>
                    ))}
                </div>
            </CardBody>
         </Card>
        
    </div>
  );
};




