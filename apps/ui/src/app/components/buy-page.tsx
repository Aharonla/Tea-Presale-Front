import { SlCard, SlFormatNumber } from "@shoelace-style/shoelace/dist/react";
import { useCoin } from "../hooks/useCoin";
import teaToken from "../../assets/icons/tea-token.svg";

export const InputHeader = () => {
  return (
    <div className="coin-header">
      <div className="coin-header__row">
        <p className="coin-header__label">You Pay</p>
        <p className="coin-header__label">Balance: 735.62</p>
      </div>
      <div className="coin-header__row">
        <p className="coin-header__label">You recive</p>
        <p className="coin-header__label">Balance: 0</p>
      </div>
    </div>
  );
};

export const SwapCardFooter = () => {
  return (
    <div className="swap-footer">
      <div className="swap-footer__row">
        <p className="swap-footer__row__label">Commision</p>
        <p className="swap-footer__row__label">$1.28</p>
      </div>
      <div className="swap-footer__row">
        <p className="swap-footer__row__label">Total Expected After Fees</p>
        <p className="swap-footer__row__label">$4618.20</p>
      </div>
    </div>
  );
};
