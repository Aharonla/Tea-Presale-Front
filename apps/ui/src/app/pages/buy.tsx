import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SlCard, SlSelect, SlOption, SlIcon, SlButton } from '@shoelace-style/shoelace/dist/react';
import tetherIcon from '../../assets/icons/tether.svg';
import ethereumIcon from '../../assets/icons/ethereum.svg';
import { CoinInput } from '../components/coin-input';
import { useCoin } from '../hooks/useCoin';
import { TokenRate } from '../components/token-rate';
import teaToken from '../../assets/icons/tea-token.svg';
import { Countdown } from '../components/countdown';
import { VerticalLine } from '../components/vertical-line';
import { useAccount, useBalance, useReadContracts } from 'wagmi';
import { erc20Abi } from 'viem';
import { formatUnits } from 'viem';
import { getBalance } from '@wagmi/core';
const mappedCoins = {
  eth: { icon: ethereumIcon, label: 'ETH', value: 'eth' },
  usdt: { icon: tetherIcon, label: 'USD₮', value: 'usdt' },
};
export type CoinType = keyof typeof mappedCoins;
const coins: CoinType[] = ['eth', 'usdt'];
export const Buy = () => {
  const lastInputTouched = useRef<'noti' | 'coin' | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<CoinType>('usdt');
  const [amount, setAmount] = useState<number>();
  const [amountInNoti, setAmountInNoti] = useState<number>();
  const { convertCoin, coinValuation } = useCoin();
  const [balances, setBalances] = useState([]);
  const { address, isConnected } = useAccount();

  const res = useBalance({ address });
  const balance = res.data?.value ? formatUnits(res.data!.value, res.data!.decimals) : '--';
  console.log(balance);

  const updateValueOfLastTouchedInput = useCallback(() => {
    if (lastInputTouched.current === 'noti') {
      setAmount(() => convertCoin(amountInNoti, false, selectedCoin));
    } else if (lastInputTouched.current === 'coin') {
      setAmountInNoti(() => convertCoin(amount, true, selectedCoin));
    }
  }, [amount, amountInNoti, convertCoin, selectedCoin]);

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

  useEffect(() => {
    // will fetch all the balances
    const fetchBalances = async () => {
      const ethBlance = await getBalance({ address });
    };
  }, [isConnected]);
  return (
    <div className="buy page">
      <TokenRate />
      <SlCard className="card">
        {/* <h2 slot="header">Buy</h2> */}
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
            <img className="coin-icon" slot="prefix" src={mappedCoins[selectedCoin]?.icon} alt="Ethereum" />
            {coins
              .map((key) => mappedCoins[key])
              .map(({ icon, label, value }) => (
                <SlOption value={value} key={value}>
                  <img className="coin-icon" slot="prefix" src={icon} alt="Ethereum" />
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
                setAmountInNoti(convertCoin(value, true, selectedCoin));
              }}
            />
          </div>
          <SlIcon name="arrow-down-circle-fill" className="convert-icon" />
        </SlCard>
        <SlCard className="card__inner noti">
          <SlSelect size="large" value="noti" className="select-coin" disabled>
            <img src={teaToken} alt="TEA" slot="prefix" className="coin-icon" />
            <SlOption value="noti">TEA</SlOption>
          </SlSelect>
          <div className="amount">
            <CoinInput
              valueAsNumber={amountInNoti}
              decimals={9}
              onChangeValue={(value) => {
                lastInputTouched.current = 'noti';
                setAmount(convertCoin(value, false, selectedCoin));
                setAmountInNoti(value);
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
