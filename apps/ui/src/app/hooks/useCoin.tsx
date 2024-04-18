import { useCallback, useRef, useState } from 'react';
import { CoinType } from '../pages/buy';
import bigDecimal from 'js-big-decimal';
interface coinProps {
  tokenPrice: number;
}
export const useCoin = ({ tokenPrice }: coinProps) => {
  const tokenRate = tokenPrice ? 1 / tokenPrice : 0;
  const [coinValuation] = useState<Record<CoinType, null | number>>({
    eth: 4001,
    usdt: 1,
    usdc: 1,
  });
  const convertCoin = useCallback(
    (value = '0', toTea: boolean, selectedCoin: CoinType): string | undefined => {
      if (coinValuation[selectedCoin] === null) return;
      if (value === 'NaN') {
        return '';
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const conversionRate = coinValuation[selectedCoin]! * tokenRate;
      return toTea ? bigDecimal.multiply(value, conversionRate) : bigDecimal.divide(value, conversionRate);
    },
    [coinValuation, tokenRate]
  );

  return { convertCoin, coinValuation, tokenRate: tokenRate };
};
