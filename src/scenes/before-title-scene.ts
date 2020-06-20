export default class BeforeTitleScene extends Phaser.Scene {
  private titleBackGroundImage: Phaser.GameObjects.Image;

  private pushSpaceText: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: 'BeforeTitle',
    });
  }
  preload(): void {

  }

  create(): void {
    // ===== ゲームオブジェクト =====
    // Image
    this.titleBackGroundImage = this.add.sprite(320, 240, 'titleBackground');
    this.titleBackGroundImage.displayWidth = 640;
    this.titleBackGroundImage.scaleY = this.titleBackGroundImage.scaleX;

    // Text
    this.add.text(320, 250, '！注意！\n\nこの先は音が出ます\n音量にご注意ください').setAlign('center').setOrigin(0.5).setFontSize(24).setFontFamily('monospace, serif').setColor('Red');
    this.pushSpaceText = this.add.text(320, 340, '<ここをクリックしてスタート>').setOrigin(0.5).setFontSize(32).setFontFamily('monospace, serif').setColor('Black');
    this.pushSpaceText.setInteractive();
  
    // ===== イベント処理 =====
    this.pushSpaceText.on('pointerdown', () => {
      this.scene.start('Title');
    });

  }

  update (): void {
  }
}
 