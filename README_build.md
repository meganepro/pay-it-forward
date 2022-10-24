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
