var slider = mui("#slider");
// 默认他搞了一个开关去控制轮播图是否开启自动轮播图 默认就需要这个功能 获取这个轮播图元素 调用slider传入参数初始化
slider.slider({
    interval: 1000
});
// document.getElementById("switch").addEventListener('toggle', function (e) {
//     if (e.detail.isActive) {
//     } else {
//         slider.slider({
//             interval: 0
//         });
//     }
// });

// 初始化区域滚动插件

mui('.mui-scroll-wrapper').scroll({
    indicators: true, //是否显示滚动条
    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});