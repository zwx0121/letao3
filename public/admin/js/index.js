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
                // 6. 得在数据渲染完之后才知道要分几页才调用初始化分页的函数
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

    // 3. 使用分页插件实现分页功能 函数
    function initPage() {
        /* 1. 先引包引入插件 bootstrapPaginator.js文件
        2. 写一个结构 ul
        3. 调用分页插件的初始化函数  传人一堆参数
        4. 当前页码数（控制哪个高亮）
        5. totalPages 总页码数 总条数/每页大小
        6. 总条数请求了数据才知道要等到数据渲染完后再初始化分页
        7. 还有一个点击事件点击每个分页按钮都会触发事件 里面最后一个参数就当前点击的页码数
        8. 把当前点击页码数覆盖全局变量页码数
        9. 调用查询刷新页面既可 */
        $(".page-list").bootstrapPaginator({
            bootstrapMajorVersion: 3, //对应的bootstrap版本
            currentPage: page, //当前页数 也是外面定义的全局变量当前页码数
            numberOfPages: 10, //每次显示页数
            totalPages: totalPage, //总页数 外面定义全局变量totalPage
            shouldShowPage: true, //是否显示该按钮
            useBootstrapTooltip: true,
            //点击事件
            onPageClicked: function (event, originalEvent, type, nowPage) {
                console.log(nowPage);
                // nowPage就是当前点击的每一页
                // 把全局变量的page赋值为当前的nowPage
                page = nowPage;
                // 重新调用查询刷新页面
                queryUser();
            }
        });
    }

});