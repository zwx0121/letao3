// 初始化区域滚动插件
// 初始化左侧不要滚动条
mui('.category-left .mui-scroll-wrapper').scroll({
    indicators: false, //是否显示滚动条
    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});
// 初始化右侧 需要滚动条
mui('.category-right .mui-scroll-wrapper').scroll({
    indicators: true, //是否显示滚动条
    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});