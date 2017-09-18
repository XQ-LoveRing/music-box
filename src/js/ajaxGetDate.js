/**
 * Created by smallstrong on 2017/9/17.
 */
//ajax封装
function get(url, data, callback, dataType) {
    url += '?' + Object.keys(data).map(function (key) {
            return key + '=' + data[key]
        }).join('&');
    console.log(url);
    var xhr = new XMLHttpRequest();
    xhr.responseType = dataType || 'json';
    xhr.onload = function () {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
            callback(xhr.response)
        } else {
            alert("request was unsuccessful: " + xhr.status);
        }
    };
    xhr.open('GET', url, true);
    xhr.send();
}

//随机获取音乐
function start() {
    get('http://api.jirengu.com/fm/getSong.php', {channel: "public_yuzhong_yueyu"}, function (ret) {

        loadMusic(ret);
    });
}

start();
getCats();

//加载音乐信息
function loadMusic(songObj) {
    var song = songObj.song[0];
    heijiao.style.backgroundImage = "url('" + song.picture + "')";
    bg.style.backgroundImage = "url('" + song.picture + "')";
    music.src = song.url;
    titleNode.innerText = song.title;
    authorNode.innerText = song.artist;
    renderLyc(song.sid);
}


//获取专辑并渲染
function getCats() {
    get('https://jirenguapi.applinzi.com/fm/getChannels.php', {}, function (ret) {
        console.log(ret)
        createCats(ret);
        waterful.init();
        clickMUsic();
    });
}


//创建专辑单元
function createCats(data) {
    var cate = document.querySelector('.cate');
    var items = '';
    for (var i = 0; i < data.channels.length; i++) {
        items += "<li chanel='" + data.channels[i].channel_id + "'>" + data.channels[i].name + "</li>";
    }
    cate.innerHTML += items;
}

//{chanel:"public_tuijian_autumn"}


//点击专辑获取单曲
function clickMUsic() {
    var items = document.querySelector('.cate');
    items.addEventListener("click", function (e) {
        var target = e.target;
        if (target.getAttribute('chanel')) {
            var chnelID = target.getAttribute('chanel');
            get('https://jirenguapi.applinzi.com/fm/getSong.php', {channel: chnelID}, function (ret) {
                console.log(ret.song[0].title + " " + ret.song[0].artist)
                loadMusic(ret);
            });
        }
    })
}


//获取歌词

function renderLyc(songId) {
    get('https://jirenguapi.applinzi.com/fm/getLyric.php', {sid: songId}, function (ret) {
        // console.log(ret);
        lyc.innerHTML = "";
        lycObj = getLyrObj(ret.lyric)
        createLyc(lycObj);
        // lycMove(lycObj);
    });

}


function getLyrObj(lyric) {
    //每句话分隔为数组
    var lyricLineArray = lyric.split('\n');
    lyricLineArray.shift();
//        console.log(lyricLineArray);
    var reg = new RegExp("(\\[\\d{2}\:\\d{2}.\\d{2}\\])(.*)");
    var objArr = [];
    for (var i = 0, l = lyricLineArray.length; i < l; i++) {
        var matchContent = lyricLineArray[i].match(reg);

        if (matchContent) {
            //获取总时间
            var time = matchContent[1];
            var mimute = time.substring(1, 3);
            var seconds = time.substring(4, time.length - 1);
            var totalSeconds = parseFloat(mimute) * 60 + parseFloat(seconds);
            // console.log(totalSeconds);

            //获取对应的歌词
            var text = matchContent[2] || "  ";
            objArr.push({
                'time': totalSeconds,
                'text': text
            })
        }
    }
//        console.log(objArr)
    objArr.sort(function (a, b) {
        return a.time - b.time
    });

    return objArr;
}

//创建歌词节点
function createLyc(lycObj) {
    var songLyc = document.createElement('ul');
    songLyc.classList.add('lycMove');
    // songLyc.setAttribute("top","0px");
    for (var i = 0; i < lycObj.length; i++) {
        songLyc.innerHTML += "<li id=line-" + i + ">" + lycObj[i].text + "</li>";
        lyc.appendChild(songLyc);
    }
}

//歌词滚动

function lycMove(objArr) {
    var lycMove = document.querySelector('.lycMove');
    var lyc=document.querySelector('.lyrics');
    // var lycLI = document.querySelectorAll('.lycMove li');
    if(!objArr){
        lyc.innerText="暂无歌词。"
        return;
    }
    for (var i = 0, l = objArr.length; i < l; i++) {
        if (music.currentTime > objArr[i].time-1) {
            var currentLine = document.querySelector('#line-' + i);
            var prevLIne = document.querySelector('#line-' + (i > 0 ? i - 1 : i));
            currentLine.classList.add('play');
            prevLIne.classList.remove('play');
            lycMove.style.top =130-currentLine.offsetTop+'px';
        }
    }
}

music.addEventListener('timeupdate', function () {
    lycMove(lycObj);
});

