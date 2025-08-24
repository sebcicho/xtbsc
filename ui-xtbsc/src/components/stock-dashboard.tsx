import React, { useEffect, useState } from 'react';
import { FinancialChart } from './financial-chart';
import { Card, CardBody, CardHeader, Input, Spinner } from '@heroui/react';
import { StockMetadata } from '../interfaces/stock-metadata';
import { ChartType } from '../interfaces/enums';

interface StockDashboardProps {
  type: string;
  limit: number;
}


export const StockDashboard: React.FC<StockDashboardProps> = ({type, limit}) => {

  const [data, setData] = useState<Array<StockMetadata>>([]);
  const [filteredData, setFilteredData] = useState<Array<StockMetadata>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');

  
  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
    filterData(event.target.value);
  };

  const filterData = (search?: string) => {
    console.log('search value: ', searchValue);
    if(search && search !== '') {
      const filData = data.filter((entry) => 
        entry.name.toLowerCase().includes(search.toLowerCase()) || 
        entry.symbol.toLowerCase().includes(search.toLowerCase()));
      
      setFilteredData(filData)
      console.log('setting filtered: ', filData.slice(0, limit));
    } else {
      console.log('setting all');
      setFilteredData(data.slice(0, limit));
    }
  }

  useEffect(() => {
  fetch(`http://localhost:8080/stock/metadata`)
    .then(response => response.json())
    .then(json => {
        const typesMap = json["typesMap"]; 
        const tickersFiltered: StockMetadata[] = [];
      Object.keys(typesMap).forEach(ticker => {
        const stockData = typesMap[ticker];
        
        if(stockData.type === type) {
            tickersFiltered.push({
                symbol: ticker,
                type: stockData.type,
                name: stockData.name,
            });
        }
      });
        const obtainedData = tickersFiltered;
        setData(obtainedData);
        setFilteredData(obtainedData.slice(0, limit));
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
              <div className='flex flex-col w-full'>
                <h2 className="text-2xl font-bold mb-8 text-foreground">{type} Dashboard</h2>
                <Input name='search' placeholder='Search 🔎︎' onChange={handleInputChange} ></Input>
              </div>
            </CardHeader>
            <CardBody>
                {loading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner />
            </div>
          ) : (
            // Display the dashboard content when isLoading is false
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredData.map((stock) => (

                <FinancialChart symbol={stock.symbol} chartType={ChartType.STOCK} title={`${stock.symbol} ${stock.name}`}/>

              ))}
            </div>
          )}
            </CardBody>
         </Card>
        
    </div>
  );
};




