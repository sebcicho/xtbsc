import React from 'react';
import { SelectItem, Select, SelectProps } from '@heroui/react';
import { currenciesMap } from '../../interfaces/currencies-map';

type SelectCurrencyProps = Omit<SelectProps, "children">;


export const SelectCurrency: React.FC<SelectCurrencyProps> = (props) => {
    
  return (
    <Select
        isRequired 
        variant="bordered"
        classNames={{
            trigger: "text-white bg-gray-950",
            value: "text-white bg-gray-950 group-data-[has-value=true]:!text-white",
            popoverContent: "bg-gray-950 text-white",
            listbox: "bg-gray-950 text-white",
            innerWrapper: "bg-gray-950 text-white",
            mainWrapper: "bg-gray-950 text-white",

        }}
        label="Currency" placeholder="Select a currency"
        {...props}
        >
        {Object.entries(currenciesMap).map(([key, ]) => (
            <SelectItem
                key={key}>{key}</SelectItem>
        ))}
    </Select>
  );
};