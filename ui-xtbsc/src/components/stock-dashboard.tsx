import React, { useEffect, useState } from 'react';
import { FinancialChart } from './financial-chart';
import { Card, CardBody, CardHeader, Input, Spinner } from '@heroui/react';
import { StockMetadata } from '../interfaces/stock-metadata';
import { ChartType } from '../interfaces/enums';
import { useDispatch } from 'react-redux';
import { setStockMetadata } from '../state/metadata-reducer';
import { useNavigate } from 'react-router-dom';

interface StockDashboardProps {
  type: string;
  limit: number;
}


export const StockDashboard: React.FC<StockDashboardProps> = ({type, limit}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
        dispatch(setStockMetadata(obtainedData));
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
                <span className='flex mb-8'>{type === 'ETF' ? 
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                  </svg>
                  : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                  </svg>
                  } <h2 className="text-2xl font-bold  text-foreground -mt-1">{type === 'ETF' ? 'ETF' : 'Stock'} Dashboard</h2>
                </span>
                
                <Input name='search' placeholder='Search 🔎︎' onChange={handleInputChange} ></Input>
              </div>
            </CardHeader>
            <CardBody>
                {loading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredData.map((stock) => (
                <div
                  key={stock.symbol}
                  className="cursor-pointer"
                  onClick={() => navigate(`/asset/${stock.symbol}`)}
                >
                <FinancialChart symbol={stock.symbol} chartType={ChartType.STOCK} title={`${stock.symbol} ${stock.name}`}/>

              </div>
              ))}
            </div>
          )}
            </CardBody>
         </Card>
        
    </div>
  );
};




