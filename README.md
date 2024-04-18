# TeaPresale

## Prerequisite

- NodeJs 18+.
- run `npm install` to install dependencies.
- create .env file configuration

## .env file

create .env.development inside apps/ui directory and add the following:

- VITE_INFURA_API_KEY= Get it from <https://app.infura.io>

## Development

Run `npx nx serve ui` or `npm run start` to start the development server. Happy coding!

## Build for production

Run `npx nx build ui` or `npm run build` to build the application. The build artifacts are stored in the dist/apps/privatesale directory. ready to be deployed.

### Running production in local

after building app, run thees commands :

`cd dist/apps/privatesale/`

then run below command in this directory :

`npm run start`
