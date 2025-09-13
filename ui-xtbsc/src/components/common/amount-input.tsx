import React from 'react';
import { NumberInput, NumberInputProps } from '@heroui/react';

type AmountInputProps = Omit<NumberInputProps, "children"> & {
  label?: string;
};

export const AmountInput: React.FC<AmountInputProps> = ({
    label = "Amount",
    ...props
}) => {
    
  return (
    <NumberInput
        isRequired
        classNames={{
            innerWrapper: "bg-gray-950 text-white",
            mainWrapper: "bg-gray-950 text-white",

        }}
        label={label}
        placeholder="Enter the amount"
        variant="bordered"
        validate={(value) => {
            if (value <= 0) {
                return "Enter number greater than 0";
            }
        }}
        {...props}
    />
  );
}