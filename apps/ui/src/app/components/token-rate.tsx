import { SlCard, SlFormatNumber } from '@shoelace-style/shoelace/dist/react';
import { useCoin } from '../hooks/useCoin';
import notiToken from '../../assets/icons/noti-token.svg';

export const TokenRate = () => {
  const tokenRate = 0.07;
  return (
    <SlCard className="card token-rate">
      <div className="token-rate__name"><img src={notiToken} alt="NOTI" />Noti</div>
      <SlFormatNumber className="token-rate__value" value={tokenRate} type="currency" currency="USD" minimumFractionDigits={4} />
    </SlCard>
  )
}
