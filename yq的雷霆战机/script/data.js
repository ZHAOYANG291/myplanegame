var wrap = document.getElementById("wrap")
        var enemys = document.getElementsByClassName("enemy")
        var planes = document.getElementsByClassName("plane")
        var planeBullets = document.getElementsByClassName("planeBullet")
        var bullet_musics = document.getElementsByClassName('bullet_music')
        var cover; //封面
        wrap.enemyTimer=null //生成敌军的定时器
        wrap.bulletTimer=null //产生子弹的定时器
        wrap.controlTimer=null //键盘控制我机的定时器
        wrap.planeKind=null //记录选择的我机型号
        //wrap宽高等信息
       var wrapOffsetTop=wrap.offsetTop,
        wrapOffsetLeft=wrap.offsetLeft,
        wrapOffsetHeight=wrap.offsetHeight,
        wrapOffsetWidth=wrap.offsetWidth

        //敌机数据
        var enemyData = {
            simple: {
                speed: 1,
                blood: 4,
                damage: 1,
                point: 2,
                modelSrc:"source/picture/enemy_small.png"
            },
            hard: {
                speed: 2,
                blood: 8,
                damage: 3,
                point: 5,
                modelSrc:"source/picture/enemy_big.png"
            }
        }
        //我机数据
        var planeData = {
            normal: {
                width: "30px",
                height: "30px",
                backgroundColor: "green",
                force: 2,
                life: 3,
                bulletSpeed: 150,
                modelSrc:"source/picture/plane_0.png"
            },
            legend: {
                width: "30px",
                height: "30px",
                backgroundColor: "blue",
                force: 10,
                life: 9,
                bulletSpeed: 250,
                modelSrc:"source/picture/plane_1.png"
            }
        }
