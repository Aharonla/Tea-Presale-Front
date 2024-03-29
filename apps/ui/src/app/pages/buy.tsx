import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SlCard, SlSelect, SlOption, SlIcon, SlButton, SlAlert } from '@shoelace-style/shoelace/dist/react';
import { useMetaMaskContext } from '../context/metamask.context';
import tetherIcon from '../../assets/icons/tether.svg';
import usdcIcon from '../../assets/icons/usd-coin-usdc-logo.svg';
import ethereumIcon from '../../assets/icons/ethereum.svg';
import { CoinInput } from '../components/coin-input';
import { useCoin } from '../hooks/useCoin';
import { TokenRate } from '../components/token-rate';
import teaToken from '../../assets/icons/tea-token.svg';
import { Countdown } from '../components/countdown';
import { enterPersale, getTokenAllowance, setTokenApprove } from '../utils/presale';
import { PRESALE_CONTRACT_ADDRESS, USDC } from '../utils/constants';

const mappedCoins = {
  eth: { icon: ethereumIcon, label: 'ETH', value: 'eth' },
  usdt: { icon: tetherIcon, label: 'USDT', value: 'usdt' },
  usdc: { icon: usdcIcon, label: 'USDC', value: 'usdc' },
};
export type CoinType = keyof typeof mappedCoins;
const coins: CoinType[] = ['usdc', 'usdt'];
export const Buy = () => {
  const lastInputTouched = useRef<'tea' | 'coin' | null>(null);
  const eventModalRef = useRef<any>(null);
  const [selectedCoin, setSelectedCoin] = useState<CoinType>('usdc');
  const [amount, setAmount] = useState<number>();
  const [amountInTea, setAmountInTea] = useState<number>();
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventType, setEventType] = useState<string>('primary');
  const { balance, account } = useMetaMaskContext();
  const { convertCoin, coinValuation } = useCoin();
  const [tokenAllowance, setAllowance] = useState<number>(0);

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

  const getAllowance = async () => {
    if (account) {
      const allowance = await getTokenAllowance(USDC, account, PRESALE_CONTRACT_ADDRESS);
      setAllowance(Number(allowance));
      return Number(allowance);
    } else {
      return 0;
    }
  };

  useEffect(() => {
    getAllowance();
  }, [getAllowance]);

  const handleContractResponse = (response: any) => {
    if (response.status === 'SUCCESS') {
      setEventTitle('Transaction approved!');
      setEventType('success');
    } else {
      setEventTitle(response.message);
      setEventType('error');
    }
    eventModalRef.current?.show();
  };

  const handleApprove = async () => {
    try {
      if (!amount) {
        return;
      }
      setEventTitle('Waiting for transaction approval...');
      eventModalRef.current?.show();
      const res = await setTokenApprove(USDC, PRESALE_CONTRACT_ADDRESS, amount);
      handleContractResponse(res);
    } catch (err: any) {
      setEventType('error');
      setEventTitle(err.message);
      eventModalRef.current?.show();
    }
  };
  const enterPresale = async () => {
    try {
      if (!amount) {
        return;
      }
      setEventTitle('Waiting for transaction approval...');
      eventModalRef.current?.show();
      const res = await enterPersale(amount, 1);
      handleContractResponse(res);
      eventModalRef.current?.show();
    } catch (err: any) {
      setEventType('error');
      setEventTitle(err.message);
      eventModalRef.current?.show();
    }
  };

  const handleBuyButtonAction = async () => {
    // will check approvance
    if (account && amount !== undefined) {
      const allowance = await getAllowance();
      if (Number(allowance) < amount) {
        await handleApprove();
      } else {
        await enterPresale();
      }
    }
  };

  return (
    <div className="buy page">
      <SlAlert variant="primary" duration={3000} ref={eventModalRef} className="alert">
        {eventType === 'error' && <SlIcon slot="icon" name="exclamation-triangle" />}
        {eventType === 'primary' && <SlIcon slot="icon" name="info-circle" />}
        {eventType === 'success' && <SlIcon slot="icon" name="check2-circle" />}
        {eventTitle}
      </SlAlert>
      <TokenRate />
      <SlCard className="card">
        <SlCard className="card__inner">
          <SlSelect
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
      <SlButton onClick={handleBuyButtonAction} disabled={buyButtonDisabled} variant="primary" className="buy__btn">
        {tokenAllowance >= (amount || 0) ? 'BUY TEA' : 'Approve'}
      </SlButton>
    </div>
  );
};
