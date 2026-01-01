# Tilt Maze - iPhone傾き迷路ゲーム

iPhoneの傾き操作でボールを動かして、ゴールを目指す2D迷路ゲームです。

## ゲーム仕様

- **操作方法**: iPhoneを傾けてボールを動かす
- **ゲームオーバー**: 壁にぶつかるとゲームオーバー
- **クリア**: ゴール（緑の四角）に到達するとクリア
- **視点**: 2D（上から見下ろす視点）

## 技術スタック

- **言語**: Swift
- **フレームワーク**:
  - SpriteKit (2Dゲームエンジン)
  - CoreMotion (加速度センサー)
- **最小iOS**: iOS 15.0以上

## プロジェクト構成

```
TiltMaze/
├── TiltMaze.xcodeproj/         # Xcodeプロジェクトファイル
│   └── project.pbxproj
└── TiltMaze/                   # ソースコード
    ├── AppDelegate.swift       # アプリケーションデリゲート
    ├── GameViewController.swift # ゲームビューコントローラー
    ├── GameScene.swift         # ゲームシーン（メインロジック）
    ├── Main.storyboard         # メインストーリーボード
    ├── LaunchScreen.storyboard # 起動画面
    ├── Info.plist              # アプリ設定
    └── Assets.xcassets/        # アセットカタログ
        ├── AppIcon.appiconset/
        └── Contents.json
```

## 主な機能

### 1. 物理エンジン (SpriteKit)
- ボールの動きに物理演算を適用
- 壁との衝突判定
- ゴールとの接触判定

### 2. 加速度センサー (CoreMotion)
- iPhoneの傾きをリアルタイムで検出
- 傾きに応じてボールに力を加える
- 更新間隔: 0.01秒（100Hz）

### 3. ゲームロジック
- スタート位置: 左下（50, 50）
- ゴール位置: 右上（画面サイズ - 50, 画面サイズ - 50）
- シンプルな迷路レイアウト
- リスタート機能（ゲーム終了後、画面タップ）

## ビルド＆実行方法

### 必要なもの
- Xcode 15.0以上
- iOS 15.0以上のiPhone実機（加速度センサーが必要なため、シミュレーターでは完全には動作しません）

### 手順

1. **プロジェクトを開く**
   ```bash
   cd TiltMaze
   open TiltMaze.xcodeproj
   ```

2. **開発チームの設定**
   - Xcodeでプロジェクトを開く
   - プロジェクト設定 → "Signing & Capabilities"
   - "Team"を選択（Apple IDでログインが必要）

3. **実機を接続**
   - iPhoneをMacに接続
   - Xcodeのデバイス選択で接続したiPhoneを選択

4. **ビルド＆実行**
   - Xcodeの再生ボタン（▶️）をクリック
   - または `Cmd + R`

## 遊び方

1. アプリを起動すると、左下にボール（赤）、右上にゴール（緑）が表示されます
2. iPhoneを傾けてボールを動かします
3. 壁（黒）に触れるとゲームオーバーです
4. ゴール（緑）に到達するとクリアです
5. ゲーム終了後、画面をタップするとリスタートできます

## カスタマイズ

### 迷路のレイアウトを変更する
`GameScene.swift` の `setupMaze()` メソッドで壁の配置を変更できます:

```swift
let walls: [(CGFloat, CGFloat, CGFloat, CGFloat)] = [
    // (x, y, width, height)
    (size.width * 0.3, size.height * 0.7, 150, wallWidth),
    // 新しい壁を追加...
]
```

### ボールの色やサイズを変更する
`GameScene.swift` の `setupBall()` メソッド:

```swift
let ballRadius: CGFloat = 15  // サイズ変更
ball.fillColor = .red         // 色変更
```

### 難易度調整
- ボールの速度: `update()` メソッドの `force` の乗数を調整
- 摩擦: `ball.physicsBody?.friction` を調整
- ダンピング: `ball.physicsBody?.linearDamping` を調整

## トラブルシューティング

### シミュレーターで動かない
- このゲームは加速度センサーを使用するため、実機でのテストが必要です
- シミュレーターでは傾き操作ができません

### ビルドエラーが出る
- 開発チームが設定されているか確認してください
- Bundle Identifierが他のアプリと重複していないか確認してください

### センサーの反応が悪い
- iPhoneケースを外してみてください
- `motionManager.accelerometerUpdateInterval` の値を調整してください

## ライセンス

このプロジェクトは学習目的で作成されています。

## 今後の拡張案

- [ ] 複数のレベル（ステージ）追加
- [ ] タイム計測機能
- [ ] ハイスコア記録
- [ ] サウンドエフェクト追加
- [ ] より複雑な迷路デザイン
- [ ] アイテム（スピードアップ、無敵など）
- [ ] 敵キャラクター追加
