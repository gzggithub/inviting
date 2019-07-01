<template>
    <div class="voucher">
        <h2 class="topTips" v-show="accountStatus || scanStatus">兑劵</h2>
        <div class="content-box" v-show="accountStatus">
            <p class="account-login">账号登录</p>
            <ul class="form">
                <li ref="telephone" class="item telephone">
                    <input type="text" placeholder="请输入手机号" v-model="data.telephone">
                </li>    
                <li ref="password" class="item password">
                    <input :type="type ? 'password' : 'text'" placeholder="请输入登录密码" v-model="data.password">
                    <img src="../assets/images/eye.png" alt="" @click='showPwd'>
                </li>
            </ul>
            <div class="login">
                <button type="button" class="button" :disabled="loginStatus ? false : true" :class="loginStatus ? 'active' : ''" @click="submit(data)">登录</button>
            </div>
        </div>
        <div class="scan" v-show="scanStatus">
            <div>扫一扫</div>
            <div>退出</div>
        </div>

        <div class="voucher-success" v-show="vocherStatus">
            <img class="success-icon" src="../assets/images/success.png" alt="">
            <div class="title-suc">兑劵成功！</div>
            <div class="auto-return">即将在2s后自动返回</div>
            <div class="sign-out">立即退出</div>
        </div>
        <!-- 全局提示框 -->
        <div class="messageBox" v-show="message.flag">
            <div></div>
            <div>{{message.value}}</div>
        </div>
    </div>
</template>

<script>
    import { login, getJsapi } from '../config';

    export default {
        name: 'voucher',
        data() {
            return {
                code: null,
                // 密码显示和隐藏状态
                type: true,
                // 账号状态
                accountStatus: true,
                // 登录状态
                loginStatus: false,
                // 扫一扫状态
                scanStatus: false,
                // 兑劵状态
                vocherStatus: false,
                data: {
                    telephone: '',
                    password: '',
                },
                // 全局提示框相关变量
                message: {
                    flag: false,
                    value: "",
                    fnTimeout: ""
                }
            }
        },
        created: function() {            
            // 获取参数
            //this.code = this.getUrlParams("code");
        },
        mounted: function() {},
        methods: {
            // 密码显示和隐藏
            showPwd() {
                this.type = !this.type;
            },
            // 获取参数
            getUrlParams(name) {
                const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                const r = window.location.search.substr(1).match(reg); //匹配目标参数
                if (r != null) return unescape(r[2]);
                return null; //返回参数值
            },
            changeURLArg(url, arg, arg_val) {
                var pattern = arg + '=([^&]*)';
                var replaceText = arg + '=' + arg_val;
                if (url.match(pattern)) {
                    var tmp = '/(' + arg + '=)([^&]*)/gi';
                    tmp = url.replace(eval(tmp), replaceText);
                    return tmp;
                } else {
                    if (url.match('[\?]')) {
                        return url + '&' + replaceText;
                    } else {
                        return url + '?' + replaceText;
                    }
                }
            },
            // 登录
            submit(data) {
                const vm = this;
                if (vm.isPhoneNumber(vm.data.telephone) && vm.isPassword(vm.data.password) && vm.loginStatus) {
                    login(data).then((response) => {
                        console.log(response);
                        if (response.data.result === "0") {
                            vm.setMessage("登录成功");
                        } else {
                            vm.setMessage(response.data.message);
                        }
                    }).catch((error) => {
                        alert("失败");
                    }); 
                }
            },
            // 微信扫一扫
            wx() {
                let params = {
                    shareUrl: location.href,
                };
                getJsapi(params)
                .then((response) => {
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: response.data.appId, // 必填，公众号的唯一标识
                        timestamp: response.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: response.data.nonceStr, // 必填，生成签名的随机串
                        signature: response.data.signature,// 必填，签名，见附录1
                        jsApiList: ["scanQRCode"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });
                    wx.ready(() => {
                        wx.scanQRCode({
                            desc: 'scanQRCode desc 扫一扫', // 扫一扫描述
                            needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                            scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                            success: function (res) {
                               // 用户扫一扫成功后执行的回调函数
                               var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                               console.log(result);
                            },
                            error: function(res) {
                                if(res.errMsg.indexOf('function_not_exist') > 0) {
                                    alert('版本过低请升级')
                                }
                            }
                        });
                    });
                    wx.error((res) => {
                        console.log(res);
                    });
                }).catch((error) => {
                    console.log(error);
                });
            },
            // 校验手机号
            isPhoneNumber(phone) {
                if (phone) {
                    const isMob=/^1[0-9]{10}$/;
                    if (isPhone.test(phone) || isMob.test(phone)) {
                        return true;
                    } else {
                        this.setMessage('请输入正确手机号');
                        return false;
                    }
                } else {
                    this.setMessage('请输入手机号');
                    return false;
                }                
            },
            // 校验密码
            isPassword(password) {
                if (password) {
                    return true;
                } else {
                    this.setMessage('请输入登录密码');
                    return false;
                }
            },
            // 设置页面滚动高度
            setScrollTop(value, flag) {
                if (flag) {
                    document.documentElement.scrollTop = value;
                    window.pageYOffset = value;
                    document.body.scrollTop = value;
                }
            },
            // 全局提示框内容设置
            setMessage(value) {
                clearTimeout(this.message.fnTimeout);
                this.message.flag = true;
                this.message.value = value;
                this.message.fnTimeout = setTimeout(() => {
                    this.message = {
                        flag: false,
                        value: "",
                        fnTimeout: ""
                    }
                }, 2000)
            },
        },
        computed: {},
        watch: {
            data: {
                handler(data) {
                    Object.keys(this.data).forEach((key) => {
                        if (this.data[key]) {
                             this.loginStatus = true
                        } else {
                            this.loginStatus = false
                        }
                    });
                },
                deep: true
            },
        },        
    };
</script>

<style scoped>
@import "../assets/style/Voucher.css";
</style>