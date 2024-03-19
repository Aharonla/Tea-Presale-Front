import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  SlCard,
  SlSelect,
  SlOption,
  SlIcon,
  SlButton,
  SlInput,
} from "@shoelace-style/shoelace/dist/react";
import { useMetaMaskContext } from "../context/metamask.context";
import tetherIcon from "../../assets/icons/tether.svg";
import ethereumIcon from "../../assets/icons/ethereum.svg";
import { CoinInput } from "../components/coin-input";
import { useCoin } from "../hooks/useCoin";
import { TokenRate } from "../components/token-rate";
import teaToken from "../../assets/icons/tea-token.svg";
import { Countdown } from "../components/countdown";
import swapArrow from "../../assets/icons/swap.png";
import { VerticalLine } from "../components/swap";
import { InputHeader, SwapCardFooter } from "../components/buy-page";

const mappedCoins = {
  eth: { icon: ethereumIcon, label: "ETH", value: "eth" },
  usdt: { icon: tetherIcon, label: "USD₮", value: "usdt" },
};
export type CoinType = keyof typeof mappedCoins;
const coins: CoinType[] = ["eth", "usdt"];
export const Buy = () => {
  const lastInputTouched = useRef<"noti" | "coin" | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<CoinType>("eth");
  const [amount, setAmount] = useState<number>();
  const [amountInNoti, setAmountInNoti] = useState<number>();
  const { balance } = useMetaMaskContext();
  const { convertCoin, coinValuation } = useCoin();

  const updateValueOfLastTouchedInput = useCallback(() => {
    if (lastInputTouched.current === "noti") {
      setAmount(() => convertCoin(amountInNoti, false, selectedCoin));
    } else if (lastInputTouched.current === "coin") {
      setAmountInNoti(() => convertCoin(amount, true, selectedCoin));
    }
  }, [amount, amountInNoti, convertCoin, selectedCoin]);

  const formattedBalance = useMemo(() => {
    if (balance[selectedCoin] === null) {
      return "";
    }
    return `Balance: ${balance[selectedCoin]} ${mappedCoins[selectedCoin]?.label}`;
  }, [balance, selectedCoin]);

  const buyButtonDisabled = useMemo(() => {
    return (
      !amount ||
      balance[selectedCoin] === null ||
      coinValuation[selectedCoin] === null
    );
  }, [amount, balance, coinValuation, selectedCoin]);

  useEffect(() => {
    updateValueOfLastTouchedInput();
  }, [updateValueOfLastTouchedInput]);

  return (
    <div className="buy page">
      <div className="swap">
        <div className="swap__body">
          <InputHeader />
          <div className="coin-center">
            <div className="coin-section">
              <img
                src={ethereumIcon}
                alt="ETH"
                slot="prefix"
                className="coin-center__icon"
              />
              ETH
              <VerticalLine />
              <CoinInput
                valueAsNumber={amountInNoti}
                decimals={9}
                onChangeValue={(value) => {
                  lastInputTouched.current = "noti";
                  setAmount(convertCoin(value, false, selectedCoin));
                  setAmountInNoti(value);
                }}
              />
            </div>
            <img src={swapArrow} alt="swap-arrow" className="convert-icon" />

            <div className="coin-section">
              <img
                src={teaToken}
                alt="TEA"
                slot="prefix"
                className="coin-center__icon"
              />
              TEA
              <VerticalLine />
              <CoinInput
                valueAsNumber={amountInNoti}
                decimals={9}
                onChangeValue={(value) => {
                  lastInputTouched.current = "noti";
                  setAmount(convertCoin(value, false, selectedCoin));
                  setAmountInNoti(value);
                }}
              />
            </div>
          </div>
        </div>
        <SwapCardFooter />
        <button className="swap-button">SWAP</button>
      </div>
    </div>
  );
};
