# tine-app

匿名メッセージングアプリ「Tine」。Next.js (static export) + Firebase (Authentication 匿名認証 / Firestore) で構築し、GitHub Pages で公開しています。

## 開発

```bash
npm install
npm run dev
```

## ビルド (静的エクスポート)

```bash
npm run build
```

`out/` ディレクトリに静的ファイルが出力されます。`main` ブランチへの push で GitHub Actions が自動的にビルド・GitHub Pages への公開を行います。
