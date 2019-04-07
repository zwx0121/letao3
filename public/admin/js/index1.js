var totalPage = 0;
var page = 1;
$(function () {
    queryUser();
    updateUser();

    // 1. 完成后台主页的用户管理页面渲染用户信息功能
    function queryUser() {
        /* 1. 请求后台获取用户信息的API
        2. 创建用户信息的表格的模板
        3. 调用模板生成表格tr
        4. 把表格tr放到tbody */
        //    1. 请求后台获取用户信息的API
        $.ajax({
            url: '/user/queryUser',
            data: {
                page: page,
                pageSize: 5
            },
            success: function (data) {
                console.log(data);
                //    2. 创建用户信息的表格的模板
                //    3. 调用模板生成表格tr
                var html = template('userInfoTpl', data);
                // console.log(html);
                //    4. 把表格tr放到tbody 
                $('.info tbody').html(html);

                // 5. 初始化之前计算当前总共分几页 使用总条数/每页大小 而且向上取整 如果7/5 = 1.2 == 2
                totalPage = Math.ceil(data.total / data.size);
                // console.log(totalPage);
                // 5. 得在数据渲染完之后才知道要分几页才调用初始化分页的函数
                initPage();
            }
        })
    }
    // 2. 完成更新用户状态的函数
    function updateUser() {
        /* 1. 点击了用户管理禁用或者启用按钮就更新用户状态
        2. 获取当前点击按钮的 用户状态
        3. 如果状态0 变成 1 如果是1变成0
        4. 变完成后调用后台的API去完成更新
        5. 更新完成调用查询刷新数据即可 */
        // 1. 给所有禁用启用按钮添加点击事件 由于也是动态添加元素使用委托由于是PC端使用click
        $('.info tbody').on('click', '.btn-option', function () {
            // 2. 获取当前点击按钮的isDelete状态
            var isDelete = $(this).data('isdelete');
            console.log(isDelete);
            // 3. 判断这个值 如果是0 改成1 如果是1改成0 使用三元运算符 如果==0 返回1  不等于返回0
            isDelete = isDelete == 0 ? 1 : 0;
            // 4. 把页面的属性也得变成 改了之后 jquery的data函数可以修改但是页面显示不出来 但是可以设置值是会变的
            $(this).data('isdelete', isDelete);
            var id = $(this).data('id');
            // 5. 调用更新用户信息的API
            $.ajax({
                url: '/user/updateUser',
                type: 'post',
                data: {
                    id: id,
                    isDelete: isDelete
                },
                success: function (data) {
                    // 6. 更新成功调用查询刷新页面
                    if (data.success) {
                        queryUser();
                    }
                }
            })
        });
    }

    // 3. 分页功能
    function initPage() {
        console.log(totalPage);
        /* 1. 总页数根据数据返回条数  / 每页大小 根据总页数来动态渲染分页按钮
        2. 在第一页前面添加上一页按钮 最后一页的后面 添加下一页的按钮
        3. 每个按钮都要点击（点击事件）
        4. 获取当前点击的页码数  点击第几页就获取第几页的页码数 点击上一页页码数-- 下一页 页码数++
        5. 把当前页码数调用查询 传入当前要请求第几页的数据page的值 刷新 */

        // 1. 现在有了总页数假设目前为2 模板需要生成2个按钮 模板只能通过数组 把2 变成 [1,2]
        var pages = [];
        for (var i = 1; i <= totalPage; i++) {
            pages.push(i)
        }
        console.log(pages);
        // 2. pages是数组模板引擎需要对象 把数组包装到对象的pages数组上
        var html = template('pageTpl', {
            pages: pages,
            page: page
        })
        // 3. 把模板到分页ul
        $('.page-list').html(html);

        // 4. 给所有分页按钮添加点击事件
        $('.page-list li').on('click', function () {
            // $(this).addClass('active').siblings().removeClass('active');
            // 5. 获取当前点击页码数 第几页 把全局变量的page改成当前点击的page
            page = $(this).data('page');
            // 6. 调用查询就可以刷新数据
            queryUser();
        });
    }
});