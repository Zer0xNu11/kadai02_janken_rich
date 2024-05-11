'use strict'
{
let hands = [];
let tiles = [];
let handCounter = {
  goo: 0,
  choki: 0,
  paa: 0,
  total: 0
};
let openedHand = 0;
let scorePoint = 0;
let scoreTime = 0;

//Config---------------------------------
const maxTime = 1000;
$("#timer").html(maxTime); 
let setTotalHands = 20;
let debug = 1;
let debugScore = 50000;
// -----------------------------------------

let isPlaying = -1; //-1-selectDifficulty 0-beforestart 1-playing 2-finished
let cursor = 1; //1-goo 2-choki 5-paa
let score = {
  win: 0,
  draw: 0,
  lose: 0,
}
// console.log(score);

// タイルの設定----------------------------------------------------------------
 class Tile{
   constructor(tile_id = undefined,  cordinate_x, cordinate_y ,hand = 0){
    this.tile_id = tile_id;
    this.cordinate_x = cordinate_x;
    this.cordinate_y = cordinate_y;
    this.hand = hand;
    this.isOpend = 0; 

    this.createSelf();
   }

   createSelf(){
    $("<div>",{
      id: `tile${this.tile_id}`,
      class: 'bg-gray-500 w-10 h-10 rounded-xl shadow-black/80 shadow-md hover:opacity-70 text-center transition active:translate-y-1 active:shadow-none active:opacity-40 text-white font-bold select-none m-4 py-2 px-2 bg-cover'
    }).appendTo('#buttonBox');
   }

   onClick(){
      $(`#tile${this.tile_id}`).on('click', ()=>{


        
       if(isPlaying != 2){
        this.open();
        if(this.isOpend === 0){
          if(this.hand>0){openedHand ++;}
          this.judgeBattle();
          scorePoint += 10;
          this.isOpend = 1;
          counter();
        }
        if(isPlaying === 0){startGame();}
        
        // debug------
        if(debug === 1){
          finishGame();
        }
        // --------------

        // console.log(`this tile id = ${this.tile_id} hand = ${this.hand} (x,y) = (${this.cordinate_x}, ${this.cordinate_y}) hands = ${this.handSum}`);
       }
      //  console.log("score="+scorePoint);
      });   
   }

   
   open(){
     if(this.isOpend === 0)
     {
       this.calchands();
       this.turnTileOpen();
      }
    }
    
    calchands(){
     this.handSum = 0
 
 // 左端
     if(this.cordinate_x === 0){
       if(this.cordinate_y === 0){
         this.aroundTiles =[
           null, null, null,
           null, this.tile_id+1,
           null, this.tile_id+10, this.tile_id+11
          ];
       }
       else if(this.cordinate_y === 9){
        this.aroundTiles =[
         null, this.tile_id-10, this.tile_id-9,
         null, this.tile_id+1,
         null, null, null
        ];
       }
       else{
         this.aroundTiles =[
           null, this.tile_id-10, this.tile_id-9,
           null, this.tile_id+1,
           null, this.tile_id+10, this.tile_id+11
          ];
       }
 
     }
 
 // 右端
     else if(this.cordinate_x === 9){
       if(this.cordinate_y === 0){
         this.aroundTiles =[
           null, null, null,
           this.tile_id-1, null,
           this.tile_id+9, this.tile_id+10, null
          ];
       }
 
       else if(this.cordinate_y === 9){
         this.aroundTiles =[
           this.tile_id-11, this.tile_id-10, null,
           this.tile_id-1, null,
           null, null, null
          ];
       }
       else{
         this.aroundTiles =[
           this.tile_id-11, this.tile_id-10, null,
           this.tile_id-1, null,
           this.tile_id+9, this.tile_id+10, null
          ];
       }
 
     }
 
 // 上橋
     else if(this.cordinate_y === 0){
       this.aroundTiles =[
         null, null, null,
         this.tile_id-1, this.tile_id+1,
         this.tile_id+9, this.tile_id+10, this.tile_id+11
        ];
     }
 
 // 下端
     else if(this.cordinate_y === 9){
       this.aroundTiles =[
         this.tile_id-11, this.tile_id-10, this.tile_id-9,
         this.tile_id-1, this.tile_id+1,
         null, null, null,
        ];
     }
 
 // 中部分
     else{
      this.aroundTiles =[
       this.tile_id-11, this.tile_id-10, this.tile_id-9,
       this.tile_id-1, this.tile_id+1,
       this.tile_id+9, this.tile_id+10, this.tile_id+11
      ];
     }
 
     this.aroundTiles.forEach(aroundtile => {
       if(aroundtile != null){
        this.handSum += tiles[aroundtile].hand;
       }
     });
    }

   turnTileOpen(){
    $(`#tile${this.tile_id}`).removeClass(`bg-gray-500`);
    $(`#tile${this.tile_id}`).addClass(`bg-[url('../img/${this.hand}.svg')] bg-black`);
    $(`#tile${this.tile_id}`).html(`${this.handSum}`);
   }

   judgeBattle(){
    if(this.hand === 0){
      return;
    }
    else{
      let judge = this.hand - cursor;
      // console.log(judge);
      if(angelMode === 3){score.win ++; return;}
      if(judge === 0){score.draw +=1; emotionReset();   $(`#smile2`).removeClass('hidden');}
      else if([3,1,-4].includes(judge)){score.win ++; emotionReset();   $(`#smile1`).removeClass('hidden');}
      else if([-3,-1,4].includes(judge)){score.lose ++;  emotionReset();  $(`#smile3`).removeClass('hidden');}
    }
   }

 }

// タイル生成

function prepareTile(){
let judgeHandAmount;
 do{  
  resetHands();
  setHands();
  judgeHandAmount = handCounter.total;
  // console.log(hands);
  // console.log(judgeHandAmount);
  // console.log(handCounter.total)
 }while(judgeHandAmount != setTotalHands);

 generateTile();
  for(let i=0; i<100; i++){
  tiles[i].onClick();
 }
}



function setHands(){
  for(let i=0; i<100; i++){
    let hand = Math.random()*100;
    if(hand<100 - setTotalHands){hand=0;}
    else if(hand<100 - setTotalHands*2/3){hand = 1; handCounter.goo ++; handCounter.total ++;}
    else if(hand<100 - setTotalHands*1/3){hand = 2; handCounter.choki ++; handCounter.total ++;}
    else{hand = 5; handCounter.paa ++; handCounter.total ++;}
    hands.push(hand);
}}


function generateTile(){
 for(let i=0; i<100; i++){
  tiles.push(new Tile(i, i%10, Math.floor(i/10), hands[i]));
 }
}

function resetHands(){
  hands.length = 0;
  handCounter = {
    goo: 0,
    choki: 0,
    paa: 0,
    total: 0
  };
}

// 画面管理------------------------------------------------------------
function counter(){
  $(`#winCounter`).html(`${score.win}`);
  $(`#drawCounter`).html(`${score.draw}`);
  $(`#loseCounter`).html(`${score.lose}`);
  $(`#restCounter`).html(`${handCounter.total - openedHand}`);
  if(handCounter.total - openedHand === 0){finishGame();}
}

// タイマー
function timer(){
  const starttime = Date.now();
  let time;
  let timeCount = setInterval(()=>{
    if(time <=0){clearInterval(timeCount); 
      for(let i=0; i<5; i++){time=0;}
      return;}
    if(isPlaying === 2){
      clearInterval(timeCount);
      return;}
    time = maxTime-(Date.now() - starttime)/1000;
    // console.log(time);
    $("#timer").html(Math.round(time));
    scoreTime = Math.round(time);
  },1000);
 
}

//システム

function startGame(){
  timer();
  $('#smile1').attr('src', '../img/kachi.png');
  isPlaying = 1;
}

function finishGame(){
  isPlaying = 2;
  calcScore();
  $("#scorePoint").html(scorePoint);
  for(let i=0; i<100; i++){
      tiles[i].open();
  }
  emotionReset(); 
  $(`#help`).addClass('hidden');
  $(`#smile0`).removeClass('hidden');
  $(`#result`).removeClass('hidden');

  //debug
  if(debug === 1){
    scorePoint = debugScore;
    $("#scorePoint").html(scorePoint);
  }

}

//イメージ管理
function emotionReset(){
  for(let i=0; i<4; i++){
    $(`#smile${i}`).addClass('hidden');
  }
}

//スコア計算
function calcScore(){
  scorePoint += score.win*500 - score.draw*100 - score.lose*1000 + scoreTime*10;
  // console.log("result score="+scorePoint);
  // console.log("timeScore="+ scoreTime);
}

 console.log(handCounter);


//ユーザー操作----------------------------------------

//難易度選択
$(`#easy`).on('click', ()=>{
  setTotalHands = 20;
  isPlaying = 0;
  $(`#difficulty`).addClass('hidden');
  prepareTile();
});
$(`#normal`).on('click', ()=>{
  setTotalHands = 35;
  isPlaying = 0;
  $(`#difficulty`).addClass('hidden');
  prepareTile();
});
$(`#hard`).on('click', ()=>{
  setTotalHands = 50;
  isPlaying = 0;
  $(`#difficulty`).addClass('hidden');
  prepareTile();
});




//結果画面
$(`#result`).on('click', ()=>{
  $(`#result`).addClass('hidden');
  $(`#resultMessage`).removeClass('hidden');
  if(scorePoint <= -40000){
    $('#smile0').attr('src', '../img/akuma.jpg');
    $(`#rank`).html('Rank-1 悪魔');
    $(`#comment`).html('どうやらあなたはよほどのもの好きのようですね。すでに地獄には行かれましたでしょうか？まだでしたらスマイルくんを最初に66回殴りましょう。もちろんグーで。')
  }
  else if(scorePoint <-10000){
      $('#smile0').attr('src', '../img/blackhole.jpg');
      $(`#rank`).html('Rank0 ブラックホール');
      $(`#comment`).html('狙った？逆にすごい得点です。よほど運が悪いか、hardモードを適当にやりすぎたか。そんなあなたに秘密をお教えします。スマイルくんをパーチョキグーの順番で触ってみましょう。');
  }
  else if(scorePoint <5000){
      $('#smile0').attr('src', '../img/mizinko.jpg');
      $(`#rank`).html('Rank1 ミジンコ');
      $(`#comment`).html('クリアおめでとうございます。可愛らしい戦績ですが、何事もまずはやり遂げることが大事ですからね。得点は時間よりも勝敗を気にしたほうが伸びると思います。');
  }
  else if(scorePoint <10000){
      $('#smile0').attr('src', '../img/petcap.jpg');
      $(`#rank`).html('Rank2 ペットボトルのキャップ');
      $(`#comment`).html('ペットボトルのキャップって上の方に切れ込みが入っている事があるのですが、ご存知でしたか？製造工程で呑み口部分を洗浄する水が通るためのものらしいですよ。面白いですね。');
  }
  else if(scorePoint <12000){
      $('#smile0').attr('src', '../img/mikan.jpg');
      $(`#rank`).html('Rank3 みかん');
      $(`#comment`).html('お正月の鏡餅の上に乗ってるのあるじゃないですか。あれ、実はみかんじゃないんですよ。いや、ミカンはミカンなんですが、ただのみかんではなくて、橙という果物らしいです。');
  }
  else if(scorePoint <14000){
      $('#smile0').attr('src', '../img/shokaki.jpg');
      $(`#rank`).html('Rank4 消火器');
      $(`#comment`).html('赤色が目立つ消火器ですが、法的には25%以上赤ければいいので、デザイン性を重視した消火器なんかもあります。また、家庭用は25%以下でもいいので結構自由なデザインにできます。');
  }
  else if(scorePoint <16000){
      $('#smile0').attr('src', '../img/shingoki.jpg');
      $(`#rank`).html('Rank5 信号機');
      $(`#comment`).html('信号機は故障するとグーとチョキに点滅するように設計されています。パーを表示すると事故の原因になるからですね。ん、なにか変ですか？');
  }
  else if(scorePoint <18000){
      $('#smile0').attr('src', '../img/raion.jpg');
      $(`#rank`).html('Rank6 ライオン');
      $(`#comment`).html('かなりの高みに来ましたね。もしまだeasyでしたら難易度を上げたほうが得点が伸びやすいです。また、得点は負けたときが最も被害甚大です。最悪あいこを狙うのも立派な戦法ですよ。');
  }
  else if(scorePoint <20000){
      $('#smile0').attr('src', '../img/shieldMachien.jpg');
      $(`#rank`).html('Rank7 シールドマシーン');
      $(`#comment`).html('ご存知ですか、シールドマシーン。トンネルを作るための装置で、サイズと見た目がゲームのボスみたいに強そうです。知らない方はぜひ調べてみてくださいね。');
  }
  else if(scorePoint <23000){
      $('#smile0').attr('src', '../img/raptor.jpg');
      $(`#rank`).html('Rank8 F22 Raptor');
      $(`#comment`).html('ついにこの高みに到達しましたね。もうアドバイスできることは何もありません。ステルス戦闘機F22、愛称のRaptorは猛禽類を意味するらしいです。');
  }
  else if(scorePoint <27000){
      $('#smile0').attr('src', '../img/inseki.jpg');
      $(`#rank`).html('Rank9 メテオ');
      $(`#comment`).html('もしメテオレベルのグーだったらチョキだけでなく、普通のグーとパーは吹き飛ばせてしまいますね。このゲームにそんな"グー"はありませんが。');
  }
  else if(scorePoint <30000){
      $('#smile0').attr('src', '../img/taiyo.jpg');
      $(`#rank`).html('Rank10 太陽');
      $(`#comment`).html('素晴らしいじゃんけん力です。あなたのゲームへの情熱は灼熱の太陽にも勝ります。このゲームの得点は開いたタイルの枚数で少し加算されます。さらなる高みへ。');
  }
  else if(scorePoint <35000){
      $('#smile0').attr('src', '../img/utyu.jpg');
      $(`#rank`).html('Rank11 宇宙');
      $(`#comment`).html('宇宙です。星の煌めきが黄色であるなら、あなたを称えるにふさわしい賛辞は宇宙にもみつかりません。おめでとうございます。もしまだ余力があるなら、最低得点も目指してみては。');
  }
  else{
      $('#smile0').attr('src', '../img/nul.png');
      $(`#rank`).html('Rank null');
      if(angelMode != 3 & hellMode <66){$(`#comment`).html('この画面を見ている人がいるとは信じられません。人の手で到達できるとは。本当におめでとうございます！');}
      else {$(`#comment`).html('undefined 125 error');}
  }
});


//操作説明
$(`#help`).on('click', ()=>{
  $(`#helpWindow`).addClass('flex');
  $(`#helpWindow`).removeClass('hidden');
});

$(`#closeHelp`).on('click', ()=>{
  $(`#helpWindow`).addClass('hidden');
  $(`#helpWindow`).removeClass('flex');
});


//隠し要素
let angelMode = 0;
$(`#imgBox`).on('click', ()=>{
 if(isPlaying === 0 || isPlaying === -1 & hellMode<66){
  console.log("img clicked");
  if(angelMode === 0 && cursor === 5){angelMode = 1; console.log(angelMode); return;}
  if(angelMode === 1 && cursor === 2){angelMode = 2; console.log(angelMode); return;}
  if(angelMode === 2 && cursor === 1){angelMode = 3; console.log(angelMode);
    cursor = 10; 
    $('#smile1').attr('src', '../img/glass.png');
    $('#star').attr('src', '../img/star-green.svg'); 
    $(`#mainBoard`).addClass(`cursor-[url(../img/10.svg),_pointer]`);
    return; 
  }
  if(angelMode != 3){angelMode = 0;}
 }
});


let hellMode = 0;
$(`#imgBox`).on('click', ()=>{
 if(isPlaying === -1){
  if(cursor === 1){hellMode ++;}
  if(hellMode === 66){
    $("<button>",{
      id: `hell`,
      class: " rounded-xl  shadow-black/80 shadow-md hover:opacity-70 hover:cursor-pointer transition bg-red-800 active:translate-y-1 active:shadow-none active:opacity-40 text-yellow-300 select-none mx-16 my-5 py-1 text-3xl font-Dosis duration-100"
    }).appendTo('#difficulty');
    $('#smile1').attr('src', '../img/akuma.jpg');
    $("#hell").html('hell');
    setHell();
  }
 }

});

function setHell(){
$(`#hell`).on('click', ()=>{
  setTotalHands = 100;
  isPlaying = 0;
  $(`#difficulty`).addClass('hidden');
  prepareTile();
});
}




// マウスカーソル
$('#mainBoard').contextmenu(()=>{
  if(angelMode != 3){
    $(`#mainBoard`).removeClass(`cursor-[url(../img/${cursor}.svg),_pointer]`);
    if(cursor === 1){
      cursor = 2;
    }
    else if(cursor === 2){
      cursor = 5;
    }
    else if(cursor === 5){
      cursor = 1;
    }
    else{
      return;
    }
    
    $(`#mainBoard`).addClass(`cursor-[url(../img/${cursor}.svg),_pointer]`);
    console.log(cursor);
  }
});




}