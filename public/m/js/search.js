$(function () {
    // 使用框架式编程 定义函数和调用函数
    addHistory();
    queryHistory();
    deleteHistory();
    clearHistory();
    initScroll();
    gotoProductlist();

    /* 1. 添加记录函数 */
    function addHistory() {
        /* 添加记录的思路
            1. 点击搜索添加记录 添加事件
            2. 获取当前输入内容 搜索的内容
            3. 判断如果没有输入内容 提示输入
            4. 把记录添加到本地存储中
            5. 因为连续添加记录应该把数据放到一个数组中 把数组整个加入到本地存储中
            6. 而且还得获取之前的数组之前有数组 使用之前的数组往这个里面添加 新的搜索的值
            7. 而且如果搜索内容重复还要对数组去重（把旧的删掉 在添加新的） 新的内容往数组最前面加
            8. 加完后把数组保存到本地存储中（转成json字符串） */
        // 1. 获取按钮添加点击事件 使用zepto都使用tap事件
        $('.btn-search').on('tap', function () {
            console.log(1);
            // 2. 获取当前输入内容 搜索的内容 把空格去掉 而且把首尾两端空格去掉
            var search = $('.input-search').val().trim();
            console.log(search);
            // 3. 判断如果没有输入内容 提示输入
            if (search == '') {
                // 提示请输入要搜索 商品 使用MUI的消息框 自动消失消息框
                mui.toast('请输入合法搜索内容!', {
                    duration: 'long',
                    type: 'div'
                });
                // 后面的代码也不执行了 所有使用return
                // return;
                // return false 不仅仅可以终止当前函数 还可以终止后面还要做的事情 比如表单提交等
                return false;
            }
            // 4. 把当前记录加入到一个数组中 这个数组要看之前有没有数据有就使用之前数组去加 如果没有值就使用新的空数组加
            var searchHistory = localStorage.getItem('searchHistory');
            // 5. 判断之前数组有没有值
            if (searchHistory) {
                // 得把之前的值 转成一个数组 把字符串转成数组JSON.parse()
                searchHistory = JSON.parse(searchHistory);
            } else {
                // 否则没有值就是空 使用空数组
                searchHistory = [];
            }
            console.log(searchHistory);
            // 6. 在添加之前还要进行去除 把之前旧的重复的值删掉
            // 6.1 循环遍历整个数组
            for (var i = 0; i < searchHistory.length; i++) {
                // 6.2 判断当前数组的中每个值的key是否和当前输入search一致
                if (searchHistory[i].key == search) {
                    // 6.3 应该删掉当前这个数组的值 splice删除数组中某个值第一个参数是删除的元素索引 第二个删除个数
                    searchHistory.splice(i, 1)
                    // 6.4 如果有多个重复的数据 删掉一个值数组长度少了一个 i--
                    i--;
                }
            }
            // 7. 往数组里面添加值 push 往后 unshift往前加
            searchHistory.unshift({
                key: search,
                time: new Date().getTime()
            });
            console.log(searchHistory);
            // 8. 把数组转成json字符串存储到本地存储中
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            // 9. 只要在添加完成后调用查询函数 查询刷新数据了
            queryHistory();
            // 10. 添加完成后清空输入框
            $('.input-search').val('');
            // 11. 跳转到商品列表并且传递一些参数过来  跳转页面为了防止页面缓存多传一个参数 时间 随机数等 页面url变了重新请求不会使用缓存
            location = 'productlist.html?search=' + search + '&time=' + new Date().getTime();
        });
    }
    /* 2. 查询记录函数 */
    function queryHistory() {
        /* 查询思路
            1. 获取存储里面存的数据(把字符串转成数组)
            2. 创建模板 
            3. 调用模板把数据作为template的参数（对象 但是这里是数组 一定要包在一个对象的属性上）
            4. 把模板渲染到ul里面 */
        // 1. 把当前记录加入到一个数组中 这个数组要看之前有没有数据有就使用之前数组去加 如果没有值就使用新的空数组加
        var searchHistory = localStorage.getItem('searchHistory');
        // 2. 判断之前数组有没有值
        if (searchHistory) {
            // 得把之前的值 转成一个数组 把字符串转成数组JSON.parse()
            searchHistory = JSON.parse(searchHistory);
        } else {
            // 否则没有值就是空 使用空数组
            searchHistory = [];
        }
        console.log(searchHistory);
        // 3. 调用模板传人id 和数据 数据要求是对象把 searchHistory 放到对象的属性上
        var html = template('searchHistoryTpl', {
            list: searchHistory
        });
        // 4.  把生成html放到ul里面
        $('.search-history ul').html(html);

    }
    // 7.1 定义一个变量确认是否点击isDelete
    var isDelete = false;
    /* 3. 删除记录函数 */
    function deleteHistory() {
        /* 删除思路
            1. 给所有删除按钮添加点击事件（页面历史记录列表是动态渲染查询了之后才有列表）要使用委托添加事件 
            2. 点击删除按钮的要获取当前要删除的元素的索引
            3. 再获取搜索记录的数组 把这个索引对应的值删掉
            4. 重新把删除完成后的数组 保存到本地存储中
            5. 调用查询刷新列表*/
        // 1. 通过给父元素ul加事件 委托到里面的删除按钮
        $('.search-history ul').on('tap', '.btn-delete', function (e) {
            // 获取元素身上的自定义属性的值
            // console.dir(this.dataset['index']);
            // console.log($(this).data('index'));
            // 2. 获取当前要删除的元素的索引
            var index = $(this).data('index');
            // 3. 获取当前本地存储的数组 默认获取的是字符串 转成真正的数组            
            var searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
            // 4. 在当前数组中删除掉这个索引的元素
            searchHistory.splice(index, 1);
            console.log(searchHistory);
            // 5. 删除完成后重新保存到本地存储 保存的只能是字符串 转成字符串再保存
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            // 6. 调用查询刷新页面
            queryHistory();
            // var parent = $(this).parent();
            // 把列表中的元素删掉 因为页面索引没更新 下次删除的时候删除不掉这个数据
            // $(this).parent().remove();   
            // 7.2 点击了之后把isDelete换成 true
            isDelete = true;
        });
    }

    /* 4. 清空记录函数 */
    function clearHistory() {
        /* 思路
            1. 点击清空按钮清空
            2. 把整个本地存储键删掉 或者 调用clear清空所有(但这样会把其他键也会删除)
            3. 删除完成后重新查询即可 */
        // 1. 点击清空按钮
        $('.btn-clear').on('tap', function () {
            // 2. 删掉本地存储的searchHistory键和值
            localStorage.removeItem('searchHistory');
            // 3. 调用查询刷新列表
            queryHistory();
        })
    }

    /* 5. 滑动列表 初始化区域滚动的函数*/
    function initScroll() {
        //  初始化区域滚动
        mui('.mui-scroll-wrapper').scroll({
            indicators: false, //是否显示滚动条 如果不想要滚动条把这个参数的值改成false
            deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏        
        });
    }

    /* 6. 点击历史记录的某个记录跳转到商品列表搜索功能函数 */
    function gotoProductlist() {
        /* 1. 点击列表中的某个元素要跳转到商品列表实现搜索功能
        2. 获取当前点击列表的要跳转传过去搜索的值
        3. 使用location跳转页面 并且把当前这个值传过去 */
        // 1. 给所有列表绑定点击事件
        $('.search-history .mui-table-view').on('tap', 'li', function (e) {
            console.log(e);
            // 7.3 判断如果isDelete依然还是false 表示没点过删除 就可以跳转
            if (isDelete == false) {
                // 2. 获取当前列表data-search的值
                var search = $(this).data('search');
                console.log(search);
                // 3. 跳转到商品列表 把当前search传过去
                location = 'productlist.html?search=' + search + '&time=' + new Date().getTime();
            }
            // 7.4 还要重置一下 为了他下次还能继续点
            isDelete = false;
        });
    }
})