import SpriteKit
import CoreMotion

class GameScene: SKScene, SKPhysicsContactDelegate {

    // 物理ボディのカテゴリ
    struct PhysicsCategory {
        static let ball: UInt32 = 0x1 << 0
        static let wall: UInt32 = 0x1 << 1
        static let goal: UInt32 = 0x1 << 2
    }

    // ゲームオブジェクト
    var ball: SKShapeNode!
    var goal: SKShapeNode!

    // CoreMotion
    let motionManager = CMMotionManager()

    // ゲームステート
    var isGameOver = false
    var isGameClear = false

    override func didMove(to view: SKView) {
        setupPhysics()
        setupMaze()
        setupBall()
        setupGoal()
        setupMotionDetection()
        addGameLabels()
    }

    // MARK: - セットアップ

    func setupPhysics() {
        physicsWorld.gravity = CGVector(dx: 0, dy: 0)
        physicsWorld.contactDelegate = self

        // 画面の枠を物理ボディとして設定
        let border = SKPhysicsBody(edgeLoopFrom: self.frame)
        border.friction = 0
        self.physicsBody = border
    }

    func setupMaze() {
        // シンプルな迷路レイアウト
        let wallWidth: CGFloat = 10
        let wallColor = SKColor.black

        // 壁のデータ (x, y, width, height)
        let walls: [(CGFloat, CGFloat, CGFloat, CGFloat)] = [
            // 外枠（上下左右）
            (size.width/2, 10, size.width, 20),                    // 下
            (size.width/2, size.height - 10, size.width, 20),      // 上
            (10, size.height/2, 20, size.height),                  // 左
            (size.width - 10, size.height/2, 20, size.height),     // 右

            // 内部の壁
            (size.width * 0.3, size.height * 0.7, 150, wallWidth),
            (size.width * 0.7, size.height * 0.5, wallWidth, 200),
            (size.width * 0.5, size.height * 0.3, 200, wallWidth),
            (size.width * 0.3, size.height * 0.4, wallWidth, 150),
        ]

        for (x, y, w, h) in walls {
            let wall = SKSpriteNode(color: wallColor, size: CGSize(width: w, height: h))
            wall.position = CGPoint(x: x, y: y)
            wall.physicsBody = SKPhysicsBody(rectangleOf: CGSize(width: w, height: h))
            wall.physicsBody?.isDynamic = false
            wall.physicsBody?.categoryBitMask = PhysicsCategory.wall
            wall.physicsBody?.contactTestBitMask = PhysicsCategory.ball
            wall.physicsBody?.friction = 0
            addChild(wall)
        }
    }

    func setupBall() {
        let ballRadius: CGFloat = 15
        ball = SKShapeNode(circleOfRadius: ballRadius)
        ball.position = CGPoint(x: 50, y: 50)
        ball.fillColor = .red
        ball.strokeColor = .darkGray
        ball.lineWidth = 2

        ball.physicsBody = SKPhysicsBody(circleOfRadius: ballRadius)
        ball.physicsBody?.isDynamic = true
        ball.physicsBody?.categoryBitMask = PhysicsCategory.ball
        ball.physicsBody?.contactTestBitMask = PhysicsCategory.wall | PhysicsCategory.goal
        ball.physicsBody?.collisionBitMask = PhysicsCategory.wall
        ball.physicsBody?.friction = 0.3
        ball.physicsBody?.restitution = 0.2
        ball.physicsBody?.linearDamping = 0.5
        ball.physicsBody?.angularDamping = 0.5

        addChild(ball)
    }

    func setupGoal() {
        let goalSize: CGFloat = 40
        goal = SKShapeNode(rectOf: CGSize(width: goalSize, height: goalSize), cornerRadius: 5)
        goal.position = CGPoint(x: size.width - 50, y: size.height - 50)
        goal.fillColor = .green
        goal.strokeColor = .darkGray
        goal.lineWidth = 2

        goal.physicsBody = SKPhysicsBody(rectangleOf: CGSize(width: goalSize, height: goalSize))
        goal.physicsBody?.isDynamic = false
        goal.physicsBody?.categoryBitMask = PhysicsCategory.goal
        goal.physicsBody?.contactTestBitMask = PhysicsCategory.ball

        addChild(goal)

        // ゴールのアニメーション
        let pulse = SKAction.sequence([
            SKAction.scale(to: 1.2, duration: 0.5),
            SKAction.scale(to: 1.0, duration: 0.5)
        ])
        goal.run(SKAction.repeatForever(pulse))
    }

    func setupMotionDetection() {
        if motionManager.isAccelerometerAvailable {
            motionManager.accelerometerUpdateInterval = 0.01
            motionManager.startAccelerometerUpdates()
        }
    }

    func addGameLabels() {
        // タイトルラベル
        let titleLabel = SKLabelNode(fontNamed: "Arial-BoldMT")
        titleLabel.text = "Tilt Maze"
        titleLabel.fontSize = 24
        titleLabel.fontColor = .blue
        titleLabel.position = CGPoint(x: size.width/2, y: size.height - 40)
        addChild(titleLabel)

        // 説明ラベル
        let instructionLabel = SKLabelNode(fontNamed: "Arial")
        instructionLabel.text = "iPhoneを傾けてボールを動かそう！"
        instructionLabel.fontSize = 14
        instructionLabel.fontColor = .gray
        instructionLabel.position = CGPoint(x: size.width/2, y: 30)
        addChild(instructionLabel)
    }

    // MARK: - Update

    override func update(_ currentTime: TimeInterval) {
        if isGameOver || isGameClear {
            return
        }

        // 加速度センサーからのデータを取得
        if let accelerometerData = motionManager.accelerometerData {
            let acceleration = accelerometerData.acceleration

            // iPhoneの傾きに応じてボールに力を加える
            // x軸とy軸を反転して自然な動きに
            let force = CGVector(
                dx: CGFloat(acceleration.x) * 50,
                dy: CGFloat(acceleration.y) * 50
            )

            ball.physicsBody?.applyForce(force)
        }
    }

    // MARK: - 衝突判定

    func didBegin(_ contact: SKPhysicsContact) {
        let collision = contact.bodyA.categoryBitMask | contact.bodyB.categoryBitMask

        // ボールと壁の衝突
        if collision == (PhysicsCategory.ball | PhysicsCategory.wall) {
            gameOver()
        }

        // ボールとゴールの衝突
        if collision == (PhysicsCategory.ball | PhysicsCategory.goal) {
            gameClear()
        }
    }

    // MARK: - ゲーム終了処理

    func gameOver() {
        if isGameOver || isGameClear {
            return
        }

        isGameOver = true
        motionManager.stopAccelerometerUpdates()

        // ボールを赤く点滅
        let blink = SKAction.sequence([
            SKAction.fadeAlpha(to: 0.3, duration: 0.2),
            SKAction.fadeAlpha(to: 1.0, duration: 0.2)
        ])
        ball.run(SKAction.repeat(blink, count: 3))

        // ゲームオーバーメッセージ
        showMessage("Game Over!", color: .red)
    }

    func gameClear() {
        if isGameOver || isGameClear {
            return
        }

        isGameClear = true
        motionManager.stopAccelerometerUpdates()

        // ボールを緑に変更
        ball.fillColor = .green

        // クリアメッセージ
        showMessage("Clear!", color: .green)

        // 花火エフェクト
        let emitter = SKEmitterNode()
        emitter.particleTexture = SKTexture(imageNamed: "spark")
        emitter.particleBirthRate = 100
        emitter.numParticlesToEmit = 50
        emitter.particleLifetime = 2
        emitter.emissionAngle = 0
        emitter.emissionAngleRange = 360
        emitter.particleSpeed = 100
        emitter.particleSpeedRange = 50
        emitter.particleAlpha = 1.0
        emitter.particleAlphaRange = 0.5
        emitter.particleScale = 0.5
        emitter.particleScaleRange = 0.2
        emitter.particleColorBlendFactor = 1
        emitter.particleColor = .yellow
        emitter.position = ball.position
        addChild(emitter)

        // エミッターを削除
        emitter.run(SKAction.sequence([
            SKAction.wait(forDuration: 2),
            SKAction.removeFromParent()
        ]))
    }

    func showMessage(_ text: String, color: SKColor) {
        let label = SKLabelNode(fontNamed: "Arial-BoldMT")
        label.text = text
        label.fontSize = 48
        label.fontColor = color
        label.position = CGPoint(x: size.width/2, y: size.height/2)
        label.alpha = 0
        addChild(label)

        let fadeIn = SKAction.fadeIn(withDuration: 0.3)
        let wait = SKAction.wait(forDuration: 2)
        let fadeOut = SKAction.fadeOut(withDuration: 0.3)
        label.run(SKAction.sequence([fadeIn, wait, fadeOut]))

        // リスタートメッセージ
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) {
            self.showRestartMessage()
        }
    }

    func showRestartMessage() {
        let label = SKLabelNode(fontNamed: "Arial")
        label.text = "タップしてリスタート"
        label.fontSize = 20
        label.fontColor = .white
        label.position = CGPoint(x: size.width/2, y: size.height/2 - 50)
        label.name = "restartLabel"
        addChild(label)

        // 点滅アニメーション
        let blink = SKAction.sequence([
            SKAction.fadeAlpha(to: 0.3, duration: 0.5),
            SKAction.fadeAlpha(to: 1.0, duration: 0.5)
        ])
        label.run(SKAction.repeatForever(blink))
    }

    // MARK: - タッチイベント

    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        if isGameOver || isGameClear {
            restartGame()
        }
    }

    func restartGame() {
        // シーンをリロード
        let newScene = GameScene(size: self.size)
        newScene.scaleMode = .aspectFill
        self.view?.presentScene(newScene, transition: SKTransition.fade(withDuration: 0.5))
    }

    deinit {
        motionManager.stopAccelerometerUpdates()
    }
}
