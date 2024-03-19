import "./assets/styles/main.scss";
import { createRoot } from "react-dom/client";
import { App } from "./app/app";
import { UserContextProvider } from "./app/context/user.context";
import { MetaMaskProvider } from "./app/context/metamask.context";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path";
import "@shoelace-style/shoelace/dist/themes/light.css";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";

// Wallet Connect Configure

const projectId = "<ENTER_WALLET_CONNECT_PROJECT_ID>";

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: "Ethereum",
  currency: "ETH",
  explorerUrl: "https://etherscan.io",
  rpcUrl: "https://cloudflare-eth.com",
};

const sepolia = {
  chainId: 11155111,
  name: "Sepolia Ethereum",
  currency: "SepoliaETH",
  explorerUrl: "https://etherscsepolia.etherscan.io",
  rpcUrl: "https://cloudflare-eth.com",
};

// 3. Create a metadata object
const metadata = {
  name: "My Website",
  description: "My Website description",
  url: "https://mywebsite.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  // rpcUrl: '...' // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
});

// 5. Create a Web3Modal instance
const res = createWeb3Modal({
  ethersConfig,
  chains: [mainnet, sepolia],
  projectId: "167efa6c024c45590200c9868c0bda3e",
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.14.0/cdn/"
);

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <MetaMaskProvider>
    <UserContextProvider>
      <App />
    </UserContextProvider>
  </MetaMaskProvider>
);
