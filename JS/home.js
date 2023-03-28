(function () {
  window.onload = function () {
    // 获取轮播图相关dom对象
    var banner = $(".banner");
    var bannerImgsUl = $(".bannerImg ul");
    var arrowRight = $(".banner .arrow-right");
    var arrowLeft = $(".banner .arrow-left");
    var dotLis = $(".dot li");
    // console.log("dotLis=>",dotLis);
    // 获取轮播图的宽度
    var bannerWidth = banner.offsetWidth;
    //
    // 初始化轮播图索引号
    var bannerImgIndex = 1;
    // 高亮小圆点索引号
    var circleIndex = 0;
    // 设置默认展示图片1
    bannerImgsUl.style.marginLeft = -(bannerImgIndex * bannerWidth) + "px";

    // 定义一个控制开关，用于防止用户点击过快导致白屏问题，限制点击的速度
    var flag = true;
    // 右侧按钮点击事件
    arrowRight.onclick = function () {
      // 判断开关的当前状态
      if (flag) {
        // 关闭当前开关
        flag = false;
        // 触发事件后轮播图索引号进行自加
        bannerImgIndex++;
        // 设置轮播的marginLeft值
        animate(
          bannerImgsUl,
          {
            marginLeft: -(bannerImgIndex * bannerWidth),
          },
          function () {
            // 控制轮播图的滚动下标，当到达最大下标时返回默认展示的图片1
            if (bannerImgIndex >= 7) {
              bannerImgIndex = 1;
              bannerImgsUl.style.marginLeft =
                -(bannerImgIndex * bannerWidth) + "px";
            }
            // 打开开关
            flag = true;
          }
        );
        // 对应的小圆点高亮
        // 当前小圆点高亮的时候，他的兄弟不能高亮（排他）
        for (var i = 0; i < dotLis.length; i++) {
          dotLis[i].classList.remove("active");
        }
        // 高亮的小圆点自加
        circleIndex++;
        // 边界判断，防止滚动到没有的下标导致小圆点高亮显示异常
        if (circleIndex >= 6) {
          circleIndex = 0;
        }
        dotLis[circleIndex].classList.add("active");
      }
    };

    // 左侧按钮点击事件
    arrowLeft.onclick = function () {
      if (flag) {
        flag = false;
        // 轮播图片索引号自减1
        bannerImgIndex--;
        // 设置bannerImgsUl的margin-left值
        // bannerImgsUl.style.marginLeft = - (bannerImgIndex * bannerWidth) + "px";

        // 动画设置bannerImgsUl的margin-left值
        animate(
          bannerImgsUl,
          {
            marginLeft: -(bannerImgIndex * bannerWidth),
          },
          function () {
            // console.log("bannerImgIndex=>", bannerImgIndex);
            if (bannerImgIndex <= 0) {
              bannerImgIndex = 7;
              bannerImgsUl.style.marginLeft =
                -(bannerImgIndex * bannerWidth) + "px";
            }

            flag = true;
          }
        );

        // 实现对应小圆点高亮
        // 排他
        for (var i = 0; i < dotLis.length; i++) {
          dotLis[i].classList.remove("active");
        }
        // 高亮小圆点自减
        circleIndex--;
        // 边界判断，防止滚动到没有的下标导致小圆点高亮显示异常
        if (circleIndex <= -1) {
          circleIndex = 5;
        }
        // 高亮
        dotLis[circleIndex].classList.add("active");
      }
    };

    //  轮播图小圆点的点击切换事件
    for (var i = 0; i < dotLis.length; i++) {
      // 设置自定义属性
      dotLis[i].dataset.index = i;
      dotLis[i].onclick = function () {
        var index = Number(this.dataset.index);
        // 小圆点对应的下标
        circleIndex = index;
        // 轮播图对应的下标
        bannerImgIndex = index + 1;
        // 动画滚动轮播图
        animate(bannerImgsUl, {
          marginLeft: -(bannerImgIndex * bannerWidth),
        });
        // 对应的小圆点高亮并排他
        for (var i = 0; i < dotLis.length; i++) {
          dotLis[i].classList.remove("active");
        }
        // 高亮对应的小圆点
        dotLis[circleIndex].classList.add("active");
      };
    }

    // 轮播图开启自动轮播,timer用于清除定时器
    var timer = window.setInterval(function () {
      // 通过调用右侧点击事件模拟自动播放
      arrowRight.onclick();
    }, 2000);

    // 鼠标移上轮播图之后停止轮播图的轮播
    banner.onmouseover = function () {
      window.clearInterval(timer);
      timer = null;
    };

    //鼠标离开轮播图之后继续轮播
    banner.onmouseout = function () {
      if (timer === null) {
        timer = window.setInterval(function () {
          // 通过调用右侧点击事件模拟自动播放，实现自动轮播
          arrowRight.onclick();
        }, 3000);
      }
    };

    //获取tab栏相关DOM对象
    //获取tab栏相关DOM对象
    var tabList = $(".tab-list-item");
    var tabListBox = $(".tab-list-item-content");

    //   遍历tab栏的文字
    for (var i = 0; i < tabList.length; i++) {
      // 设置自定义属性
      tabList[i].setAttribute("data-index", i);
      // 给tab列表绑定点击事件
      tabList[i].onclick = function () {
        // 排他
        for (var j = 0; j < tabList.length; j++) {
          tabList[j].classList.remove("active");
          tabListBox[j].classList.remove("active");
        }
        // 高亮点击的类名
        this.classList.add("active");
        //获取点击的标签,点击那个就显示那个对应的内容
        var index = this.getAttribute("data-index");
        tabListBox[index].classList.add("active");
      };
    }

    // 设置曲线数据视图
    // 初始化图表标签
    var myChart = echarts.init(document.getElementById("chart"));
    // 所在月份占的数据
    var xdata = [];
    // 所在月份
    var months = [];
    // console.log("myChart=>",myChart);
    // 获取月份数据
    axios({
      method: "get",
      url: " https://edu.telking.com/api/?type=month",
    }).then((res) => {
      //   console.log("res=>", res);
      res.data.data.xAxis.forEach((item) => {
        // console.log("item=>",item);
        months.push(item);
      });
      // console.log("months=>",months);
      res.data.data.series.forEach((item) => {
        xdata.push(item);
      });
      // console.log("xdata=>",xdata);
      var options = {
        title: {
          text: "曲线数据图表",
          left: "center",
          top: "4",
        },
        xAxis: {
          type: "category",
          data: months,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: xdata,
            type: "line",
            smooth: true,
            itemStyle: { normal: { label: { show: true } } },
          },
        ],
      };
      myChart.setOption(options, true);
    });

    // 设置饼状视图
    var pieChart = echarts.init(document.getElementById("pie"));
    // console.log("pieChart=>",pieChart);
    // 所在星期占的数据
    var xweek = [];
    // 具体在星期几
    var weeks = [];
    axios({
      method: "get",
      url: "https://edu.telking.com/api/?type=week ",
    }).then((res) => {
      //   console.log("res=>", res);
      res.data.data.series.forEach((item) => {
        xweek.push({ value: item });
      });

      res.data.data.xAxis.forEach((item, index) => {
        xweek[index].name = item;
        weeks.push(xweek[index]);
      });
      var optionsPie = {
        title: {
          text: "饼状图数据展示",
          left: "center",
          top: "4",
        },
        // 图例
        tooltip: {
          show: true,
          trigger: "item",
          backgroundColor: "#1677FF",
        },
        color: [
          "#3e87ff",
          "#65b2f3",
          "#b9cfec",
          "#e4393c",
          "#f5f5",
          "#999",
          "#f5f5f5",
        ],
        series: [
          {
            type: "pie",
            radius: "50%",
            center: ["50%", "50%"],
            data: weeks,
            itemStyle: {
              // 显示图例
              normal: {
                label: {
                  show: true,
                },
                labelLine: {
                  show: true,
                },
              },
              emphasis: {
                // 图形阴影的模糊大小
                shadowBlur: 10,
                // 阴影水平方向上的偏移距离
                shadowOffsetX: 0,
                // 阴影颜色
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      setTimeout(() => {
        pieChart.setOption(optionsPie);
      }, 200);
    });

    //柱状视图
    var histogramChart = echarts.init(document.getElementById("histogram"));

    var Hweek=[];
    var Hweeks = [];


    axios({
      method: "get",
      url: "https://edu.telking.com/api/?type=week",
    }).then((res) => {
    //   console.log("res=>", res)
    res.data.data.series.forEach(item=>{
        Hweek.push(item)  ;
    })
    res.data.data.xAxis.forEach(item=>{
        Hweeks.push(item)
    })

    var histogramOption = {
      title: {
        text: "柱状数据视图",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: Hweeks,
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: Hweek,
        },
      ],
    };

    histogramChart.setOption(histogramOption);
    });


  };
})();
