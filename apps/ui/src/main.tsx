import './assets/styles/main.scss';
import { createRoot } from 'react-dom/client';
import { App } from './app/app';
import { UserContextProvider } from './app/context/user.context';
import { MetaMaskProvider } from './app/context/metamask.context';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path';
import '@shoelace-style/shoelace/dist/themes/light.css';
import { EventModalProvider } from './app/context/event.context';

setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.0/cdn/');

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <EventModalProvider>
    <MetaMaskProvider>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </MetaMaskProvider>
  </EventModalProvider>
);
