// 音素材
// https://on-jin.com/
// https://dova-s.jp/bgm/play10124.html

export let mondai = [];

export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'Loading',
    });
  }

  preload(): void {

    // ===== ゲームオブジェクト =====
    // === Text
    // ロード中メッセージ
    const loadingText = (progress: number): string =>
      `ロード中です ... ${Math.round(progress * 100)}%`;
    const currentLoadingText = this.add.text(320, 240, loadingText(0)).setOrigin(0.5);

    // ===== イベント処理 =====
    // ロード進捗時
    this.load.on('progress', (progress: number) => {
      currentLoadingText.text = loadingText(progress);
    });

    // ロード完了時
    this.load.on('complete', () => {
      this.scene.start('BeforeTitle');
    });

    // ===== リソースファイル読み込み =====
    // 問題データ
    getFile();

    // Sound
    this.load.audio('title',['/assets/typing/audio/High_Speed_Mission.mp3']);
    this.load.audio('typing',['/assets/typing/audio/meka_ka_type02.mp3']);
    this.load.audio('typeMiss',['/assets/typing/audio/nori_ge_keyrock_cl02.mp3']);
    this.load.audio('success',['/assets/typing/audio/sei_ge_keyholder_toru02.mp3']);
    
    this.load.audio('gong1',['/assets/typing/audio/spo_ge_gong01.mp3']);
    this.load.audio('gong2',['/assets/typing/audio/gong2.mp3']);

    // Image
    this.load.image('titleBackground',['/assets/typing/sprite/title_background.jpg']);
    this.load.image('mainBackground',['/assets/typing/sprite/main_background.jpg']);

  }
}

// 問題データを読み込む
function getFile(): void {
  let req = new XMLHttpRequest();
  req.open('get', '/assets/typing/data/english.tsv', true);
  req.send(null); // HTTPリクエストの発行

  req.onload = function() {
    convertTSVtoArray(req.responseText);
  }
}

// 各行をタブで区切った配列を生成する
function convertTSVtoArray(str: string) : void {
  let tmp = str.split('\n');

  for(let i=0;i<tmp.length;++i){
    mondai[i] = tmp[i].split('\t');
  }
}

// 音声合成する
export function speak(sentence: string): void {
  const uttr = new SpeechSynthesisUtterance();
  uttr.volume = 1;
  
  uttr.voice = speechSynthesis
  .getVoices()
  .filter(voice => voice.lang.match(/en/))[0];

  uttr.text = sentence;
  uttr.pitch = 0.8;
  uttr.volume = 1.0;

  speechSynthesis.speak(uttr);  
}
