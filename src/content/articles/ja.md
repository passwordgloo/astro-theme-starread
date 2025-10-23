---
title: Star Read Astroブログテーマ
categories: [主题说明]
description: Star Read Astroブログテーマは、Astroを使用して作成されたブログテーマであり、インストール方法やプロジェクト構造、検索機能、カスタム設定、コメントシステムなどの使い方が説明されています。
date: 2024-05-20
cover: https://t.alcy.cc/ysz
permalink: /articles/a4dedf/
---

<div align="center">
  <img src="https://origin.picgo.net/2025/09/20/starread9dd6dc8d9d8dc4eb.png" alt="starread" border="0">
   🏴󠁧󠁢󠁥󠁮󠁧󠁿 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/README.md">English Document</a> | 
  🇨🇳 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMECN.md">中文文档</a> | 
  🇯🇵 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMEJA.md">日本語ドキュメント</a> | 
  🇰🇷 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMEKO.md">한국어 문서</a> | 
  🇷🇺 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMERU.md">Русская документация</a>
</div>
# Star Read - Astroブログテーマ

>星のように輝き、简洁かつ高級感のあるAstroテーマです

## 📦 インストール

### 方法1：CLIツールを介して初期化

| パッケージマネージャー | 推奨コマンド                                  |
|----------------|-------------------------------------------|
| pnpm / pnpx    | `pnpm dlx astro-theme-starread init` または `pnpx astro-theme-starread init` |
| npm (npx)      | `npx astro-theme-starread init`           |
| Yarn           | `yarn dlx astro-theme-starread init`（Yarn v2+ が必要） |

>[!note]
>`create`コマンドを提供しており、ユーザーが指定したフォルダにテーマを作成することができます

1. プロジェクトの作成： 使用しているパッケージマネージャーに応じて、以下のコマンドのいずれかを選択してください：

```bash
# pnpmを使用
pnpm create astro-theme-starread my-blog

# npmを使用
npx create-astro-theme-starread my-blog

# yarnを使用
yarn create astro-theme-starread my-blog

# cnpmを使用
cnpm init astro-theme-starread my-blog
```

2. プロジェクトディレクトリに入る：

```bash
cd my-blog
```

3. 依存関係をインストール：

```bash
pnpm install
```

4. 開発サーバーを起動：

```bash
pnpm dev
```

### 方法2：`astro`テンプレートを使用してインストール

>[!warning]
>この方法ではGithubリポジトリへのアクセスが必要です。ネットワーク接続が正常であることを確認してください。

| パッケージマネージャー | コマンド                                        |
|----------------|---------------------------------------------|
| pnpm           | `pnpm create astro@latest --template passwordgloo/astro-theme-starread` |
| npm            | `npm create astro@latest -- --template passwordgloo/astro-theme-starread` |
| yarn           | `yarn create astro --template passwordgloo/astro-theme-starread` |

### 方法3：ソースコードからインストール

>[!warning]
>该方式需访问Github仓库，确保网络畅通。


```bash
git clone https://github.com/passwordgloo/astro-theme-starread
cd astro-theme-starread
pnpm install
```

>[!note]
>インストールが完了したら、開発サーバーを実行します：
```bash
pnpm dev
```

## 📂 プロジェクト構造

```text
/
├── src/
│   ├── components/     # コンポーネントファイル
│   ├── content/        # コンテンツ設定
│   ├── layouts/        # レイアウトテンプレート
│   ├── pages/          # ページルート
│   └── styles/         # スタイルファイル
├── public/             # 静的資産
└── dist/               # ビルド出力
```

## 🚀 特徴

- 🎨 現代的なUIデザイン
- 🔍 ローカル検索（Pagefind）とAlgolia検索をサポート
- 📱 レスポンシブデザイン
- 🌙 ダーク/ライトテーマ切り替え
- 🏷️ タグとカテゴリーのサポート
- 📊 記事統計と作者情報の表示

## 🔍 検索

### ローカル検索

デフォルトではローカル検索が使用されます。初回使用時は`pnpm local`を実行してローカルインデックスを作成してください

### Algolia検索

>[!important]
>本番環境では、コードに機密情報が公開されないように、環境変数による設定を推奨します。

1. `starread.config.ts`を編集してAlgolia検索を選択します
```ts
export const themeConfig: starreadthemeconfig = {
  search: {
    // 検索サービスプロバイダー: 'local', 'algolia'
      provider: 'algolia',
    }
}
```

2. ルートディレクトリに`.env`ファイルを作成して編集します

>[!note]
>Algolia検索には、AlgoliaアプリケーションID、検索キー、インデックス名、および管理者APIキーが必要です。

>[!tip]
>Algoliaアカウントをお持ちでない場合は、先に登録してアプリケーションを作成する必要があります。

```txt
PUBLIC_ALGOLIA_APP_ID=あなたのAlgoliaアプリケーションID
PUBLIC_ALGOLIA_SEARCH_KEY=あなたのAlgolia検索キー
PUBLIC_ALGOLIA_INDEX_NAME=あなたのインデックス名
ALGOLIA_WRITE_API_KEY=あなたの書き込みAPIキー（インデックスアップロード用）
```

3. インデックスをAlgoliaにプッシュします

`pnpm algolia`を実行してローカルインデックスをAlgoliaにプッシュします

## ⚙️ カスタム設定

ルートディレクトリの`starread.config.ts`ファイルを編集することで、ウェブサイトのタイトル、ナビゲーションメニュー、作者情報、サイドバーコンポーネントの表示など、テーマ設定をカスタマイズできます。

設定例：
```typescript
// ウェブサイトのタイトルを変更
site: {
  title: '私のブログ',
  // ...その他の設定
}

// ナビゲーションメニューをカスタマイズ
nav: [
  { name: '首页', href: '/' },
  { name: '关于', href: '/about' },
  // ...その他のメニュー項目
]
```

## 🔧 Twikooコメント設定

Twikooコメントシステムを有効にするには、`src/components/Comment.astro`ファイルの13行目の`envId`の値をあなたの[Twikoo環境アドレス](https://twikoo.js.org/backend.html)に変更してください。

```js
<script>
  document.addEventListener('DOMContentLoaded', function() {
    if (window.twikoo) {
      window.twikoo.init({
        envId: 'https://example.com',// あなたの環境アドレス
        el: '#tcomment',
        path: window.location.pathname
      });
    } else {
      console.error('Twikooのロードに失敗しました。Twikooのローカル位置またはCDNアドレスを確認してください');
    }
  });
</script>
```

## 🧞 コマンド

| コマンド                 | 説明                                           |
| :----------------------- | :--------------------------------------------- |
| `pnpm install`           | 依存関係をインストール                           |
| `pnpm dev`               | ローカル開発サーバー `localhost:4321` を起動する |
| `pnpm preview`           | ローカルでビルド結果をプレビューする               |
| `pnpm local`             | 自動インデックススクリプトを実行して本番サイトを構築する |
| `pnpm algolia`           | データをAlgolia検索にプッシュする                  |
| `pnpm changelog`         | 変更ログを生成する                              |
| `pnpm release`           | バージョン管理（バージョン番号の更新、コミットの生成など） |