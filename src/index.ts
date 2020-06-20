/*
Copyright (c) 2020 moto2g
Released under the MIT license
https://opensource.org/licenses/mit-license.php
*/
import 'phaser';
import Scenes from './scenes/scenes';

const config: Phaser.Types.Core.GameConfig = {
  width: 640,
  height: 480,
  type: Phaser.AUTO,
  parent: 'game', // ゲーム画面を描画するHTML要素のid
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'game',
  },
  scene: Scenes,
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

// HTMLがロードされた後にゲームを生成
window.addEventListener('load', () => {
  const game = new Game(config);
});
