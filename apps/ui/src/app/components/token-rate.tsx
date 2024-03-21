import { SlCard, SlFormatNumber } from "@shoelace-style/shoelace/dist/react";
import { useCoin } from "../hooks/useCoin";
import teaToken from "../../assets/icons/tea-token.svg";

export const TokenRate = () => {
  const tokenRate = 0.07;
  return (
    <SlCard slot="header" className="token-rate">
      <div className="token-rate__name">
        <img src={teaToken} alt="TEA" />
        Tea
      </div>
      <SlFormatNumber
        className="token-rate__value"
        value={tokenRate}
        type="currency"
        currency="USD"
        minimumFractionDigits={4}
      />
    </SlCard>
  );
};
