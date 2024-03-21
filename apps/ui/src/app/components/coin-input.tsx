import React from 'react';
import { SlInput } from '@shoelace-style/shoelace/dist/react';
import { ComponentProps } from 'react';

type Props = {
  onChangeValue: (amount: number) => void;
  decimals: 9 | 18;
} & ComponentProps<typeof SlInput>
export const CoinInput = ({ valueAsNumber, onChangeValue, decimals, ...props }: Props) => {
  const formattedValueAsNumber = +(Number(valueAsNumber).toFixed(decimals));
  return (
    <SlInput
      className="amount__input"
      type="number"
      noSpinButtons
      autocomplete="off"
      valueAsNumber={formattedValueAsNumber ?? undefined}
      placeholder={'0.00'}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.currentTarget.blur();
        }
      }}
      onSlInput={(e) => {
        const amount = parseFloat((e.target as HTMLInputElement).value);
        onChangeValue(amount);
      }}
      inputmode="decimal"
      enterkeyhint="done"
      pattern="[0-9]*"
      {...props}
    />
  );
};
