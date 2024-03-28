import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SlCard, SlSelect, SlOption, SlIcon, SlButton } from '@shoelace-style/shoelace/dist/react';
import { useMetaMaskContext } from '../context/metamask.context';
import tetherIcon from '../../assets/icons/tether.svg';
import ethereumIcon from '../../assets/icons/ethereum.svg';
import { CoinInput } from '../components/coin-input';
import { useCoin } from '../hooks/useCoin';
import { TokenRate } from '../components/token-rate';
import teaToken from '../../assets/icons/tea-token.svg';
import { Countdown } from '../components/countdown';

const mappedCoins = {
  eth: { icon: ethereumIcon, label: 'ETH', value: 'eth' },
  usdt: { icon: tetherIcon, label: 'USDT', value: 'usdt' },
};
export type CoinType = keyof typeof mappedCoins;
const coins: CoinType[] = ['eth', 'usdt'];
export const Buy = () => {
  const lastInputTouched = useRef<'tea' | 'coin' | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<CoinType>('usdt');
  const [amount, setAmount] = useState<number>();
  const [amountInTea, setAmountInTea] = useState<number>();
  const { balance } = useMetaMaskContext();
  const { convertCoin, coinValuation } = useCoin();

  const updateValueOfLastTouchedInput = useCallback(() => {
    if (lastInputTouched.current === 'tea') {
      setAmount(() => convertCoin(amountInTea, false, selectedCoin));
    } else if (lastInputTouched.current === 'coin') {
      setAmountInTea(() => convertCoin(amount, true, selectedCoin));
    }
  }, [amount, amountInTea, convertCoin, selectedCoin]);

  const formattedBalance = useMemo(() => {
    if (balance[selectedCoin] === null) {
      return '--';
    }
    return `Balance: ${balance[selectedCoin]} ${mappedCoins[selectedCoin]?.label}`;
  }, [balance, selectedCoin]);

  const buyButtonDisabled = useMemo(() => {
    return !amount || balance[selectedCoin] === null || coinValuation[selectedCoin] === null;
  }, [amount, balance, coinValuation, selectedCoin]);

  useEffect(() => {
    updateValueOfLastTouchedInput();
  }, [updateValueOfLastTouchedInput]);

  return (
    <div className="buy page">
      <TokenRate />
      <SlCard className="card">
        <SlCard className="card__inner">
          <SlSelect
            disabled={true} // disabled for now -- only usdt is available
            size="large"
            value={selectedCoin}
            onSlInput={(e) => {
              setSelectedCoin((e.target as HTMLSelectElement).value as CoinType);
              updateValueOfLastTouchedInput();
            }}
            className="select-coin"
          >
            <img className="coin-icon" slot="prefix" src={mappedCoins[selectedCoin]?.icon} alt="Tether" />
            {coins
              .map((key) => mappedCoins[key])
              .map(({ icon, label, value }) => (
                <SlOption value={value} key={value}>
                  <img className="coin-icon" slot="prefix" src={icon} alt="Tether" />
                  {label}
                </SlOption>
              ))}
          </SlSelect>
          <div className="amount">
            <small className="amount__balance">{formattedBalance}</small>
            <CoinInput
              valueAsNumber={amount}
              decimals={18}
              onChangeValue={(value) => {
                lastInputTouched.current = 'coin';
                setAmount(value);
                setAmountInTea(convertCoin(value, true, selectedCoin));
              }}
            />
          </div>
          <SlIcon name="arrow-down-circle-fill" className="convert-icon" />
        </SlCard>
        <SlCard className="card__inner tea">
          <SlSelect size="large" value="tea" className="select-coin" disabled>
            <img src={teaToken} alt="Tea" slot="prefix" className="coin-icon" />
            <SlOption value="tea">TEA</SlOption>
          </SlSelect>
          <div className="amount">
            <CoinInput
              valueAsNumber={amountInTea}
              decimals={9}
              onChangeValue={(value) => {
                lastInputTouched.current = 'tea';
                setAmount(convertCoin(value, false, selectedCoin));
                setAmountInTea(value);
              }}
            />
          </div>
        </SlCard>
      </SlCard>
      <SlButton disabled={buyButtonDisabled} variant="primary" className="buy__btn">
        BUY TEA
      </SlButton>
    </div>
  );
};
