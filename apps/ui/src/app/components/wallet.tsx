import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Wallet = () => {
  return (
    <div className="wallet">
      <ConnectButton
        chainStatus={"none"}
        accountStatus={"address"}
        showBalance={false}
      />
    </div>
  );
};
