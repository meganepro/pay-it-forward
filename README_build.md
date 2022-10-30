# Initial Settings(FE)

## next app

```sh
npx create-next-app pay-it-forward --ts
cd pay-it-forward
rm -rf pages/api
rm pages/_app.tsx
mv pages src/
mv styles src/
mkdir -p src/pages
mv src/index.tsx src/pages/
```

## amplify

### init

```sh
amplify configure
amplify init
# already exists
# amplify pull
```

### add api

```sh
amplify add api
```

## eslint & prettier

### install

```sh
# eslint
npm install -D eslint-plugin-react @typescript-eslint/eslint-plugin \
  eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y \
  eslint-plugin-react-hooks @typescript-eslint/parser \
  eslint-plugin-prefer-arrow eslint-plugin-unused-imports \
  eslint-import-resolver-typescript eslint-config-next
# prettier
npm install -D prettier eslint-config-prettier
# simple-git-hooks
npm install -D simple-git-hooks
# amplify
npm install aws-amplify @aws-amplify/ui-react @aws-amplify/api-graphql @aws-amplify/ui
# other
npm install recoil react-icons \
  @onflow/fcl @onflow/types
npm install -D @faker-js/faker \
  react-ace ace-builds 
# eslint settings
npm init @eslint/config
```

## chakra ui

```sh
npm install @chakra-ui/react @emotion/react@^11 @emotion/styled@^11 framer-motion@^6 \
  @chakra-ui/icons \
  @chakra-ui/storybook-addon @chakra-ui/cli
```

## story book

```sh
npx sb init
```

# Initial Settings(BE)

## sls

### initial
```sh
npx serverless create --template aws-nodejs-typescript
npm install
```

### deploy 
```sh
npx serverless deploy --aws-profile=***
```

# run locally

## run Emulator

- install flow-cli

```sh
brew install flow-cli

flow version
> Version: v0.39.3
```

- run emulator & wallet

```sh
flow init
# terminal1
flow emulator
# terminal2
flow dev-wallet -l debug
# terminal3
flow deploy --network=emulator --update
```