$(function () {
    // 记得写完函数马上调用 只是为取分功能 调用登录函数
    login();
    // 1. 登录功能的函数
    function login() {
        /* 1. 点击登录按钮实现登录
        2. 获取当前用户输入的用户名和密码
        3. 进行非空验证
        4. 调用后台提供的登录接口 并且传人当前的用户名和密码
        5. 获取后台返回登录信息是成功还是失败  失败就提示用户重新输入 
        6. 如果成功获取当前url 跳转回到这个地址 */
        
        // 1. 给登录按钮添加点击事件 PC端事件是click
        $('.btn-login').on('click', function () {
            // 2. 获取当前用户输入用户名和密码 去掉首尾空格
            var username = $('#username').val().trim();
            // 3. 判断当前用户名是否输入
            if (username == '') {
                alert('请输入用户名')
                // 推荐return false 后面代码包括默认行为都不会执行
                return false;
            }
            // 4. 获取当前用户输入的密码 去掉首尾空格
            var password = $('#password').val().trim();
            if (password == '') {
                alert('请输入密码')
                // 推荐return false 后面代码包括默认行为都不会执行
                return false;
            }
            // 5. 调用API登录 传人用户名和密码
            $.ajax({
                // 后台接口文档里面的API
                url: '/employee/employeeLogin',
                type: 'post',
                data: {
                    username: username,
                    password: password
                },
                success: function (data) {
                    console.log(data);
                    // 6. 判断登录是否失败
                    if (data.error) {
                        // 7. 把错误信息提示给用户
                        alert(data.message)
                    } else {
                        // 8. 如果没有错表示成功 成功跳转到当前returnurl里面的地址
                        location = 'index.html'
                    }
                }
            })
        });
    }
})