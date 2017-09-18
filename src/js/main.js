/**
 * Created by smallstrong on 2017/9/16.
 */

//音乐列表
// var musicList = [
//     {
//         src: '/Users/smallstrong/Desktop/music/src/mp3/cuoguo.mp3',
//         title: '错过',
//         author: '范玮琪'
//     },
//     {
//         src: '/Users/smallstrong/Desktop/music/src/mp3/yegui.mp3',
//         title: '都是夜归人',
//         author: '林忆莲'
//     },
//     {
//         src: '/Users/smallstrong/Desktop/music/src/mp3/meiyouhua.mp3',
//         title: '当这世界没有花',
//         author: '陈奕迅'
//     }
//
// ];



//获取DOM元素
var playBtn = document.querySelector('.play-button');
var preBtn = document.querySelector('.pre-button');
var nextBtn = document.querySelector('.next-button');
//    var volDown = document.querySelector('.vol-down');
//    var volUp = document.querySelector('.vol-up');
var titleNode = document.querySelector('.music-box .song');
var authorNode = document.querySelector('.music-box .singer ');
var timeNode = document.querySelector('.music-box .current-time');
var progressBarNode = document.querySelector('.music-box .progress .bar');
var progressNowNode = document.querySelector('.music-box .progress-now');
var totalTime = document.querySelector('.music-box .totol-time');
var tab = document.querySelector('.music-box .tab');
var xunhuan = document.querySelector('.music-box .xunhuan');
var vol = document.querySelector('.music-box .vol-button');
var des=document.querySelector('.music-box .des');
var lyc=document.querySelector('.lyrics');
var heijiao=document.querySelector('.kuan');
var bg=document.querySelector('.bg');

var music = new Audio();
music.autoplay = true;
var musicIndex = 0;
// loadMusic(musicList[musicIndex]);

nextBtn.onclick = nextSong;
preBtn.onclick = preSong;


//每秒刷新
music.onplaying = function () {
    timer = setInterval(function () {
        flashTime();
    }, 1000);
    console.log('play')
};

//暂停时清除计时，
music.onpause = function () {
    console.log('pause');
    clearInterval(timer)
};

//音乐结束时
music.onended = function () {
    nextSong();
};

//更新时间
function flashTime() {
    // 设置计时器
    var minute = parseInt(music.currentTime / 60);
    var seconds = parseInt(music.currentTime % 60) + '';
    // seconds = seconds.length == 2 ? seconds : '0' + seconds;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    timeNode.innerText = minute + ":" + seconds;

    var totalM = parseInt(music.duration / 60);
    var tseconds = parseInt(music.duration % 60) + '';
    tseconds = tseconds.length == 2 ? tseconds : '0' + tseconds;
    totalTime.innerText = totalM + ":" + tseconds;

    //进度条随时间滚动
    var rate = music.currentTime / music.duration;
    progressNowNode.style.width = progressBarNode.offsetWidth * rate + "px";

}

// function transTime(time) {
//     var minute = parseInt(time / 60);
//     var seconds = parseInt(time % 60) + '';
//     seconds = seconds.length == 2 ? seconds : '0' + seconds;
//     return minute + ":" + seconds;
// }

//进度条
progressBarNode.onclick = function (e) {
    //取得进度条长度
    var distance = e.offsetX;
    //设置进度条进度
    progressNowNode.style.width = distance + "px";
    // //设置音乐进度
    var rate = distance / progressBarNode.offsetWidth;
    music.currentTime = music.duration * rate;

    // console.log(e.offsetX);
};


//循环按钮
xunhuan.onclick = function () {
    if (xunhuan.classList.contains('icon-liebiaoxunhuan')) {
        xunhuan.classList.remove('icon-liebiaoxunhuan');
        xunhuan.classList.add('icon-danquxunhuan')
    } else if (xunhuan.classList.contains('icon-danquxunhuan')) {
        xunhuan.classList.remove('icon-danquxunhuan');
        xunhuan.classList.add('icon-suiji');
    } else if (xunhuan.classList.contains('icon-suiji')) {
        xunhuan.classList.remove('icon-suiji');
        xunhuan.classList.add('icon-liebiaoxunhuan')
    }
}


//播放键
playBtn.onclick = function () {
    var btn = this.querySelector('.iconfont');
    if (btn.classList.contains('icon-bofang')) {
        music.pause();
    } else {
        music.play();
    }
    btn.classList.toggle('icon-zanting');
    btn.classList.toggle('icon-bofang');
};


//上一首
function preSong() {
    // musicIndex--;
    // musicIndex = (musicIndex + musicList.length) % musicList.length;
    // loadMusic(musicList[musicIndex]);
    start();
    tab.classList.remove('icon-zanting');
    tab.classList.add('icon-bofang');
}

//下一首

function nextSong() {
    // console.log(2)
    // musicIndex++;
    // musicIndex = musicIndex % musicList.length;
    // loadMusic(musicList[musicIndex]);
    start();
    tab.classList.remove('icon-zanting');
    tab.classList.add('icon-bofang');
}

//声音
vol.onclick = function () {
    var btn = this.querySelector('.iconfont');
    if (btn.classList.contains('icon-shengyin')) {
        music.volume = 0;
    } else {
        music.volume = 0.5;
    }
    btn.classList.toggle('icon-jingyin');
    btn.classList.toggle('icon-shengyin')
};





//瀑布流加载



var waterful=function () {
    function init() {
        waterFull();
    }

    function  waterFull() {
        var content = document.querySelector('.cate');
        var items = document.querySelectorAll('.cate li');

        var colWidth = parseInt(content.offsetWidth / parseInt(items[0].style.width));
        //列数
        var itemArr = [];
        for (i = 0; i < colWidth; i++) {
            itemArr[i] = 0
        }
        //随机获取高度
        var hc = [];
        for (i = 0; i < items.length; i++) {
            hc.push(parseInt(Math.random() * (80 - 40 + 1) + 40))
        }

        items.forEach(function (value, index, array) {
                // console.log(window.getComputedStyle(items[index],null).width)
                var idx=index+1;
                if(idx<items.length){
                    items[idx].style.height = hc[index] + "px";
                    items[idx].style.lineHeight = hc[index] + "px";

                    var minValue = Math.min.apply(null, itemArr);
                    var minIndex = itemArr.indexOf(minValue);

                    //设置位置
                    items[idx].style.top=itemArr[minIndex]+'px';
                    items[idx].style.left=items[idx].offsetWidth*minIndex+'px';
                    itemArr[minIndex]+=parseInt(items[idx].style.height)
                }

            }
        );
    }

    return {
        init:init
    }
}();

// waterful.init(content,items)




//显示专辑菜单
var catbtn=document.querySelector('.cate-button');
var cate=document.querySelector('.cate')
catbtn.onclick=function () {
      if(window.getComputedStyle(cate,null).visibility==="hidden"){
          cate.style.visibility="visible";
          // console.log(des)
          des.style.visibility="hidden";
          lyc.style.visibility="hidden";
      }else{
          cate.style.visibility="hidden";
          des.style.visibility="visible";
          lyc.style.visibility="visible";
      }


}


//ajax获取数据



