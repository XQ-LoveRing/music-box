var musicBox = function() {
    function Musicbox() {
        this.init();
        this.start();
        this.getCats();
        this.bind();
    }

    //获取节点
    Musicbox.prototype.init = function() {
        this.playBtn = document.querySelector('.play-button');
        this.preBtn = document.querySelector('.pre-button');
        this.nextBtn = document.querySelector('.next-button');
        this.titleNode = document.querySelector('.music-box .song');
        this.authorNode = document.querySelector('.music-box .singer ');
        this.timeNode = document.querySelector('.music-box .current-time');
        this.progressBarNode = document.querySelector('.music-box .progress .bar');
        this.progressNowNode = document.querySelector('.music-box .progress-now');
        this.totalTime = document.querySelector('.music-box .totol-time');
        this.tab = document.querySelector('.music-box .tab');
        this.xunhuan = document.querySelector('.music-box .xunhuan');
        this.vol = document.querySelector('.music-box .vol-button');
        this.des = document.querySelector('.music-box .des');
        this.lyc = document.querySelector('.lyrics');
        this.heijiao = document.querySelector('.kuan');
        this.bg = document.querySelector('.bg');
        this.catbtn = document.querySelector('.cate-button');
        this.cate = document.querySelector('.cate');
        this.music = new Audio;
        this.music.autoplay = true;
    };


    //按键绑定
    Musicbox.prototype.bind = function() {
        var self = this;

        //每秒刷新
        this.music.onplaying = function() {
            self.timer = setInterval(function() {
                self.flashTime();
            }, 1000);
            console.log('play')
        };

        //暂停时清除计时，
        this.music.onpause = function() {
            console.log('pause');
            clearInterval(self.timer)
        };

        //音乐结束时
        this.music.onended = function() {
            self.start();
        };

        this.music.addEventListener('timeupdate', function() {
            self.lycMove(self.lycObj);
        });

        //进度条
        this.progressBarNode.onclick = function(e) {
            //取得进度条长度
            var distance = e.offsetX;
            //设置进度条进度
            self.progressNowNode.style.width = distance + "px";
            // //设置音乐进度
            var rate = distance / self.progressBarNode.offsetWidth;
            self.music.currentTime = self.music.duration * rate;

            // console.log(e.offsetX);
        };

        //循环按钮
        this.xunhuan.onclick = function() {

            if (this.classList.contains('icon-liebiaoxunhuan')) {
                this.classList.remove('icon-liebiaoxunhuan');
                this.classList.add('icon-danquxunhuan')
            } else if (this.classList.contains('icon-danquxunhuan')) {
                this.classList.remove('icon-danquxunhuan');
                this.classList.add('icon-suiji');
            } else if (this.classList.contains('icon-suiji')) {
                this.classList.remove('icon-suiji');
                this.classList.add('icon-liebiaoxunhuan')
            }
        };

        //播放键
        this.playBtn.onclick = function() {
            var btn = this.querySelector('.iconfont');
            if (btn.classList.contains('icon-bofang')) {
                self.music.pause();
            } else {
                self.music.play();
            }
            btn.classList.toggle('icon-zanting');
            btn.classList.toggle('icon-bofang');
        };

        //上一首
        this.preBtn.onclick = function() {
            self.start();
            self.tab.classList.remove('icon-zanting');
            self.tab.classList.add('icon-bofang');
        };

        //下一首
        this.nextBtn.onclick = function() {
            self.start();
            self.tab.classList.remove('icon-zanting');
            self.tab.classList.add('icon-bofang');
        };

        //声音
        this.vol.onclick = function() {
            var btn = this.querySelector('.iconfont');
            if (btn.classList.contains('icon-shengyin')) {
                self.music.volume = 0;
            } else {
                self.music.volume = 0.5;
            }
            btn.classList.toggle('icon-jingyin');
            btn.classList.toggle('icon-shengyin')
        };



        //显示专辑菜单
        this.catbtn.onclick = function() {
            if (window.getComputedStyle(self.cate, null).visibility === "hidden") {
                self.cate.style.visibility = "visible";
                self.des.style.visibility = "hidden";
                self.lyc.style.visibility = "hidden";
            } else {
                self.cate.style.visibility = "hidden";
                self.des.style.visibility = "visible";
                self.lyc.style.visibility = "visible";
            }
        };


        //点击专辑获取单曲
        this.cate.addEventListener("click", function(e) {
            var target = e.target;
            if (target.getAttribute('chanel')) {
                var chnelID = target.getAttribute('chanel');
                self.get('https://jirenguapi.applinzi.com/fm/getSong.php', { channel: chnelID }, function(ret) {
                    self.loadMusic(ret);
                });
            }
        });

    };




    //事件变动时
    Musicbox.prototype.flashTime = function() {
        var music = this.music;
        // 设置计时器
        var minute = parseInt(music.currentTime / 60);
        var seconds = parseInt(music.currentTime % 60) + '';
        // seconds = seconds.length == 2 ? seconds : '0' + seconds;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        this.timeNode.innerText = minute + ":" + seconds;

        var totalM = parseInt(music.duration / 60);
        var tseconds = parseInt(music.duration % 60) + '';
        tseconds = tseconds.length == 2 ? tseconds : '0' + tseconds;
        this.totalTime.innerText = totalM + ":" + tseconds;

        //进度条随时间滚动
        var rate = music.currentTime / music.duration;
        this.progressNowNode.style.width = this.progressBarNode.offsetWidth * rate + "px";
    };



    //ajax封装
    Musicbox.prototype.get = function(url, data, callback, dataType) {
        url += '?' + Object.keys(data).map(function(key) {
            return key + '=' + data[key]
        }).join('&');
        console.log(url);
        var xhr = new XMLHttpRequest();
        xhr.responseType = dataType || 'json';
        xhr.onload = function() {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                callback(xhr.response)
            } else {
                alert("request was unsuccessful: " + xhr.status);
            }
        };
        xhr.open('GET', url, true);
        xhr.send();
    };
    //随机获取音乐
    Musicbox.prototype.start = function() {
        var self = this;
        self.get('https://jirenguapi.applinzi.com/fm/getSong.php', { channel: "public_yuzhong_yueyu" }, function(ret) {
            self.loadMusic(ret);
        });
    };

    //加载音乐信息
    Musicbox.prototype.loadMusic = function(songObj) {
        var self=this;
        var song = songObj.song[0];
        var img=new Image();
        img.src=song.picture;
        img.onload=function(){
            self.heijiao.style.backgroundImage = "url(" + song.picture + ")";
            self.bg.style.backgroundImage = "url(" + song.picture + ")";
        }
       
        this.music.src = song.url;
        this.titleNode.innerText = song.title;
        this.authorNode.innerText = song.artist;
        this.renderLyc(song.sid);

    };

    //获取歌词并创建节点
    Musicbox.prototype.renderLyc = function(songId) {
        console.log("获取创建节点");
        var self = this;
        self.get('https://jirenguapi.applinzi.com/fm/getLyric.php', { sid: songId }, function(ret) {
            self.lyc.innerHTML = "";
            //将取得的歌词组装成对象
            self.lycObj = self.getLyrObj(ret.lyric);
            //创建歌词节点
            self.createLyc(self.lycObj);
        });
    };

    //将取得的歌词组装成对象
    Musicbox.prototype.getLyrObj = function(lyric) {
        //每句话分隔为数组
        var objArr = [];
        var lrcArr = lyric.split('\n');
        lrcArr.forEach(function(element) {
            var lrcTime = element.match(/\[\d{2}\:\d{2}\.\d{2}\]/g);
            var lrcContent = element.match(/\][^\[].*/g)
            if (lrcTime !== null) {
                lrcTime.forEach(function(ele) {
                    var min = ele.match(/\[\d+:/)[0].slice(1, 3);
                    var sec = ele.match(/\:\d+.\d+/)[0].slice(1, 6);
                    var secTime = parseInt(min) * 60 + parseFloat(sec);
                    if (lrcContent !== null) {
                        objArr.push({
                            time: secTime,
                            content: lrcContent[0].slice(1, lrcContent[0].length)
                        })
                    }
                })
            }

        }, lrcArr);

        objArr.shift();
        objArr.sort(function(a, b) {
            return a.time - b.time;
        });

        return objArr;
    };


    //创建歌词节点
    Musicbox.prototype.createLyc = function(lycObj) {
        var self = this;
        var songLyc = document.createElement('ul');
        songLyc.classList.add('lycMove');
        for (var i = 0; i < lycObj.length; i++) {
            songLyc.innerHTML += "<li id=line-" + i + ">" + lycObj[i].content + "</li>";
            self.lyc.appendChild(songLyc);
        }
    };


    //歌词滚动

    Musicbox.prototype.lycMove = function(objArr) {
        var self = this;
        var lycMove = document.querySelector('.lycMove');
        if (!objArr) {
            self.lyc.innerText = "暂无歌词。";
            return;
        }
        for (var i = 0, l = objArr.length; i < l; i++) {
            if (self.music.currentTime > objArr[i].time - 0.5) {
                var currentLine = document.querySelector('#line-' + i);
                var prevLIne = document.querySelector('#line-' + (i > 0 ? i - 1 : i));
                currentLine.classList.add('play');
                prevLIne.classList.remove('play');
                lycMove.style.top = 100 - currentLine.offsetTop + 'px';
            }
        }
    };

    //获取专辑并渲染
    Musicbox.prototype.getCats = function() {
        var self = this;
        this.get('https://jirenguapi.applinzi.com/fm/getChannels.php', {}, function(ret) {
            console.log(ret);
            self.createCats(ret);
            waterful.init();
        });
    };

    //someBug happening in github

    //创建专辑单元
    Musicbox.prototype.createCats = function(data) {
        var items = '';
        for (var i = 0; i < data.channels.length; i++) {
            items += "<li chanel='" + data.channels[i].channel_id + "'>" + data.channels[i].name + "</li>";
        }
        this.cate.innerHTML += items;
    };

    return {
        init: function() {
            new Musicbox();
        }
    }

}();

musicBox.init();