import "./assets/styles/main.scss";
import { createRoot } from "react-dom/client";
import { App } from "./app/app";
import { UserContextProvider } from "./app/context/user.context";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { env } from "./app/utils/env";

// Wallet Connect Configure

const projectId = env.WALLET_CONNECT_PROJECT_ID;
// 2. Set chains

const config = getDefaultConfig({
  appName: "TeaPresale",
  projectId: projectId,
  chains: [sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: "#f716a2",
          accentColorForeground: "white",
        })}
      >
        <UserContextProvider>
          <App />
        </UserContextProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
