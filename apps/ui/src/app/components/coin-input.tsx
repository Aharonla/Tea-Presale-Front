import { SlInput } from '@shoelace-style/shoelace/dist/react';
import { ComponentProps } from 'react';

type Props = {
  onChangeValue: (amount: string) => void;
  decimals: number;
} & ComponentProps<typeof SlInput>;
export const CoinInput = ({ value, onChangeValue, decimals, ...props }: Props) => {
  const formattedValueAsNumber = +Number(value).toFixed(decimals);
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
        onChangeValue(String(amount));
      }}
      inputmode="decimal"
      enterkeyhint="done"
      pattern="[0-9]*"
      {...props}
    />
  );
};
