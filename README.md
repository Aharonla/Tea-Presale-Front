# TeaPresale

## Prerequisite

- NodeJs 18+.
- `npm start`
- .env file configuration

## .env file

create .env.development inside apps/ui directory and add the followings:

- VITE_WALLET_CONNECT_PROJECT_ID= Get it from <https://cloud.walletconnect.com/sign-in>
- VITE_PUBLIC_INFURA_API= Get it from <https://app.infura.io/login>
- VITE_PUBLIC_SEPOLIA_URL= Get it from <https://app.infura.io/login>

## Development

Run `npx nx serve ui` or `npm start` to start the development server. Happy coding!

## Build for production

Run `npx nx build ui` or `npm build` to build the application. The build artifacts are stored in the output directory (e.g. `dist/` or `build/`), ready to be deployed.
