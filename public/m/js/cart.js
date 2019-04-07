$(function () {
    queryCart();
    deleteCart();
    editCart();

    //  1. 查询购物车功能
    function queryCart() {
        /* 1. 调用查询购物车的API接口
        2. 如果没登录后台返回 error表示未登录 跳转到登录
        3. 如果返回没有错误 已经登录
        4. 登录了就调用模板渲染购物车列表 */
        // 1. 调用查询购物车的API接口
        $.ajax({
            url: '/cart/queryCart',
            success: function (data) {
                console.log(data);
                //   2. 如果没登录后台返回 error表示未登录
                if (data.error) {
                    // 3. 跳转到登录页面 同时把当前购物车页面url传递过去 等登录成功后返回到购物车页面
                    location = 'login.html?returnurl=' + location.href;
                } else {
                    // 4. 后台返回有数据就要调用模板去渲染模板 但是数据格式是数组不是对象 包装到对象里面
                    // 把 data数组 放到对象的list的数组上
                    var html = template('cartListTpl', {
                        data: data
                    })
                    // 5. 把列表放到ul里面
                    $('.cart-list').html(html);
                    // 6. 因为列表很多超出页面高度 要使用区域滚动 去初始化区域滚动
                    mui('.mui-scroll-wrapper').scroll({
                        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
                    });
                    // 7. 注意计算总金额的函数 应该在页面渲染完成后再调用 这个时候页面才有了input复选框标签才能知道有没有被选中
                    getCount();
                    // 8. 点击选中或者取消复选框都要重新计算总金额
                    // 9. 给所有复选框添加一个change事件                    
                    $('.mui-checkbox input').on('change',function (){
                        // 10. 每当复选框的值发生变化重新调用计算总金额
                        getCount();
                    });
                }
            }
        })
    }

    // 2. 删除购物车的商品功能
    function deleteCart() {
        /* 1. 点击侧滑删除按钮 
        2. 弹出一个确认框
        3. 确认框里面 如果点击取消就不删 就滑动回去
        4. 如果点击确定 获取当前要删除的商品id 调用删除API去删除 */
        // 1. 给删除按钮添加点击事件(动态元素使用委托)
        $('.cart-list').on('tap', '.btn-delete', function () {
            // 5. 获取当前点击的删除按钮的父元素的父元素li标签
            // var li = this.parentNode.parentNode;// 而且一定是dom对象不能是zepto对象
            var li = $(this).parent().parent()[0]; // 如果是zepto对象在使用[0]转成dom对象
            // 7.1 获取当前要删除商品id 在点击事件的回调函数获取id
            var id = $(this).data('id');
            // 2. 弹出一个确认框问用户是否删除
            mui.confirm("您真的要删除我吗?", '温馨提示', ['确定', '取消'], function (e) {
                console.log(e);
                // 3. 判断用户点击了确定还是取消 如果是取消要滑动回去
                if (e.index == 1) {
                    // 4. 滑动回去
                    setTimeout(function () {
                        // 注意不能放到弹框回调函数里面获取当前删除按钮的父元素父元素li
                        // 因为这个弹框的回调函数不是按钮调用是window调用 this指向是window2
                        // 获取当前点击的删除按钮的父元素的父元素li标签
                        //  var li = this.parentNode.parentNode;
                        console.log(li);
                        // 6. 拷贝了之后要把$换成mui因为其实是mui的函数
                        mui.swipeoutClose(li);
                    }, 100);
                } else {
                    // 7. 如果点击了确定要删除当前的商品
                    // 7.2 调用删除的功能函数把当前id商品id删除
                    $.ajax({
                        url: '/cart/deleteCart',
                        data: {
                            id: id
                        },
                        success: function (data) {
                            console.log(data);
                            if (data.success) {
                                // 8. 如果返回成功就提示用户删除成功
                                mui.toast('删除成功', {
                                    duration: 1000,
                                    type: 'div'
                                });
                                // 9. 重新调用查询刷新页面
                                queryCart();
                            } else {
                                // 10. 删除失败跳转到登录可能是没登录
                                location = 'login.html?returnurl=' + location.href;
                            }
                        }
                    })
                }
            });
        });
    }

    // 3. 购物车的编辑功能
    function editCart() {
        /* 1. 点击编辑按钮
        2. 弹出一个确认框
        3. 准备一些编辑框需要的模板
        4. 把模板放到编辑框的内容里面
        5. 而且也要在弹出后进行初始化点击尺码和数量(因为弹出框也是动态添加的元素)
        6. 判断确认框点击了确定还是取消
        7. 如果是取消 滑动回去
        8. 如果点击了确定 获取最新的尺码 数量 等调用购物车编辑功能的API实现编辑 */
        // 1. 给编辑按钮添加点击事件 也要使用委托
        $('.cart-list').on('tap', '.btn-edit', function () {
            console.log(this);
            // 侧滑回去的li标签
            var li = $(this).parent().parent()[0]; // 如果是zepto对象在使用[0]转成dom对象
            // 2. 点击弹框之前要准备好一些弹框的模板
            // 2.1 通过当前编辑按钮获取身上data-product属性获取整个商品对象
            var product = $(this).data('product');
            console.log(product);
            // 2.2 商品数据里面尺码也是有问题也是字符串 转成一个数组
            var productSize = [];
            var min = product.productSize.split('-')[0] - 0;
            var max = product.productSize.split('-')[1] - 0;
            for (var i = min; i <= max; i++) {
                productSize.push(i);
            }
            product.productSize = productSize;
            // 2.3 调用当前编辑商品的模板生成html 传入当前的商品对象
            var html = template('editCartTpl', product);
            // 2.4 把模板里面的回车换行 替换成空 因为MUI的确认框会把回车换行替换成br标签 使用 正则去掉
            html = html.replace(/[\r\n]/g, '');
            // console.log(html);
            // 3. 弹出一个确认框
            // 当模板准备好了放到确认框内容里面 但是默认会把所有回车换行都替换成br标签 在放入之前去的回车换行
            mui.confirm(html, '温馨提示', ['确定', '取消'], function (e) {
                // 6. 点击确认框的确定或者取消 需要执行编辑功能 
                if (e.index == 1) {
                    // 7. 如果点击了取消 滑动回去
                    mui.swipeoutClose(li);
                } else {
                    // 8. 点击确定 获取最新选择的尺码和数量来调用编辑API去编辑
                    var size = $('.mui-btn.mui-btn-warning').data('size');
                    console.log(size);
                    // 9. 获取当前选择的数量
                    var num = mui('.mui-numbox').numbox().getValue();
                    console.log(num);
                    // 10. 调用编辑购物车的APi传入当前编辑一些信息
                    $.ajax({
                        url: '/cart/updateCart',
                        type: 'post',
                        data: {
                            id: product.id,
                            size: size,
                            num: num
                        },
                        success: function (data) {
                            //   11. 如果编辑成功就调用查询刷新页面
                            if (data.success) {
                                queryCart();
                            }
                        }
                    })
                }
            });
            // 4. 数字框也是动态完成要手动初始化 因为弹框出来了页面有这个元素了就可以初始化了
            mui('.mui-numbox').numbox();
            // 5. 初始化尺码点击
            // 给所有尺码添加点击事件 切换类名
            $('.product-size button').on('tap', function () {
                $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
            });
        })
    }


    // 4. 计算总金额
    function getCount() {
            /* 1. 获取页面中所有被选中的复选框
            2. 遍历每一个被选复选框
            3. 计算每个选中商品的总价 当前单价*数量
            4. 把每个商品的单价加起来就是总价 */
        var checkeds = $('.mui-checkbox input:checked');
        console.log(checkeds);
        // 4. 定义一个总价
        var sum = 0;
        // 2. 遍历所有被选中的复选框
        checkeds.each(function () {
            // 3. 获取当前每个选中复选框属性上价格和数量
            var price = $(this).data('price');
            var num = $(this).data('num');
            console.log(price);
            console.log(num);
            var singleCount = price * num;
            // 5. 把每个商品的单价累加到总价sum里面
            sum += singleCount;
        })
        // 原生JS也提供了数组遍历的函数 forEeach 里面参数也是一个回调函数 回调函数里面第一个参数值第二个索引
        // checkeds.forEach(function (value,index){
        //     console.log(value);
        // })
        console.log(sum);
        // 数字有一个函数 四舍五入函数 还可以传人一个参数 保留几位小数
        sum = sum.toFixed(2);
        // 利用*100取整再除以100 除不会出现很多小数
        // sum = parseInt(sum*100)/100;
        // 6. 把总价渲染到页面上
        $('.order-count span').html(sum);
    }
})