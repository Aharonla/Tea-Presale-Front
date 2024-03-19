import { SlCard, SlFormatNumber } from "@shoelace-style/shoelace/dist/react";
import { useCoin } from "../hooks/useCoin";
import teaToken from "../../assets/icons/tea-token.svg";

export const TokenRate = () => {
  const tokenRate = 0.07;
  return (
    <div className="card__top token-rate">
      <div className="token-rate__name">
        <img src={teaToken} alt="Tea" />
        TEA
      </div>
      <SlFormatNumber
        className="token-rate__value"
        value={tokenRate}
        type="currency"
        currency="USD"
        minimumFractionDigits={4}
      />
    </div>
  );
};
