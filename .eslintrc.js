module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  // プラグインの共有設定。recommendedとAirbnbのものを中心に設定
  extends: [
    'plugin:react/recommended',
    'airbnb', // この中にeslint:recommendedも入っている
    'airbnb/hooks',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended', // eslint:recommendedからTypeScriptの記法とバッティングするルールを補正
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    project: './tsconfig.eslint.json', // コンパイルパスをファイルで指定。そちらでnpmのパッケージを除外している
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  // プラグインの読込(yarn add も必要)
  plugins: [
    'react',
    '@typescript-eslint',
    'unused-imports',
    'import',
    'jsx-a11y',
    'prefer-arrow',
    'react-hooks',
  ],
  // 親ディレクトリは読み込まないようにrootと指定
  root: true,
  rules: {
    // 未定義の変数仕様の禁止（念の為）
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    // クラスメンバー定義の間の空行。一行のときは空行入れなくても良くする
    'lines-between-class-members': [
      'error',
      'always',
      {
        exceptAfterSingleLine: true,
      },
    ],
    // void演算子の使用禁止ルール。文は許可するように変更
    'no-void': [
      'error',
      {
        allowAsStatement: true,
      },
    ],
    // 区切りの空行を入れるルール.return文の前に入れるように設定
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: 'return',
      },
    ],
    // 未定義変数仕様の禁止ルール。_のみ許可
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        args: 'after-used',
        argsIgnorePattern: '_',
        ignoreRestSiblings: false,
        varsIgnorePattern: '_',
      },
    ],
    // 自前ライブラリでjs,jsx,ts,tsxについては拡張子記載について省略可能とする
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    // jsx用のファイルについてjsx以外にtsxもOKにする
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.jsx', '.tsx'],
      },
    ],
    // propsのスプレット構文禁止ルール。明示的に書いてあれば許容するように変更
    'react/jsx-props-no-spreading': [
      'error',
      {
        html: 'enforce',
        custom: 'enforce',
        explicitSpread: 'ignore',
      },
    ],
    // JSX記述を使用する前にReactインポートの記載強制を無効化
    'react/react-in-jsx-scope': 'off',
    // アロー関数の強制
    'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
    'prefer-arrow/prefer-arrow-functions': [
      'error',
      {
        disallowPrototype: true,
        singleReturnOnly: false,
        classPropertiesAllowed: false,
      },
    ],
    // top-levelがboolで判定してcomponentを出し分けるものも検出するためallowに設定
    'react/jsx-no-useless-fragment': [
      'error',
      {
        allowExpressions: true,
      },
    ],
    // for storybook
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['.storybook/**', 'stories/**', '**/*/*.story.*', '**/*/*.stories.*'],
      },
    ],
    'react/jsx-props-no-spreading': [
      'off',
      {
        extensions: ['stories/**', '**/*/*.stories.*'],
      },
    ],
    '@typescript-eslint/no-unsafe-assignment': [
      'off',
      {
        extensions: ['stories/**', '**/*/*.stories.*'],
      },
    ],
    // 使用していないimportをエラー（にして削除）
    'unused-imports/no-unused-imports': 'error',
    // defaultpropsの設定を強制（をやめる）
    'react/require-default-props': 'off',
    // import のソート順
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index', 'object', 'type'],
        pathGroups: [
          {
            pattern: '@alias/**',
            group: 'parent',
            position: 'before',
          },
        ],
        alphabetize: {
          order: 'asc',
        },
      },
    ],
    // cssは見つからなくても良しとする
    'import/no-unresolved': [
      'off',
      {
        extensions: ['.css'],
      },
    ],
    // storybook の default export off
    'storybook/default-exports': 'off',
    'import/prefer-default-export': [
      'off',
      {
        extensions: ['stories/**', '**/*/*.stories.*'],
      },
    ],
    // promise
    'compat/compat': 'off',
    // 一旦OFF
    '@typescript-eslint/no-unsafe-call': 'off',
    'react/destructuring-assignment': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    'no-return-await': 'off',
    'no-param-reassign': 'off',
  },
  overrides: [
    // コンポーネントのpropsの型チェック用のpropTypesの強制ルール。TypeScriptなので無効化
    {
      files: ['*.tsx'],
      rules: {
        'react/prop-types': 'off',
      },
    },
    {
      // enable the rule specifically for TypeScript files
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': ['warn'],
      },
    },
  ],
  settings: {
    // eslint-plugin-import にも絶対パスを教えてあげている
    'import/resolver': {
      node: {
        paths: ['src'],
      },
      // tsconfig.jsonのbaseUrls, pathsに加えて以下を追加し、workspace再起動
      typescript: {},
    },
  },
};
