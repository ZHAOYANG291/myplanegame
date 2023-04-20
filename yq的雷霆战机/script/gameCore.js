//plane宽高等信息
var planeOffsetHeight
var planeOffsetWidth

var controlMode = "keyboard" //操作方式
//界面初始化
function init() {
    //标题
    let h3 = document.createElement("h1")
    h3.innerText = "雷霆战机1.0"
    h3.classList.add("cover-title")
    wrap.appendChild(h3)
    //wrap背景
    wrap.style.background = "url(source/picture/cover.jpg) no-repeat 0px/100%"
    //关卡难度选择
    for (let i = 0; i < 4; i++) {
        let div = document.createElement('div')
        div.className = "cover-option"
        div.optionNum = i
        wrap.appendChild(div)
    }
    let options = document.getElementsByClassName("cover-option")
    options[0].innerHTML = "简单"
    options[1].innerHTML = "一般"
    options[2].innerHTML = "困难"
    options[3].innerHTML = "地狱"

    //我机型号选择
    let planeSelect = document.createElement("select")
    let planeOption1 = document.createElement("option")
    let planeOption2 = document.createElement("option")
    planeSelect.id = "planeKind"
    planeOption1.innerHTML = "普通飞机"
    planeOption1.kind = "normal"
    planeOption1.selected = true
    planeOption2.innerHTML = "传奇飞机"
    planeOption2.kind = "legend"
    planeSelect.appendChild(planeOption1)
    planeSelect.appendChild(planeOption2)
    wrap.appendChild(planeSelect)

    //操作方式选择(键盘还是鼠标)
    var controlModeSelect = document.createElement("img")
    controlModeSelect.src = `source/picture/${controlMode}.png`
    controlModeSelect.className = "controlModeSelect"
    controlModeSelect.onclick = function () {
        if (controlMode == "keyboard") {
            controlMode = "mouse"
        } else {
            controlMode = "keyboard"
        }
        controlModeSelect.src = `source/picture/${controlMode}.png`
    }
    wrap.appendChild(controlModeSelect)

    for (let i = 0; i < options.length; i++) {
        options[i].onclick = function () {
            let planeKind = document.getElementById("planeKind")
            //控制台输出我机型号
            console.log(planeKind.options[planeKind.selectedIndex].text)
            //游戏开始
            stratGame(this.optionNum, planeKind.options[planeKind.selectedIndex].kind)
            console.log("你选择了" + this.innerHTML + "级别的关卡！---游戏开始")
            //换游戏背景
            wrap.style.background = "url(source/picture/bg" + i + ".jpg) no-repeat 0px/100%"
        }
    }

    //我机得分初始化
    wrap.point = 0;
}

//开始游戏
function stratGame(optionNum, planeKind) {

    //困难等级：代表10个敌机中产生hard型号的概率
    let hardLevel = "1"
    switch (optionNum) {
        case 0:
            hardLevel = 1;
            break;
        case 1:
            hardLevel = 3;
            break;
        case 2:
            hardLevel = 6;
            break;
        case 3:
            hardLevel = 8;
            break;
    }
    //清空页面，正式开始游戏
    wrap.innerHTML = ""
    //开启背景音乐
    let background_music = document.createElement("audio")
    background_music.setAttribute("loop", "")
    background_music.setAttribute("autoplay", "")
    background_music.setAttribute("src", "source/music/game_music.mp3")
    wrap.appendChild(background_music)

    //持续召唤敌机
    wrap.enemyTimer = window.setInterval(showEnemy, 500, [hardLevel])
    //召唤我机
    showPlane(planeKind)
    //显示我机生命值
    let planeLife = document.createElement('p')
    planeLife.id = "planeLife"
    planeLife.innerText = "剩余生命值：" + planes[0].life
    wrap.appendChild(planeLife)
    //显示目前得分
    let wrapPoint = document.createElement('p')
    wrapPoint.id = "planePoint"
    wrapPoint.innerText = "得分：" + wrap.point
    wrap.appendChild(wrapPoint)
}

//召唤敌机(根据困难等级召唤，7则代表每次刷新出hard类型的敌机的概率为70%)
function showEnemy(hardLevel) {
    let enemy = document.createElement('div')
    enemy.className = "enemy"
    let level = randomAray(1, 10)
    if (level <= hardLevel) {
        enemy.classList.add("hard")
        enemy.kind = "hard"
        enemy.blood = enemyData["hard"].blood
        enemy.point = enemyData["hard"].point
        enemy.style.background = "url(" + enemyData["hard"].modelSrc + ") no-repeat 0px/100%"

    } else {
        enemy.classList.add("simple")
        enemy.kind = "simple"
        enemy.blood = enemyData["simple"].blood
        enemy.point = enemyData["simple"].point
        enemy.style.background = "url('" + enemyData["simple"].modelSrc + "') no-repeat 0px/100%"

    }
    wrap.appendChild(enemy)
    //敌军x轴随机位置
    enemy.style.left = randomAray(0, wrap.offsetWidth - enemy.clientWidth) + "px"

    //初始化敌军y轴位置，是为了防止每个敌军的某些数据加载跟不上（但问题已经解决）
    enemy.style.top = "-100px"
    //敌军直接下坠-快速
    fallingFast(enemy)

}

//直接下坠-快速(根据不同类型的敌机来决定下坠速度)
function fallingFast(obj) {
    obj.style.top = obj.offsetTop + enemyData[obj.kind].speed + "px"
    if (obj.offsetTop > wrap.offsetHeight - obj.offsetHeight) { //敌机到了底部就移除节点
        wrap.removeChild(obj)
    } else {

        for (let i = 0; i < enemys.length; i++) {
            //敌机还未到达底部，敌机与我机发生了碰撞，做出相应处理
            if (strike(planes[0], enemys[i])) {
                console.log("你碰撞了敌机!")
                planes[0].life -= enemyData[enemys[i].kind].damage
                document.getElementById("planeLife").innerText = "剩余生命值：" + planes[0].life
                boom(enemys[i])
                if (planes[0].life <= 0) {
                    boom(planes[0])
                    gameOver()
                }
            }

            /* //子弹击中敌军后的处理  (太卡了，放弃！ 主要是因为 requestAnimationFrame函数的调用速度太快了)
            for (let j = 0; j < planeBullets.length; j++) {
                if (strike(enemys[i], planeBullets[j])) {
                    enemys[i].remove()
                    planeBullets[j].remove()
                }
            } */

        }

        //敌机还未到达底部，继续回调下坠函数
        requestAnimationFrame(function () {
            fallingFast(obj)
        })
    }
}

//直接下坠-慢速度
function fallingSlow() {}

//无规律游走
function fallingDisorder() {}

//召唤我机
function showPlane(kind = "normal") {
    let plane = document.createElement('div')
    plane.className = "plane"
    plane.classList.add(kind)
    wrap.planeKind = kind
    plane.life = planeData[kind].life
    plane.bulletSpeed = planeData[kind].bulletSpeed
    plane.force = planeData[kind].force
    plane.style.background = "url(" + planeData[kind].modelSrc + ") no-repeat 0px 0px/100% auto"
    wrap.appendChild(plane)

    planeOffsetHeight = planes[0].offsetHeight
    planeOffsetWidth = planes[0].offsetWidth
    plane.style.left = wrapOffsetWidth / 2 - planeOffsetWidth / 2 + "PX"
    plane.style.bottom = 0 + "px"
    //我机移动的操作方式(键盘还是鼠标)
    if (controlMode == "keyboard") {
        controlKeyboard(plane)
    } else {
        controlMouse(plane)
    }


    //发射子弹
    planeBullet(plane)
}

//我机发射子弹
function planeBullet(obj) {

    wrap.bulletTimer = setInterval(function () {

        //子弹发射的声音
        let bullet_music = document.createElement("audio")
        bullet_music.setAttribute("src", "source/music/bullet.mp3")
        wrap.appendChild(bullet_music)
        //这里原本是有bug的，
        var promise = bullet_music.play()
        if (promise) {
            promise.then(function () {
                bullet_music.play()
                console.log("子弹声音")
            }).catch((e) => {
                console.log("错了！！")
            })
        }
        bullet_music.onended = function () {
            wrap.removeChild(this)
        }

        //子弹创建，确定子弹的初始位置
        let bullet = document.createElement('div')
        bullet.className = "planeBullet"
        // console.log(bullet.offsetWidth)
        bullet.style.top = obj.offsetTop + "px"
        bullet.style.background = "url(source/picture/fire.png) no-repeat 0px/100%"
        wrap.appendChild(bullet)
        bullet.style.left = obj.offsetLeft + obj.offsetWidth / 2 - bullet.offsetWidth / 2 + "px"

        //子弹击中敌军后的处理
        for (let i = 0; i < planeBullets.length; i++)
            for (let j = 0; j < enemys.length; j++) {
                if (strike2(planeBullets[i], enemys[j])) {
                    enemys[j].blood -= planes[0].force
                    planeBullets[i].remove()
                    if (enemys[j].blood <= 0) {
                        wrap.point += enemys[j].point
                        document.getElementById('planePoint').innerText = "得分：" + wrap.point
                        boom(enemys[j])
                    }

                }
            }

        //子弹向前飞
        for (let i = 0; i < planeBullets.length; i++) {

            planeBullets[i].style.top = planeBullets[i].offsetTop - obj.bulletSpeed + "px"
            //子弹超出距离就销毁
            if (planeBullets[i].offsetTop <= 0) {
                wrap.removeChild(planeBullets[i])
            }
        }

    }, 100)

}

//键盘控制元素移动，白银版（丝滑得一批）
//player：传入要控制的ElementNode
function controlKeyboard(player) {
    var speed = 5; //步长(px)
    var cycle = 10; //刷新周期(ms) 
    var up = false,
        down = false,
        left = false,
        right = false

    document.onkeydown = function (e) {
        var code = e.keyCode
        changeState(code, true)

    }

    document.onkeyup = function (e) {
        var code = e.keyCode
        changeState(code, false)
    }

    function changeState(code, isDown) {
        switch (code) {
            case 87: { //w
                up = isDown;
                break
            }
            case 83: { //s
                down = isDown;
                break
            }
            case 65: { //a
                left = isDown;
                break
            }
            case 68: { //d
                right = isDown;
                break
            }
        }
    }

    wrap.controlTimer = setInterval(function () {
        if (up) {
            player.style.top = Math.max((player.offsetTop - speed), 0) + "px";
        }
        if (down) {
            player.style.top = Math.min((player.offsetTop + speed), (wrapOffsetHeight - planeOffsetHeight)) + "px";
        }
        if (left) {
            player.style.left = Math.max((player.offsetLeft - speed), 0) + "px";
        }
        if (right) {
            player.style.left = Math.min((player.offsetLeft + speed), (wrapOffsetWidth - planeOffsetWidth)) + "px";
        }

    }, cycle)
}
//鼠标控制元素移动
function controlMouse(player) {
    //鼠标控制运动
    wrap.onmousemove = function (e) {
        player.style.left = e.pageX - wrapOffsetLeft - planeOffsetWidth / 2 + "px"
        player.style.top = e.pageY - wrapOffsetTop - planeOffsetHeight / 2 + "px"
        /*事件e赋值给变量不是事实同步的，只会保留第一次赋值的信息*/
    }
}
//碰撞检测
function strike(obj1, obj2) { // true 碰撞  false 不碰撞
    var top1 = obj1.offsetTop,
        left1 = obj1.offsetLeft,
        right1 = left1 + obj1.offsetWidth,
        bottom1 = top1 + obj1.offsetHeight,

        top2 = obj2.offsetTop,
        left2 = obj2.offsetLeft,
        right2 = left2 + obj2.offsetWidth,
        bottom2 = top2 + obj2.offsetHeight;
    /*短路或，一旦出现为真就返回为真（一旦出现不可能发生碰撞的情况就返回为真（然后加一个! 就得到想要的结果了））*/

    return !(top1 > bottom2 || left1 > right2 || bottom1 < top2 || right1 < left2)
}

//碰撞检测2，有bug,已解决(主要是因为我用下面的函数去getPropertyValue("offsetTop")了，肯定报错，css样式里面没有offsetTop这个样式的 应该直接 top )
function strike2(obj1, obj2) {
    let top1 = parseInt(window.getComputedStyle(obj1, null).getPropertyValue("top")) //为什么直接top不行呢？
    let left1 = parseInt(window.getComputedStyle(obj1, null).getPropertyValue("left"))
    let right1 = left1 + obj1.offsetWidth
    let bottom1 = top1 + obj1.offsetHeight

    let top2 = parseInt(window.getComputedStyle(obj2, null).getPropertyValue("top"))
    let left2 = parseInt(window.getComputedStyle(obj2, null).getPropertyValue("left"))
    let right2 = left2 + obj2.offsetWidth
    let bottom2 = top2 + obj2.offsetHeight

    // return !(top2>bottom1 || left2>right1 || bottom2<top1 || right2<left1)
    return !(top1 > bottom2 || left1 > right2 || bottom1 < top2 || right1 < left2)
}

//敌机发射子弹
function enemyBullet() {}

//爆炸
function boom(obj) {
    //创建爆炸时候的bgm
    let boom_music = document.createElement("audio")

    // 创建爆炸后留在原地的图片
    let div = document.createElement('div')
    div.style.position = "absolute"
    div.style.width = obj.offsetWidth + "px"
    div.style.height = obj.offsetHeight + "px"
    div.style.top = obj.style.top
    div.style.left = obj.style.left
    div.style.background = "red"

    //根据不同的对象给出不同的爆炸图片(图片调用关键帧动画不透明度归零)以及音乐
    if (obj.classList.contains("enemy")) {
        div.style.background = "url('source/picture/boom_big.png') no-repeat"
        div.style.animation = "boom 1s"
        boom_music.setAttribute("src", "source/music/enemy3_down.mp3")
    }
    if (obj.classList.contains("plane")) {
        div.style.background = "url('source/picture/boom_big.png') no-repeat"
        boom_music.setAttribute("src", "source/music/game_over.mp3")
    }

    //播放爆炸音乐
    wrap.appendChild(boom_music)

    let promise = boom_music.play()
    if (promise) {
        promise.then(() => {
            boom_music.play()  //这个play()方法才是真正执行播放的操作
        }).catch((e) => {
            console.log("播放错误")
        })
    }
    div.style.opacity = "0"
    wrap.appendChild(div)



    //移除临时目标
    wrap.removeChild(obj)
    boom_music.onended = () => {
        wrap.removeChild(div)
        wrap.removeChild(boom_music)

    }
}

//游戏结束
function gameOver() {
  
    clearInterval(wrap.enemyTimer)
    clearInterval(wrap.bulletTimer)
    clearInterval(wrap.controlTimer)
    Summary()
    console.log("游戏结束！")
}

//显示总结面板
function Summary() {
    wrap.innerHTML = ""
    let showBoard = document.createElement("div")
    let text1 = document.createTextNode("您的最终分数为：")
    let div1 = document.createElement("div")
    let showPoint = document.createElement('h2')
    let text2 = document.createTextNode(wrap.point)
    let showPlane = document.createElement('div')
    let text3 = document.createTextNode("您使用的机型是:")
    let planeImg = document.createElement("img")
    let goIndex=document.createElement('button')
    let text4=document.createTextNode('点击返回主界面')

    /*bug 这里为什么会访问不了modelSrc属性呢  用 planeData[wrap.planeKind].modelSrc  就是不行(见鬼，后面又可以了)
      可能与media的play() 有关，这个涉及到 play()返回的是一个promise
     */
    //planeImg.src=planeData["normal"].modelSrc 
    planeImg.src = planeData[wrap.planeKind].modelSrc
    planeImg.style.width = 100 + "px"
    goIndex.id="goIndex"
    div1.appendChild(text1)
    showPoint.appendChild(text2)
    showPlane.appendChild(text3)
    goIndex.appendChild(text4)
    showBoard.appendChild(div1)
    showPlane.appendChild(planeImg)
    showBoard.appendChild(showPoint)
    showBoard.appendChild(showPlane)
    showBoard.id = "showBoard"
    wrap.append(showBoard)
    wrap.appendChild(goIndex)

    goIndex.onclick=()=>{
        wrap.innerHTML=""
         init()
         //这样也可以
        // setTimeout(()=>{
        //     window.location.href="index.html"
        //     console.log("aaaaa")
        // },1000)
    }


}

//产生[a,b] 的随机数
function randomAray(a, b) {
    return Math.floor(Math.random() * (b + 1 - a) + a)
}