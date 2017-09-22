//瀑布流渲染
var waterful = function () {
    function init() {
        waterFull();
    }

    function waterFull() {
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
            var idx = index + 1;
            if (idx < items.length) {
                items[idx].style.height = hc[index] + "px";
                items[idx].style.lineHeight = hc[index] + "px";

                var minValue = Math.min.apply(null, itemArr);
                var minIndex = itemArr.indexOf(minValue);

                //设置位置
                items[idx].style.top = itemArr[minIndex] + 'px';
                items[idx].style.left = items[idx].offsetWidth * minIndex + 'px';
                itemArr[minIndex] += parseInt(items[idx].style.height)
            }

        }
        );
    }

    return {
        init: init
    }
}();
