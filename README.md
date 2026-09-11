# 株式会社Wisteria コーポレートサイト（日本語版）

素のHTML / CSS / JavaScript のみ。ビルド不要です。
公開: https://2081075-spec.github.io/wisteria-hp/（GitHub Pages）

## ファイル

    index.html                トップ
    business/index.html       事業内容（4領域・6事業）
    business/metal/index.html 金属回収
    business/kharis/index.html KHARIS
    business/wagyu/index.html Wisteria WAGYU
    company/index.html        会社概要
    contact/index.html        お問い合わせ
    404.html                  見つからないページ
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
- canonical / OGP / sitemap は `https://www.wisteria-grp.jp/` を前提にしています。GitHub Pages に独自ドメインを設定するまでは、検索エンジンには github.io 側の URL ではなく wisteria-grp.jp が正規URLとして伝わります。
- 英語版（`/en/`）は未作成です。ヘッダーの EN 表示は現在リンクではありません。作成時は `hreflang` と sitemap に en を追加してください。

## お問い合わせフォーム

`contact/` のフォームは FormSubmit（https://formsubmit.co/）経由で info@wisteria.email に届きます。
**初回送信時に info@wisteria.email へ「有効化（Activate）」メールが届くので、リンクを一度クリックしてください。** それまでの送信は届きません。
送信に失敗した場合、画面には info@wisteria.email へ直接メールを送るリンクが表示されます。

## 未確定・要確認

- 会社概要の古物商許可番号（`company/index.html` に TODO コメントあり）。
- 金属回収ページ「対象となるもの」の具体的な品目・受入条件（`business/metal/index.html` に TODO コメントあり）。
