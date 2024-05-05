# TeaPresale

## Prerequisite

- NodeJs 18+.
- run `npm install` to install dependencies.
- create .env file configuration

## .env file

create .env.development inside apps/ui directory and add the followings:

- VITE_WALLET_CONNECT_PROJECT_ID= Get it from <https://cloud.walletconnect.com/sign-in>
- VITE_PUBLIC_INFURA_API= Get it from <https://app.infura.io/login>
- VITE_PUBLIC_SEPOLIA_URL= Get it from <https://app.infura.io/login>

## Development

Run `npx nx serve ui` or `npm run start` to start the development server. Happy coding!

## Build for production

Before building you need to set env values to the OS system you can get these values from .env.production.example

on Linux And Mac run below command in terminal :
`export VARIABLE_NAME=value`
on windows :
`set [<variable>=[<string>]]`

Then run `npx nx build ui --prod` or `npm run build` to build the application. The build artifacts are stored in the dist/apps/privatesale directory. ready to be deployed.

### Running production in local

after building app, run thees commands :

`cd dist`

then run below command in this directory :

HINT : before running below command you need to manually copy fonts folder to : dist/assets/src/assets/ directory!

`npx vite`
