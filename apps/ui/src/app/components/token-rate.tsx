import teaToken from "../../assets/icons/tea-token.svg";

export const TokenRate = () => {
  const tokenRate = 0.07;
  return (
    <div className="token-rate">
      <div className="token-rate__token">
        <img className="token-rate__logo" src={teaToken} alt="Tea" />
        <h3>TEA Price</h3>
      </div>
      <h2>{tokenRate}$</h2>
    </div>
  );
};
