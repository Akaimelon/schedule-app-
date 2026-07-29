# ひまわり予定表

療育施設の月間スケジュールと利用状況を管理するウェブアプリです。
デモ: https://schedule-app-one-psi.vercel.app/

## 主な機能

- 月間カレンダー（平日のみ・祝日表示: holidays-jp API）
- 日別の出席登録（1日の定員10人・満員時は選択不可）
- 午前/午後（排他制御）・送り/迎えの管理
- 子供の登録・編集・削除・名前色・ドラッグ並び替え
- 利用状況の自動集計（契約日数/利用日数/残り）
- 先月の予定を曜日順でコピー（コピー先が祝日の日はスキップ）
- A4横向きの印刷レイアウト
- 保存先の自動切り替え: ローカルでは PHP + JSON ファイル、API の無い環境では localStorage に自動フォールバック

## 技術スタック

- React 19（Hooks / Context API）
- Vite
- Tailwind CSS v4
- PHP（ローカル開発時の保存 API）
- デプロイ: Vercel

## セットアップ（ローカル）

```bash
npm install
npm run dev        
php -S localhost:8000   
```

PHP を起動しない場合は localStorage モードで動作します。

## 今後の追加したい機能

保護者向け閲覧機能
