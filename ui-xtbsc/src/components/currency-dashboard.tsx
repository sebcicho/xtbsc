import React, { useEffect, useState } from 'react';
import { FinancialChart } from './financial-chart';
import { Card, CardBody, CardHeader, Spinner } from '@heroui/react';
import { ChartType } from '../interfaces/enums';

interface CurrencyDashboardProps {
  limit: number;
}

export const CurrencyDashboard: React.FC<CurrencyDashboardProps> = ({limit}) => {

  const [data, setData] = useState<Array<string>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  fetch(`http://localhost:8080/currency/metadata`)
    .then(response => response.json())
    .then(json => {
        const currencies = json; 
        setData(currencies.slice(0, limit));
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
                <h2 className="text-2xl font-bold mb-8 text-foreground">Currencies Dashboard</h2>
            </CardHeader>
            <CardBody>
                {loading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner />
            </div>
          ) : (
            // Display the dashboard content when isLoading is false
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.map((currency) => (
                    <FinancialChart symbol={currency} chartType={ChartType.CURRENCY} title={`${currency} to USD`}/>
              ))}
            </div>
          )}
            </CardBody>
         </Card>
        
    </div>
  );
};