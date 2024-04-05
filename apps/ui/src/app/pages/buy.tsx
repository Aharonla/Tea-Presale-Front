import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SlCard, SlSelect, SlOption, SlIcon, SlButton, SlAlert } from '@shoelace-style/shoelace/dist/react';
import { useMetaMaskContext } from '../context/metamask.context';
import tetherIcon from '../../assets/icons/tether.svg';
import usdcIcon from '../../assets/icons/usd-coin-usdc-logo.svg';
import ethereumIcon from '../../assets/icons/ethereum.svg';
import { CoinInput } from '../components/coin-input';
import { useCoin } from '../hooks/useCoin';
import { TokenRate } from '../components/token-rate';
import teaToken from '../../assets/icons/tea-token.svg';
import teaLogo from '../../assets/icons/tea-logo-new.svg';
import { Countdown } from '../components/countdown';
import {
  enterPresaleUtil,
  getPresaleRoundSold,
  getPresaleRoundInfo,
  getPresaleRoundPrice,
  getPresaleUserBalance,
  setTokenApprove,
} from '../utils/presale';

import { USDC, USDT } from '../utils/constants';
import Spinner from '../components/spinner';
import ContractInfo from '../components/contract-info';

const mappedCoins = {
  eth: { icon: ethereumIcon, label: 'ETH', value: 'eth', contract: '' },
  usdt: { icon: tetherIcon, label: 'USDT', value: 'usdt', contract: USDT },
  usdc: { icon: usdcIcon, label: 'USDC', value: 'usdc', contract: USDC },
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
  const { paymentAssets, account } = useMetaMaskContext();
  const [tokenPrice, setTokenPrice] = useState<number>(0);
  const { convertCoin, coinValuation } = useCoin({ tokenPrice });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [roundInfo, setRoundInfo] = useState<{
    currentRound: number;
    roundEnd: number;
  }>({ currentRound: 0, roundEnd: 0 });
  const [contractInfo, setContractInfo] = useState<{
    roundSold: null | number;
    roundSize: null | number;
  }>({
    roundSold: null,
    roundSize: null,
  });
  const remainingTea = useRef(0);
  const userTeaPurchased = useRef(0);

  const updateValueOfLastTouchedInput = useCallback(() => {
    if (lastInputTouched.current === 'tea') {
      setAmount(() => convertCoin(amountInTea, false, selectedCoin));
    } else if (lastInputTouched.current === 'coin') {
      setAmountInTea(() => convertCoin(amount, true, selectedCoin));
    }
  }, [amount, amountInTea, convertCoin, selectedCoin]);

  const formattedBalance = useMemo(() => {
    if (!paymentAssets[selectedCoin]?.balance) {
      return '--';
    }
    return `Balance: ${paymentAssets[selectedCoin].balance} ${mappedCoins[selectedCoin]?.label}`;
  }, [paymentAssets, selectedCoin]);

  const buyButtonDisabled = useMemo(() => {
    return (
      !amount ||
      !amountInTea ||
      !isActive ||
      paymentAssets[selectedCoin] === null ||
      coinValuation[selectedCoin] === null ||
      loading ||
      submitting ||
      amountInTea > remainingTea.current ||
      amount > Number(paymentAssets[selectedCoin].balance)
    );
  }, [amount, paymentAssets, coinValuation, selectedCoin, amountInTea, submitting, remainingTea]);

  useEffect(() => {
    updateValueOfLastTouchedInput();
  }, [updateValueOfLastTouchedInput]);

  useEffect(() => {
    const getInfo = async () => {
      const price = await getPresaleRoundPrice();
      const roundResult = await getPresaleRoundInfo();
      const result = await getPresaleRoundSold();
      setRoundInfo(roundResult);
      setContractInfo(result);
      remainingTea.current = result.roundSize - result.roundSold;
      setTokenPrice(price);
    };

    const getPurchased = async () => {
      if (account) {
        const userBalance = await getPresaleUserBalance(account);
        userTeaPurchased.current = userBalance;
      }
    };
    const initializeProvider = async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      }
    };

    const handleStart = async () => {
      initializeProvider();
      await getInfo();
      await getPurchased();
      setLoading(false);
    };
    handleStart();
  }, []);

  const handleContractResponse = (response: any) => {
    if (response.status === 'SUCCESS') {
      setEventTitle('Transaction approved!');
      setEventType('success');
    } else {
      setEventTitle(response.message);
      setEventType('error');
    }
  };
  const handleApprove = async () => {
    try {
      if (!amount || !paymentAssets[selectedCoin]?.decimal) {
        return;
      }
      setEventType('primary');
      setEventTitle('Waiting for transaction 1/3 approval...');
      eventModalRef.current?.show();
      const res1 = await setTokenApprove(mappedCoins[selectedCoin].contract, 0, paymentAssets[selectedCoin]?.decimal);
      handleContractResponse(res1);
      if (res1.status === 'FAILURE') {
        setSubmitting(false);
        setTimeout(() => {
          eventModalRef.current?.hide();
        }, 4000);
        return false;
      }
      setEventType('primary');
      setEventTitle('Waiting for transaction 2/3 approval...');
      const res2 = await setTokenApprove(
        mappedCoins[selectedCoin].contract,
        amount,
        paymentAssets[selectedCoin]?.decimal
      );
      handleContractResponse(res2);
      if (res2.status === 'FAILURE') {
        setSubmitting(false);
        setTimeout(() => {
          eventModalRef.current?.hide();
        }, 4000);
        return false;
      }
      return true;
    } catch (err: any) {
      setEventType('error');
      setEventTitle(err.message);
      eventModalRef.current?.show();
      setSubmitting(false);
      setTimeout(() => {
        eventModalRef.current?.hide();
      }, 4000);
      return false;
    }
  };

  const enterPresale = async () => {
    try {
      if (!amount || !amountInTea || !paymentAssets[selectedCoin]?.decimal) {
        return;
      }
      setSubmitting(true);
      const approveResult = await handleApprove();
      if (!approveResult) {
        setSubmitting(false);
        return;
      }
      setEventType('primary');
      setEventTitle('Waiting for transaction 3/3 approval...');
      eventModalRef.current?.show();
      const res = await enterPresaleUtil(
        amountInTea,
        Number(window.localStorage.getItem('referral')),
        mappedCoins[selectedCoin].contract
      );
      handleContractResponse(res);
      setSubmitting(false);
      setTimeout(() => {
        eventModalRef.current?.hide();
      }, 4000);
    } catch (err: any) {
      setEventType('error');
      setEventTitle(err.message);
      eventModalRef.current?.show();
      setSubmitting(false);
      setTimeout(() => {
        eventModalRef.current?.hide();
      }, 4000);
    }
  };

  return (
    <div className="buy page">
      {loading ? (
        <div className="loading">
          <div className="loading__inner">
            <img src={teaLogo} alt="Tea" slot="prefix" className="loading__logo" />

            <Spinner />
          </div>
        </div>
      ) : (
        <>
          <div className="alert">
            <SlAlert
              variant={eventType === 'error' ? 'warning' : 'primary'}
              ref={eventModalRef}
              className="alert__container"
            >
              {eventType === 'error' && <SlIcon slot="icon" name="exclamation-triangle" />}
              {eventType === 'primary' && <SlIcon slot="icon" name="info-circle" />}
              {eventType === 'success' && <SlIcon slot="icon" name="check2-circle" />}
              {eventTitle}
            </SlAlert>
          </div>
          <Countdown roundInfo={roundInfo} isActive={isActive} setIsActive={setIsActive} />
          <TokenRate tokenPrice={tokenPrice} />
          <ContractInfo info={contractInfo} />
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
                  disabled={tokenPrice === 0}
                  valueAsNumber={amount}
                  decimals={Number(paymentAssets[selectedCoin]?.decimal) || 18}
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
                <small className="amount__balance">
                  Amount Purchased: {userTeaPurchased.current.toLocaleString('en-US', { maximumFractionDigits: 4 })} TEA
                </small>

                <CoinInput
                  disabled={tokenPrice === 0}
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
          <SlButton onClick={enterPresale} disabled={!buyButtonDisabled} variant="primary" className="buy__btn">
            {submitting ? <Spinner /> : <>{isActive ? 'BUY TEA' : 'Presale Current Round Ended.'}</>}
          </SlButton>
        </>
      )}
    </div>
  );
};
