# 株式会社Wisteria コーポレートサイト（日本語版・英語版）

素のHTML / CSS / JavaScript のみ。ビルド不要です。
公開: https://www.wisteria-group.jp/（GitHub Pages・独自ドメイン。リポジトリ直下の `CNAME` で設定）

## ファイル

    index.html                トップ
    business/index.html       事業内容（5領域・7事業）
    business/metal/index.html 金属回収
    business/ingredients/index.html 食品原料・食品添加物
    business/kharis/index.html KHARIS
    business/wagyu/index.html Wisteria WAGYU
    company/index.html        会社概要
    contact/index.html        お問い合わせ
    en/…                      英語版（同じ構成。en/index.html, en/business/…, en/company/, en/contact/）
    404.html                  見つからないページ（日英併記）
    styles.css                全ページ共通のスタイル
    main.js                   全ページ共通のスクリプト（メニュー、スクロール演出、枝分かれSVG、フォーム送信）
    assets/                   ロゴ・写真・favicon・OG画像
    sitemap.xml / robots.txt

    business.html / company.html / contact.html / metal.html / kharis.html / wagyu.html
      → 旧URL用の転送ページ（meta refresh + canonical）。新しいURLは末尾スラッシュのディレクトリ形式です。

## ローカルで確認する

    python -m http.server 8000

`file://` で直接開くと相対リンク（`business/` 形式）が解決できないため、必ずサーバー経由で確認してください。

## 更新時のメモ

- CSS / JS を変更したら、全HTMLの `styles.css?v=` と `main.js?v=` の日付を上げる（キャッシュ対策）。
- canonical / OGP / sitemap / JSON-LD は `https://www.wisteria-group.jp/` を正規URLにしています。
- DNS はお名前.com レンタルサーバー（ベーシック）のコントロールパネル →「ドメイン」→「DNSレコード」で管理しています（www は CNAME → `2081075-spec.github.io`、ルートは GitHub Pages の A レコード4つ）。お名前.com Navi 側の「DNSレコード設定」はネームサーバーが違うため反映されません。メール用のレコード（MX / SPF / DKIM / mail / ml-cp）は消さないでください。
- 英語版は `/en/` 配下。各ページの `<head>` に ja / en / x-default の `hreflang`、sitemap にも両言語を登録済み。ヘッダーの JA / EN で対応ページ同士を行き来できます。
- 英語版の文言方針: 直訳ではなく英語圏向けに簡潔に書く。用語は Metal Recovery / Urban Mining、HPP (High Pressure Processing)、cold-pressed、Secondhand Dealer Licence (Tokyo Metropolitan Public Safety Commission)。detox / anti-aging / supplement 等の効能表現は使わない。

## お問い合わせフォーム

`contact/` と `en/contact/` のフォームは FormSubmit（https://formsubmit.co/）経由で info@wisteria.email に届きます。
**初回送信時に info@wisteria.email へ「有効化（Activate）」メールが届くので、リンクを一度クリックしてください。** それまでの送信は届きません。
送信に失敗した場合、画面には info@wisteria.email へ直接メールを送るリンクが表示されます。

## 未確定・要確認

- 会社概要の古物商許可番号（`company/index.html` に TODO コメントあり）。
- 金属回収ページ「対象となるもの」の具体的な品目・受入条件（`business/metal/index.html` に TODO コメントあり）。
