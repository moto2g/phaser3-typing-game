import {mondai, speak} from "./loading-scene";
export let lastScore = 0;

type Union = 'starting' | 'playing' | 'timeover';

export default class MainScene extends Phaser.Scene {
  private defaultRestTime = 30;
  
  private gameStatus: Union;

  private lastKey: string;
  private englishSentence: string;
  private japaneseSentence: string;
  
  private inputIndex: number;
  private questionIndex: number;
  private waitingKey: string;
  private questions: string[];
  private score: number;
  private restTime: number;

  // GameObjects
  private mainBackGroundImage: Phaser.GameObjects.Image;

  private scoreText: Phaser.GameObjects.Text;
  private timerText: Phaser.GameObjects.Text;

  private englishText: Phaser.GameObjects.Text;
  private cursorText: Phaser.GameObjects.Text;
  private japaneseText: Phaser.GameObjects.Text;
  private lastKeyText: Phaser.GameObjects.Text;

  private backText: Phaser.GameObjects.Text;

  private sfx_typing: Phaser.Sound.BaseSound;
  private sfx_typeMiss: Phaser.Sound.BaseSound;
  private sfx_success: Phaser.Sound.BaseSound;
  private sfx_gong2: Phaser.Sound.BaseSound;

  constructor() {
    super({
      key: 'Main',
      physics: { arcade: { debug: true } },
    });
  }
  preload(): void {

  }

  create(): void {
    // ===== 初期化 =====
    this.gameStatus = 'starting';
    this.restTime = this.defaultRestTime;
    this.score = 0;
    this.inputIndex = 0;
    this.questionIndex = 0;
    this.waitingKey = "";
    this.questions = mondai;

    // ===== ゲームオブジェクト =====
    // === Sound
    this.sfx_typing = this.sound.add('typing', {volume: 0.7});
    this.sfx_typeMiss = this.sound.add('typeMiss', {volume: 0.5});
    this.sfx_success = this.sound.add('success', {volume: 0.8});
    this.sfx_gong2 = this.sound.add('gong2', {volume: 0.2});
    
    // === Image
    this.mainBackGroundImage = this.add.sprite(320, 240, 'mainBackground');

    // === Text
    // スコア、タイマー
    this.add.text(370, 27, 'スコア').setFontSize(32).setFontFamily('monospace, serif').setOrigin(0);
    this.scoreText = this.add.text(600, 27, String(this.score)).setOrigin(1,0).setFontSize(32).setFontFamily('monospace, serif');
    this.timerText = this.add.text(100, 27, String(this.restTime)).setOrigin(1,0).setFontSize(32).setFontFamily('monospace, serif');

    // 英文
    this.englishText = this.add.text(320, 140, '').setFontSize(48).setFontFamily('monospace, serif').setOrigin(0.5);
    this.cursorText = this.add.text(320, 190, '').setFontSize(48).setFontFamily('monospace, serif').setOrigin(0.5);

    // 和文
    this.japaneseText = this.add.text(320, 300, '').setFontSize(16).setFontFamily('monospace, serif').setOrigin(0.5).setColor('Black').setWordWrapWidth(500);

    // 入力されたキー
    this.lastKeyText = this.add.text(60, 440, '').setFontSize(20).setFontFamily('monospace, serif').setOrigin(0.5).setColor('White');
    this.lastKeyText.setVisible(false);

    // タイトルへ戻る
    this.backText = this.add.text(490, 440, 'タイトルへ戻る').setFontSize(20).setFontFamily('monospace, serif').setOrigin(0).setColor('White');


    // ===== イベント処理 =====
    // キーが押されたとき
    this.input.keyboard.on('keydown', (event) => { this.typing(event); });

    // 戻るが押されたとき
    this.backText.setInteractive();
    this.backText.on('pointerdown', () => {
      timer.remove();
      this.gameStatus = 'timeover';
      lastScore = 0;
      this.scene.start('Title');
    });

    // タイマー
    const timer = this.time.addEvent({
      delay: 1000,
      loop: true
    });

    // タイマーのコールバック
    timer.callback = () => {
      if(this.gameStatus == 'playing') {
        this.restTime--;
        this.timerText.text = String(this.restTime);

        if(this.restTime <= 0) {
          this.gameStatus = 'timeover';
          lastScore = this.score;
          this.sfx_gong2.play();
        }

      } else if(this.gameStatus == 'timeover') {
        // タイムオーバーになった次のコールバックでタイトルに戻る
        timer.remove();
        this.scene.start('Title');
      }
    }

    // ===== 開始 =====
    this.gameStatus = 'playing';
    this.question();
  }

  update(): void {

  }

  // キータイプ時
  typing(event): void {
    console.log(event.key);
    if ( this.gameStatus != 'playing' ) return;

    this.englishSentence
    this.lastKey = event.key.toLowerCase();
    this.lastKeyText.text = this.lastKey;

    // Hitしたかチェック
    if (this.waitingKey == event.key.toLowerCase()) {
      // ヒットした
      this.inputIndex++;
      this.score++;
      this.scoreText.text = String(this.score);

      if(this.inputIndex > this.englishSentence.length - 1) {
        // 次の問題に移る
        this.sfx_success.play();
        this.question();
      } else {
        this.sfx_typing.play();
        // 次の文字に移る
        this.waitingKey = this.englishSentence[this.inputIndex].toLowerCase();
        this.cursorText.text = getCursorString(this.englishSentence.length, this.inputIndex);
      }

    } else {
      // ヒットしていない
      this.sfx_typeMiss.play();
    }
  }

  // 問題を出す
  question() : void {
    this.questionIndex = Math.floor( Math.random() * this.questions.length );
    this.englishSentence = this.questions[this.questionIndex][0];
    this.japaneseSentence = this.questions[this.questionIndex][1];

    this.inputIndex = 0;
    this.waitingKey = this.englishSentence[this.inputIndex].toLowerCase();

    this.englishText.text = this.englishSentence;
    this.cursorText.text = getCursorString(this.englishSentence.length, this.inputIndex);
    this.japaneseText.text = this.japaneseSentence;
    speak(this.englishSentence);
  }
}

// カーソル部分の文字列を生成する
function getCursorString(len: integer, idx: integer): string {
  let result: string;
  result = ' '.repeat(idx);
  result += '^';
  result += ' '.repeat(len - idx - 1);
  return result;
}