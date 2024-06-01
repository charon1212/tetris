# template-electron-react-typescript

Electron + React + Typescriptを組み合わせたプロジェクトのテンプレート。

## 手順と軽い解説

- typescript-reactのテンプレートをインストール

```bash
> npx create-react-app . --template typescript
```

- .gitignoreに以下を追加。

```plain
/dist
package-lock.json
```

- electronを追加。（のちのexeファイルビルドのためにbuilderも）

```bash
> npm i -D electron electron-builder electron-store
```

- electronのテンプレートを追加。（詳細は、electronフォルダのファイルを参照。）
- package.jsonにエントリーポイントを追加。

```json
{
  "main": "build/electron/electron.js",
  "homepage": "./"
}
```

- public/index.htmlのheadにCSPのmetaタグを追加。
- 開発ビルド/本番ビルド用のスクリプトを、package.jsonに追加。
  - "electron:dev"は、Electron資材をtscコンパイルして起動するだけ。事前にlocalhost:3000に目的のReactアプリを立ち上げて置かないと動かない。
  - "electron:prod"は、React資材とElectron資材をビルドし、ポータブルアプリとして.exeファイルを作成する。
  - "electron:prod:install"は、React資材とElectron資材をビルドし、インストーラーを作成する。

```json
{
  "scripts":{
    "electron:dev": "tsc -p electron && electron .",
    "electron:prod": "npm run build && tsc -p electron && electron-builder --win --x64 --dir",
    "electron:prod:install": "npm run build && tsc -p electron && electron-builder --win --x64"
  }
}
```

- メインプロセスのAPIを、レンダラー（React）で使用するサンプルを追加。詳細は、src/App.tsxとsrc/@types/global.d.tsを参照。
- 本番ビルド用の設定をpackage.jsonに加える。

```json
{
 "build": {
   "extends": null,
   "files": [
     "build/**/*"
   ],
   "directories": {
     "buildResources": "assets"
   }
 }
}
```

## ビルド方法

### 開発ビルド

- 2つのシェル(powershell等)を立ち上げて、プロジェクトのルートで以下の順にコマンドをたたく。
  - 片方のシェルで、"npm run start"を実行し、localhost:3000にReactアプリを立ち上げる。
  - 上記が立ち上がったら、もう片方のシェルで"npm run electron:dev"を実行し、Electronアプリを実行する。

### 本番ビルド

- "npm run electron:prod"か"npm run electron:prod:install"を実行する。

## 参考

- <https://zenn.dev/niwaringo/articles/af693596ef948e>
