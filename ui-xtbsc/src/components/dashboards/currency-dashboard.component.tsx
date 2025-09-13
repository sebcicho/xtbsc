import React, { useEffect, useState } from 'react';
import { FinancialChart } from '../common/financial-chart.component';
import { Card, CardBody, CardHeader, Input, Spinner } from '@heroui/react';
import { ChartType } from '../../interfaces/enums';
import { useNavigate } from 'react-router-dom';
import { setCurrencyMetadata } from '../../state/metadata-reducer';
import { useDispatch } from 'react-redux';

interface CurrencyDashboardProps {
  limit: number;
}

export const CurrencyDashboard: React.FC<CurrencyDashboardProps> = ({limit}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        dispatch(setCurrencyMetadata(obtainedData));
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
                <span className='flex mb-8'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 1 0 0 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>

                  <h2 className="text-2xl font-bold text-foreground -mt-1">Currencies Dashboard</h2>
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
              {filteredData.map((currency) => (
                <div key={currency} className="cursor-pointer" onClick={() => navigate(`/asset/${currency}`)}>
                    <FinancialChart symbol={currency} chartType={ChartType.CURRENCY} title={`${currency} to USD`}/>
              </div>
              ))}
            </div>
          )}
            </CardBody>
         </Card>
        
    </div>
  );
};