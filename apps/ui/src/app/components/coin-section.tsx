import React, { FC, InputHTMLAttributes } from "react";
import { VerticalLine } from "./vertical-line";
import { useAccount, useBalance } from "wagmi";
import { formatUnits } from "viem";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  onChangeValue: (amount: number) => void;
  decimals: 9 | 18;
  symbol: string;
  logo: string;
  valueAsNumber: number | undefined;
  isPayment?: boolean;
}

export const CoinSection: FC<InputProps> = ({
  onChangeValue,
  decimals,
  symbol,
  logo,
  valueAsNumber,
  isPayment = false,
  ...props
}) => {
  const formattedValueAsNumber = +Number(valueAsNumber).toFixed(decimals);
  const { address } = useAccount();
  const res = useBalance({ address });

  const balance = res.data?.value
    ? formatUnits(res.data!.value, res.data!.decimals)
    : "--";
  const inputStyle = {
    WebkitAppearance: "none",
    MozAppearance: "none",
    appearance: "none",
    paddingRight: "0.5em", // Add padding to the right to prevent the text from touching the border
  };
  return (
    <div className="coin-section">
      {isPayment && (
        <div className="coin-section__header">
          <p className="coin-section__label">You Pay</p>
          <p className="coin-section__label">Balance: {balance}</p>
        </div>
      )}

      <div className="coin-section__input">
        <img
          src={logo}
          alt={symbol}
          slot="prefix"
          className="coin-section__icon"
        />
        {symbol}
        <VerticalLine />

        <input
          className="txtinput"
          type="number"
          // autocomplete="off"
          value={formattedValueAsNumber ?? undefined}
          placeholder={"0.00"}
          // size="small"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          onChange={(e) => {
            const amount = parseFloat((e.target as HTMLInputElement).value);
            console.log("ee", amount);
            onChangeValue(amount);
          }}
          inputMode="decimal"
          enterKeyHint="done"
          pattern="[0-9]*"
          {...props}
        />
      </div>
    </div>
  );
};
