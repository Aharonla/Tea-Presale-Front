import { useCallback, useRef, useState } from 'react';
import { CoinType } from '../pages/buy';

export const useCoin = () => {
  const tokenRate = useRef(1 / 0.07);
  const [coinValuation] = useState<Record<CoinType, null | number>>({
    eth: 4001,
    usdt: 1,
    usdc: 1,
  });
  const convertCoin = useCallback(
    (value = 0, toTea: boolean, selectedCoin: CoinType): number | undefined => {
      if (coinValuation[selectedCoin] === null) return;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const conversionRate = coinValuation[selectedCoin]! * tokenRate.current;

      return toTea ? value * conversionRate : value / conversionRate;
    },
    [coinValuation]
  );

  return { convertCoin, coinValuation, tokenRate: tokenRate.current };
};
