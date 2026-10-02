import React from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

interface CurrencyInputProps extends Omit<NumericFormatProps, 'value' | 'onValueChange'> {
  value: number | string | undefined;
  onValueChange: (value: number | string) => void;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onValueChange,
  className,
  ...props
}) => {
  return (
    <NumericFormat
      value={value}
      onValueChange={(values) => {
        onValueChange(values.floatValue === undefined ? '' : values.floatValue);
      }}
      thousandSeparator=","
      thousandsGroupStyle="lakh"
      prefix="₹"
      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${className || ''}`}
      allowNegative={false}
      {...props}
    />
  );
};
