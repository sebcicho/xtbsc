import React, { useEffect, useState } from 'react';
import { FinancialChart } from './financial-chart';
import { Card, CardBody, CardHeader, Input, Spinner } from '@heroui/react';
import { ChartType } from '../interfaces/enums';

interface CurrencyDashboardProps {
  limit: number;
}

export const CurrencyDashboard: React.FC<CurrencyDashboardProps> = ({limit}) => {

  const [data, setData] = useState<Array<string>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [filteredData, setFilteredData] = useState<Array<string>>([]);

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
    filterData(event.target.value);
  };

  const filterData = (search?: string) => {
    console.log('search value: ', searchValue);
    if(search && search !== '') {
      const filData = data.filter((entry) => entry.toLowerCase().includes(search.toLowerCase()));
      setFilteredData(filData.slice(0, limit))
    } else {
      setFilteredData(data.slice(0, limit));
    }
  }

  useEffect(() => {
  fetch(`http://localhost:8080/currency/metadata`)
    .then(response => response.json())
    .then(json => {
        const currencies = json;
        const obtainedData = currencies;
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
                 <h2 className="text-2xl font-bold mb-8 text-foreground">Currencies Dashboard</h2>
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
              {filteredData.map((currency) => (
                    <FinancialChart symbol={currency} chartType={ChartType.CURRENCY} title={`${currency} to USD`}/>
              ))}
            </div>
          )}
            </CardBody>
         </Card>
        
    </div>
  );
};