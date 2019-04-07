$(function () {
    register();
    getVCode();

    // 定义一个验证码的全局变量（后台返回的验证码）
    var vCode = '';

    // 注册的功能函数
    function register() {
        /* 1. 点击注册按钮实现注册功能
        2. 注册需要很多信息例如用户名 手机号密码 确认密码  验证
        3. 都要对所有的表单进行非空验证
        4. 验证数据的合法 手机号合法 用户合法 密码一致 验证码一致
        5. 验证都通过了发送请求把用户输入信息传入给后台
        6. 返回成功就跳转到登录 等登录完成再去个人中心就可以了 */
        $('.btn-register').on('tap', function () {
            // 假设验证是通过了的
            var isChecked = true;
            // 2. 对所有输入的表单进行非空验证 获取所有的input标签
            var inputs = $('.mui-input-row input');
            // 遍历数组 使用each函数遍历
            inputs.each(function () {
                // 3. 判断每个输入框的value 去掉了空格了之后是否为空
                // console.log($(this).val());
                if (this.value.trim() == '') {
                    // 4. 提示用户请输入对应的内容
                    // console.log(this.placeholder);
                    mui.toast(this.placeholder, {
                        duration: 1000,
                        type: 'div'
                    });
                    // 只要有一个为空表示没有通过
                    isChecked = false;
                    // alert(this.placeholder)
                    // return;
                    // 为了防止多个表单为空 提示多次 使用return false前面已经出错了后面就不执行
                    // return false阻止当前循环后面循环不会执行了
                    return false;
                }
            });
            // break可以退出循环但是只能退出for循环 while这种循环 但是each不是真正的循环（each叫遍历）
            // for(var i = 0 ; i < inputs.length ;i ++){
            //     if (inputs[i].value.trim() == '') {
            //         // 4. 提示用户请输入对应的内容
            //         // console.log(this.placeholder);
            //         mui.toast(inputs[i].placeholder, {
            //             duration: 'long',
            //             type: 'div'
            //         });
            //         // 只要有一个为空表示没有通过
            //         isChecked = false;
            //         break;
            //     }
            // }
            // 如果依然为true 表示没有为空 继续进行后续判断
            if (isChecked) {
                // 只有当这个isChecked成立才表示非空验证通过才可以执行后续逻辑
                // 4. 做一些合法判断 手机号合法 用户名合法 密码一致 验证码一致
                var mobile = $('.mobile').val().trim();

                // if (/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(mobile) == false) {
                if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(mobile)) {
                    mui.toast('手机号输入不合法', {
                        duration: 1000,
                        type: 'div'
                    });
                    return false;
                }
                var username = $('.username').val().trim();
                if (!/^[0-9a-zA-Z]{6,12}$/.test(username)) {
                    mui.toast('用户名不合法6-16之间的字母或者数字', {
                        duration: 1000,
                        type: 'div'
                    });
                    return false;
                }
                var password1 = $('.password1').val().trim();
                var password2 = $('.password2').val().trim();
                if (password1 != password2) {
                    mui.toast('两次输入的密码不一致', {
                        duration: 1000,
                        type: 'div'
                    });
                    return false;
                }
                var vcode = $('.vcode').val().trim();
                // 判断当前用户输入的vcode和全局的vCode是否一致
                if (vcode != vCode) {
                    mui.toast('验证码输入错误', {
                        duration: 1000,
                        type: 'div'
                    });
                    return false;
                }
                // 5. 验证通过就调用API传入这些输入的信息实现注册功能
                $.ajax({
                    url: '/user/register',
                    type: 'post',
                    data: {
                        username: username,
                        mobile: mobile,
                        password: password1,
                        vCode: vCode
                    },
                    success: function (data) {
                        // 6. 判断如果注册失败提示用户失败的原因
                        if (data.error) {
                            mui.toast(data.message, {
                                duration: 1000,
                                type: 'div'
                            });
                        } else {
                            // 7. 没有失败就成功成功就跳转 到登录页面 (登录成功不能再返回注册 应该登录成功去到主页或者个人中心)
                            location = 'login.html?returnurl=user.html';
                        }
                    }
                })
            }


        });
    }

    // 获取验证码
    function getVCode() {
        // 1. 点击了获取验证码就要调用获取验证码的接口去获取验证码
        // 2. 把验证码打印控制台（真实是要发送到用户手机 使用真实手机验证码的API 要钱的）
        $('.btn-get-vcode').on('tap', function () {
            // 2. 调用获取验证码的API
            $.ajax({
                url: '/user/vCode',
                success: function (data) {
                    console.log(data.vCode);
                    // 拿到后台的验证码之后把全局的变量vCode改成后台返回的验证码
                    vCode = data.vCode;
                }
            })
        });
    }
})