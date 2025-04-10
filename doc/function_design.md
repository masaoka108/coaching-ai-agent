# MASTRA コーチングAIエージェント：機能一覧

以下に、MASTRAで開発するコーチングAIエージェントに必要と考えられる機能を、Must要件（必須機能）とWant要件（あると望ましい機能）に整理してリストアップします。

---

## Must要件（必須機能）

### 1. 朝・夜の会話フロー実行

- **朝の質問フロー**  
  - 毎日最初の対話（または当日未回答の場合）で、以下の3つの質問を順番に提示する。  
    1. 「今晩ベッドに向かう前にどんな成果が出ていれば最高の価値があるか？」  
    2. 「そのためにあなたが創るコンテキストは何か？」  
    3. 「そのコンテキストを体現する言動は何か？」（言葉や行動の違い）

- **夜の質問フロー**  
  - 夜にユーザーがチャットを開始し、すでに朝の質問に回答済みであれば「今日の振り返りをする？」と問いかける。  
    - YESの場合、以下の7つの質問を順番に提示する。  
      1. 「今日1日の私のフォーカスは何だったか？」  
      2. 「そのために創った行動の違いは何か？」  
      3. 「結果はどうなったか？」  
      4. 「上手くいったことは何か？」  
      5. 「上手くいかなかったことは何か？」  
      6. 「この瞬間からどうすれば上手くいくか？」  
      7. 「なぜ上手くいくと言えるのか？（事実ベースの事例があれば最高）」

### 2. 日単位での状態管理

- 1日に初めてアクセスがあったタイミングで「朝の質問フロー」を行うよう制御する。  
  - もし夜に初めてアクセスがあった場合は朝の質問を先に行い、その後に夜の振り返りを提案。
- 当日の朝の質問への回答があるかどうかをフラグ管理し、夜の振り返りを行うかどうかを切り替える。

### 3. 対話ログの保存

- ユーザーが朝・夜の質問に答えた内容を必ず記録する。  
- 日付と紐付けて保存し、同日の朝と夜の回答をまとめて管理できる形にする。

---

## Want要件（望ましい機能）

### 1. 日毎の回答内容を一覧・検索できる

- 朝・夜の回答を日毎に分けて蓄積し、ユーザーがいつでも振り返られるようにする。  
- 過去の回答を検索、あるいは期間指定で一覧を取得可能にする。

### 2. 結果の要約機能

- ユーザーが1日分の朝・夜回答を終えたタイミングで、その日の内容を自動的に要約し、簡単に読み返せるレポートを生成する。  
- 例：「今日のフォーカス」「成果」「今後の改善ポイント」などを要約表示。

### 3. 点数化・スコアリング機能

- 日毎の活動や自己評価を数値スコア化する仕組み。  
- たとえば「達成感」「充実度」などをユーザー自身に入力してもらい、日々のスコア変化を可視化する。

### 4. ダッシュボード表示

- 過去の回答やスコアをグラフ化し、一覧表示できるダッシュボード機能。  
- ユーザーが自分の成長度合いや傾向を一目で確認できる。

### 5. リマインド通知機能

- 朝・夜の時間帯、あるいはユーザーが未回答の場合に、プッシュ通知やアラートを出して回答を促す。  
- 例：スマホ通知やメール連携など。

### 6. 柔軟な会話制御

- ユーザーが一部の質問に答えられなかったり、スキップしたい場合にスキップを許容する設計。  
- スキップ時に後から追加入力ができるようにする。

### 7. 事実ベースの例示サポート

- 夜の質問 (7)「なぜ上手くいくと言えるのか？」に対して、AIが過去の回答や学習済みの事例を参照しながらヒントや具体例を提示できる機能。

### 8. パーソナライズドコーチングヒント

- 蓄積された回答履歴をもとに、翌朝の質問や夜の振り返り時に、AIがユーザー特有の傾向を踏まえたアドバイスを加える。  
- 例：「以前はこういう取り組みが上手くいっていましたが、今回も参考になりそうですね」といった提示。

---

## 実装時のポイント

- **データモデリング**  
  - 「ユーザーID」「日付」「朝の回答内容」「夜の回答内容」「スコア」などを適切にデータベース設計する。

- **会話フロー制御**  
  - 「朝の質問未回答」と「夜の質問未回答」フラグを用いて、質問の順番や出し分けを制御する。

- **UI/UX設計**  
  - 毎日利用することが前提のため、シンプルで操作しやすいUIが望ましい。  
  - 特にダッシュボードはモチベーションを維持できるよう、視覚的にわかりやすいチャートや目標管理表を使うと効果的。

- **セキュリティとプライバシー**  
  - コーチング内容には個人的な情報が含まれる可能性が高いため、ユーザーデータの保護とアクセス権限管理が重要。

---