import { SlCard, SlFormatNumber } from '@shoelace-style/shoelace/dist/react';
import { useCoin } from '../hooks/useCoin';
import teaToken from '../../assets/icons/tea-token.svg';
interface coinProps {
  tokenPrice: number;
}

export const TokenRate = ({ tokenPrice }: coinProps) => {
  return (
    <SlCard slot="header" className="token-rate">
      <div className="token-rate__name">
        <img src={teaToken} alt="TEA" />
        Tea
      </div>
      <SlFormatNumber
        className="token-rate__value"
        value={tokenPrice}
        type="currency"
        currency="USD"
        minimumFractionDigits={4}
      />
    </SlCard>
  );
};
