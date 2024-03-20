import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import tetherIcon from "../../assets/icons/tether.svg";
import ethereumIcon from "../../assets/icons/ethereum.svg";
import { useCoin } from "../hooks/useCoin";
import { TokenRate } from "../components/token-rate";
import teaToken from "../../assets/icons/tea-token.svg";
import { Countdown } from "../components/countdown";
import swapArrow from "../../assets/icons/swap.png";
import { useAccount, useBalance } from "wagmi";
import { CoinSection } from "../components/coin-section";

const mappedCoins = {
  eth: { icon: ethereumIcon, label: "ETH", value: "eth" },
  usdt: { icon: tetherIcon, label: "USD₮", value: "usdt" },
};
export type CoinType = keyof typeof mappedCoins;
const coins: CoinType[] = ["eth", "usdt"];

export const Buy = () => {
  const lastInputTouched = useRef<"tea" | "coin" | null>(null);

  const [selectedCoin, setSelectedCoin] = useState<CoinType>("usdt");
  const [amount, setAmount] = useState<number>();
  const [amointInTea, setmountInTea] = useState<number>();
  const { address, chainId, isConnected } = useAccount();
  const { convertCoin, coinValuation } = useCoin();

  const updateValueOfLastTouchedInput = useCallback(() => {
    if (lastInputTouched.current === "tea") {
      setAmount(() => convertCoin(amointInTea, false, selectedCoin));
    } else if (lastInputTouched.current === "coin") {
      setmountInTea(() => convertCoin(amount, true, selectedCoin));
    }
  }, [amount, amointInTea, convertCoin, selectedCoin]);

  const swapButtonDisabled = useMemo(() => {
    return !amount || coinValuation[selectedCoin] === null, !isConnected;
  }, [amount, coinValuation, selectedCoin]);

  useEffect(() => {
    updateValueOfLastTouchedInput();
  }, [updateValueOfLastTouchedInput]);

  return (
    <div className="buy page">
      <div className="swap">
        <div className="swap__body">
          <TokenRate />
          <div className="coin-center">
            <CoinSection
              symbol={"USDT"}
              logo={tetherIcon}
              valueAsNumber={amount}
              isPayment
              decimals={18}
              onChangeValue={(value) => {
                lastInputTouched.current = "coin";
                setAmount(value);
                setmountInTea(convertCoin(value, true, selectedCoin));
              }}
            />
            <img src={swapArrow} alt="swap-arrow" className="convert-icon" />
            <CoinSection
              symbol={"TEA"}
              logo={teaToken}
              valueAsNumber={amointInTea}
              decimals={9}
              onChangeValue={(value) => {
                lastInputTouched.current = "tea";
                setAmount(convertCoin(value, false, selectedCoin));
                setmountInTea(value);
              }}
            />
          </div>
        </div>
        <button disabled={swapButtonDisabled} className="swap-button">
          SWAP
        </button>
      </div>
    </div>
  );
};
