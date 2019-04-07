var totalPage = 0;
var page = 1;
$(function () {
    querySecondCategory();
    addSecondCategory();
    // 1. 查询二级分类的函数
    function querySecondCategory() {
        /* 1. 请求后台获取用户信息的API
        2. 创建用户信息的表格的模板
        3. 调用模板生成表格tr
        4. 把表格tr放到tbody */
        //    1. 请求后台获取用户信息的API
        $.ajax({
            url: '/category/querySecondCategoryPaging',
            data: {
                page: page,
                pageSize: 5
            },
            success: function (data) {
                console.log(data);
                //    2. 创建用户信息的表格的模板
                //    3. 调用模板生成表格tr
                var html = template('secondCategoryTpl', data);
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
    // 2. 使用分页插件实现分页功能 函数
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
                querySecondCategory();
            }
        });
    }

    // 3. 添加品牌功能函数
    function addSecondCategory() {
        /* 1. 点击添加品牌的时候要把模态框的分类下拉框动态渲染
        2. 点击图片能够实现图片预览和上传
        3. 点击保存 获取当前选择的分类id 品牌名称 品牌logo 火热品牌(默认为1) 
        4. 把品牌信息调用API去添加品牌
        5. 添加成功就调用查询刷新页面 */

        // 1. 点击添加品牌渲染下拉框 
        // 1.1 给点击添加品牌添加点击事件
        $('.btn-add-brand').on('click', function () {
            //  1.2 请求所有一级分类的API接口 /category/queryTopCategory 不带分页
            $.ajax({
                url: '/category/queryTopCategory',
                success: function (data) {
                    // 1.3 指定一个字符串html 使用字符串拼接的方式来生成option
                    var html = '';
                    for (var i = 0; i < data.rows.length; i++) {
                        // console.log(data.rows[i]);
                        html += '<option value="' + data.rows[i].id + '">' + data.rows[i].categoryName + '</option>'
                    }
                    //    1.4 把拼接好的的字符串option添加到下拉框里面
                    $('.select-category').html(html);
                }
            })
        });

        // 初始化文件上传插件  
        $('#select-logo').fileupload({
            success: function (data) {
                // success选择文件点击了确定会触发
                console.log(data);
                $('.brand-logo').attr('src', data.picAddr)
            }
        })
        /* 3. 实现添加品牌的功能
            1. 点击保存就要添加品牌
            2. 需要分类id 品牌名称 品牌logo (是要后台给你返回的路径)
            3. 点击保存先把文件真正传给后台 后台就返回图片上传之后的一个路径(真实文件路径)
            4. 拿到路径之后 和 id 名称 一起调用API添加品牌 */
        // 3.1 给保存按钮添加一个点击事件
        $('.btn-save').on('click', function () {

            // 3.2 当图片上传成功后获取当前分类id 品牌名称 品牌logo 一起调用添加二级分类的API去添加品牌
            var categoryId = $('.select-category').val();
            console.log(categoryId);
            var brandName = $('.brand-name').val().trim();
            console.log(brandName);
            // 3.3 获取当前要上传的图片文件 调用后台图片上传的接口传给后台
            // 如果当前没有选择图片就无法上传后面代码就不执行了            
            
            // 3.4 图片在选择的时候已经上传了再这里只要获取图片上传的路径 前面已经绑定到图片的src上 就直接获取src即可
            var brandLogo = $('.brand-logo').attr('src');
            $.ajax({
                url: '/category/addSecondCategory',
                type: 'post',
                data: {
                    categoryId: categoryId,
                    brandName: brandName,
                    brandLogo: brandLogo,
                    hot: 1
                },
                success: function (data) {
                    // 3.15 如果返回成功调用查询二级分类列表刷新页面
                    if (data.success) {
                        querySecondCategory();
                    }
                }
            })
        });
    }
});