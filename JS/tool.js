// 根据CSS选择器获取DOM对象
function $( cssSelector ){
    var dom = document.querySelectorAll( cssSelector );
    
    if( dom.length === 0 ){
        return null;
    }

    if( dom.length === 1 ){
        return dom[0];
    }

    return dom;
}

// 获取指定dom对象的css属性attr对应的属性值
function getStyle( dom, attr ){
    return window.getComputedStyle( dom, null )[attr];
}

// 缓慢动画框架函数
// 缓慢动画就是速度有变化,速度越来越慢
// 参数说明, dom是要做动画的dom对象, obj是一个或者多个css属性以及css属性值组成对象,callback可选参数,当所有css属性都达到目标值,再调用callback函数

function animate( dom, obj , callback ){
    // 清除之前的定时器(为了防止多个定时器同时运行,动画边变快)
    window.clearInterval( dom.timer );
    // 再开启新的定时器
    dom.timer = window.setInterval(function(){
        // 假设所有css属性已经达到目标值
        var flag = true;

        // for...in遍历obj对象
        for(var attr in obj ){
            if( attr === "opacity" ){// 对透明度属性特殊处理
                // 获取对应CSS属性名的当前属性值
                var currentVal = parseFloat( getStyle( dom, attr ) ) * 100;
                // 获取CSS属性对应的目标值
                var target = obj[attr] * 100;
                // 计算运动速度 公式: (目标值-当前值) / 10
                var speed = ( target - currentVal ) / 10;
                // 速度需要进行处理 否则容易达不到目标值
                // 速度大于0,向上取整
                // 速度小于0,向下取整
                speed = speed > 0 ? Math.ceil( speed ) : Math.floor( speed );
                // 设置对应css属性值
                dom.style[attr] = (currentVal + speed) / 100;
                // 当前值没有达到目标值
                if( currentVal !== target ){
                    // 修改flag变量为false
                    flag = false;
                }
            }else if( attr === "z-index" || attr === "zIndex" ){// 对z-index属性特殊处理
                dom.style[attr] = obj[attr];
            }else{
                // 获取对应CSS属性名的当前属性值
                var currentVal = parseInt( getStyle( dom, attr ) );
                // 获取CSS属性对应的目标值
                var target = obj[attr];
                // 计算运动速度 公式: (目标值-当前值) / 10
                var speed = ( target - currentVal ) / 10;
                // 速度需要进行处理 否则容易达不到目标值
                // 速度大于0,向上取整
                // 速度小于0,向下取整
                speed = speed > 0 ? Math.ceil( speed ) : Math.floor( speed );
                // 设置对应css属性值
                dom.style[attr] = currentVal + speed + "px";
                // 当前值没有达到目标值
                if( currentVal !== target ){
                    // 修改flag变量为false
                    flag = false;
                }
            }
        }

        // 判断flag的值
        if( flag ){
            // 清除定时器
            window.clearInterval( dom.timer );
            // 当callback存在,并且callback是一个函数的时候,我们所有css属性达到目标值,就需要调用callback回调函数
            if( callback && (typeof callback ===  "function") ){
                callback();
            }
        }
    }, 15 );
}