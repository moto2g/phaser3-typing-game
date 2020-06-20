import {speak} from "./loading-scene";
import {lastScore} from "./main-scene";

export default class TitleScene extends Phaser.Scene {
  private sfx_title: Phaser.Sound.BaseSound | null = null;
  private sfx_gong1: Phaser.Sound.BaseSound | null = null;

  private titleBackGroundImage: Phaser.GameObjects.Image;

  private lastScoreText: Phaser.GameObjects.Text;
  private maxScoreText: Phaser.GameObjects.Text;
  private pushSpaceText: Phaser.GameObjects.Text;
  private muteText: Phaser.GameObjects.Text;
  private fontSize = 32;
  private addFontSize = 0.2;
  
  private spacebar: Phaser.Input.Keyboard.Key;

  private maxScore = 0;

  constructor() {
    super({
      key: 'Title',
    });
  }

  create(): void {
    // ===== 初期化 =====
    if (this.maxScore < lastScore) {
      this.maxScore = lastScore;
    }

    // ===== ゲームオブジェクト =====
    // Sound
    if (this.sfx_gong1 == null) this.sfx_gong1 = this.sound.add('gong1', {volume: 0.1});
    if (this.sfx_title == null) {
      this.sfx_title = this.sound.add('title', {
        mute: false,
        volume: 0.1,
        rate: 1,
        detune: 0,
        seek: 0,
        loop: true,
        delay: 0
      });
      this.sfx_title.play();
    }

    // Image
    this.titleBackGroundImage = this.add.sprite(320, 240, 'titleBackground');
    this.titleBackGroundImage.displayWidth = 640;
    this.titleBackGroundImage.scaleY = this.titleBackGroundImage.scaleX;

    // Text
    this.maxScoreText = this.add.text(100, 200, '最高スコア:' + String(this.maxScore)).setOrigin(0,0).setFontSize(24).setFontFamily('monospace, serif').setColor('Black');
    this.lastScoreText = this.add.text(100,240, '前回スコア:' + String(lastScore)).setOrigin(0,0).setFontSize(24).setFontFamily('monospace, serif').setColor('Black');
    this.pushSpaceText = this.add.text(320, 310, 'スペースキーでスタート').setOrigin(0.5).setFontSize(32).setFontFamily('monospace, serif').setColor('Blue');

    this.muteText = this.add.text(590, 390, 'BGMのミュートON/OFF').setOrigin(1).setFontSize(24).setFontFamily('monospace, serif').setColor('Black');
    this.muteText.setInteractive();

    // ===== イベント =====
    this.muteText.on('pointerdown', () => {
      if(this.sfx_title.isPlaying) {
        this.sfx_title.stop();
      } else {
        this.sfx_title.play();
      }
    });

    // ===== 開始 =====
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    speak(' ');
  }

  update (): void {
    this.fontSize += this.addFontSize;
    if(this.fontSize < 32 || 36 < this.fontSize ) this.addFontSize *= -1;
    this.pushSpaceText.setFontSize(this.fontSize);

    if (Phaser.Input.Keyboard.JustDown(this.spacebar))
    {
      this.sfx_gong1.play();
      this.scene.start('Main');
    }
  }
}
 