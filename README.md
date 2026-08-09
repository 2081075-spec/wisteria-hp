# 株式会社Wisteria コーポレートサイト（日本語版）

素のHTML / CSS / JavaScript のみ。ビルド不要です。

## ファイル

    index.html      トップ
    business.html   事業内容
    metal.html      金属回収
    kharis.html     KHARIS
    wagyu.html      Wisteria WAGYU
    company.html    会社概要
    contact.html    お問い合わせ
    styles.css      全ページ共通のスタイル
    main.js         全ページ共通のスクリプト
    assets/         ロゴ・写真
    sitemap.xml / robots.txt

## ローカルで確認する

VS Code の Live Server 拡張でこのフォルダを開くか、ターミナルで:

    npx serve .
    # または
    python3 -m http.server 8000

file:// で直接開いても表示されますが、サーバー経由での確認を推奨します。

## 公開時に対応が必要な箇所

- `contact.html` のフォームは現在フロント側の入力チェックのみです。`<form action>` を実際の送信先に差し替えてください。
- `metal.html` に「対象となるもの」「よくあるご質問」の TODO コメントが2か所あります。原稿が決まり次第、差し替えてください。
- 各ページの canonical / hreflang / OGP と `sitemap.xml` は https://www.wisteria-grp.jp を前提にしています。実際のドメインとURL構成にあわせて書き換えてください。
- 英語版（/en/）は未作成です。ヘッダーの EN リンクは現在ダミー（#）です。
- 古物商許可番号は埼玉県時代のものを暫定で掲載しています（会社概要）。
