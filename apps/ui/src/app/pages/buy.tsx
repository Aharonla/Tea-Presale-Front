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
import { Countdown } from '../components/countdown';
import { enterPresaleUtil, getPresaleRoundSold, getPresaleRoundPrice, setTokenApprove } from '../utils/presale';
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

  const [contractInfo, setContractInfo] = useState<{
    roundSold: null | number;
    roundSize: null | number;
  }>({
    roundSold: null,
    roundSize: null,
  });
  const remainingTea = useRef(0);

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
      paymentAssets[selectedCoin] === null ||
      coinValuation[selectedCoin] === null ||
      submitting ||
      amountInTea > remainingTea.current ||
      amount > Number(paymentAssets[selectedCoin].balance)
    );
  }, [amount, paymentAssets, coinValuation, selectedCoin, amountInTea, submitting, remainingTea]);

  useEffect(() => {
    updateValueOfLastTouchedInput();
  }, [updateValueOfLastTouchedInput]);

  useEffect(() => {
    const getTokenPrice = async () => {
      const price = await getPresaleRoundPrice();
      setTokenPrice(price);
    };
    const getInfo = async () => {
      const result = await getPresaleRoundSold();
      setContractInfo(result);
      remainingTea.current = result.roundSize - result.roundSold;
    };
    getInfo();
    getTokenPrice();
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
        }, 1000);
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
        }, 1000);
        return false;
      }
      return true;
    } catch (err: any) {
      setEventType('error');
      setEventTitle(err.message);
      eventModalRef.current?.show();
      setSubmitting(false);
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
      const res = await enterPresaleUtil(amountInTea, 1, mappedCoins[selectedCoin].contract);
      handleContractResponse(res);
      setSubmitting(false);
      setTimeout(() => {
        eventModalRef.current?.hide();
      }, 1000);
    } catch (err: any) {
      setEventType('error');
      setEventTitle(err.message);
      eventModalRef.current?.show();
      setSubmitting(false);
    }
  };

  // for fixing issue of ethers-js can't get singer from provider!
  useEffect(() => {
    const initializeProvider = async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      }
    };

    initializeProvider();
  }, []);

  return (
    <div className="buy page">
      <SlAlert variant="primary" ref={eventModalRef} className="alert">
        {eventType === 'error' && <SlIcon slot="icon" name="exclamation-triangle" />}
        {eventType === 'primary' && <SlIcon slot="icon" name="info-circle" />}
        {eventType === 'success' && <SlIcon slot="icon" name="check2-circle" />}
        {eventTitle}
      </SlAlert>

      <Countdown />
      {tokenPrice > 0 && <TokenRate tokenPrice={tokenPrice} />}
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
            <small className="amount__balance">Available: {remainingTea.current} TEA</small>

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
      <SlButton onClick={enterPresale} disabled={buyButtonDisabled} variant="primary" className="buy__btn">
        {submitting ? <Spinner /> : 'BUY TEA'}
      </SlButton>
    </div>
  );
};
