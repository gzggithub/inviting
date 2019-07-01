<template>
    <div class="voucher">
        <div class="header">
            <img src="../assets/images/login_pockets.png" alt="">
        </div>
        <div class="content-box" v-show="accountStatus">
            <p class="account-login">已有<span> {{numbers}} </span>人成功领取红包</p>
            <ul class="form">
                <li ref="telephone" class="item telephone">
                    <input type="text" placeholder="请输入手机号" v-model="data.telephone">
                    <div class="error" v-show="isPhoneErrorStatus">
                        <div class="icon"></div>请输入正确的手机号码
                    </div>
                    <div class="success icon" v-show="isPhoneSucStatus"></div>
                </li>
                <li ref="verifyCode" class="item verifyCode necessary">
                    <div class="item-content">
                        <input type="text" placeholder="请输入验证码" v-model="data.verifyCode">
                        <button type="button" class="codeButton" :class="isPhoneNumber&&codeButtonStatus ? 'active' : ''" @click="sendCode">
                            <span>{{codeButtonStatus ? "获取验证码" : countDown + "s后重发"}}</span>
                        </button>
                    </div>
                    <div class="error" v-show="isVerifyStatus">
                        <div class="icon"></div>验证码错误
                    </div>
                </li>                
            </ul>
            <div class="login">
                <button type="button" class="button" :disabled="loginStatus ? false : true" :class="loginStatus ? 'active' : ''" @click="submit(data)">立即领取</button>
            </div>
        </div>
        <div class="line"></div>
        <div class="footer">
            <div class="rules-title">活动规则</div>
            <p>1.新人红包仅限未使用淘儿学的用户领取；</p>
            <p>2.每位新用户限领1次，相同注册手机号、支付账号、硬件设备等其他可判定为同一用户的情形均视为同一用户；</p>
            <p>3.优惠券使用范围：全场通用。</p>
            <p>4.退款后优惠券不退回；</p>
            <p>5.要想得到更多的券需要邀请不同的新用户哦；</p>
            <p>6.红包请下载APP后点击“我的”-“我的优惠券”查看；</p>
            <p>7.本活动最终解释权归淘儿学所有</p>
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
    import { login, getJsapi, getVerificationCode, receive} from '../config';

    export default {
        name: 'voucher',
        data() {
            return {
                code: null,
                // 账号状态
                accountStatus: true,
                // 登录状态
                loginStatus: false,
                // 兑劵状态
                vocherStatus: false,
                numbers: 12345,
                isPhoneErrorStatus: false,
                isPhoneSucStatus: false,
                // 短信验证码相关变量
                codeButtonStatus: true,
                countDown: 0,
                isVerifyStatus: false,
                fn_countDown: "",
                data: {
                    telephone: '',
                    verifyCode: '',
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
            // this.code = this.getUrlParams("code");
            // this.numbers = this.getUrlParams('numbers');
        },
        mounted: function() {},
        methods: {
            // 获取参数
            getUrlParams(name) {
                const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                const r = window.location.search.substr(1).match(reg); //匹配目标参数
                if (r != null) return unescape(r[2]);
                return null; //返回参数值
            },
            // 倒计时
            countDownCheck() {
                if (this.countDown <= 0) {
                    clearInterval(this.fn_countDown);
                    this.codeButtonStatus = true;
                    this.countDown = 0;
                    return;
                }
                this.countDown = this.countDown - 1;
            },
            // 发送验证码
            sendCode() {
                if (!this.codeButtonStatus) {
                    return
                }
                if (this.isPhoneNumber) {
                    console.log("phone")
                    const params = {
                        phone: this.data.telephone,
                        type: 3,
                    };
                    getVerificationCode(params)
                    .then((response) => {
                        console.log(response);
                        if (response.data.result === "0") {
                            // 验证码发送成功，按钮设为不可点击
                            this.codeButtonStatus = false;
                            // 倒计时开启
                            this.countDown = 60;
                            // 倒计时监听函数开启
                            this.fn_countDown = setInterval(this.countDownCheck, 1000);                         
                        } else {
                            this.setMessage(response.data.message);
                        }
                    }).catch((error) => {
                        this.setMessage("获取失败");
                    });
                } else {
                    if (this.data.phone) {
                        this.setMessage("请填写正确的手机号码");
                    } else {
                        this.setMessage("手机号码不能为空");
                    }
                }
            },
            // 登录
            submit(data) {
                const vm = this;
                if (vm.isPhoneNumber(vm.data.telephone) && vm.isVerifyCode(vm.data.verifyCode) && vm.loginStatus) {
                    login(data).then((response) => {
                        console.log(response);
                        if (response.data.result === "0") {
                            vm.setMessage("登录成功");
                            vm.isVerifyStatus= false;
                        } else if (response.data.result === "2") {
                            // 验证码错误
                            vm.isVerifyStatus= true;
                            // vm.setMessage(response.data.message);
                        } else {
                            vm.setMessage(response.data.message);
                            vm.isVerifyStatus= false;
                        }
                    }).catch((error) => {
                        alert("失败");
                    }); 
                }
            },
            // 校验验证码
            isVerifyCode(verifyCode) {
                if (verifyCode) {
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
        computed: {
            // 校验手机号
            isPhoneNumber() {
                if (this.data.telephone) {
                    const isMob=/^1[0-9]{10}$/;
                    if (isMob.test(this.data.telephone)) {
                        this.isPhoneSucStatus = true;
                        this.isPhoneErrorStatus = false;
                        return true;
                    } else {
                        // this.setMessage('请输入正确手机号');
                        this.isPhoneSucStatus = false;
                        this.isPhoneErrorStatus = true;
                        return false;
                    }
                } else {
                    this.isPhoneSucStatus = false;
                    this.isPhoneErrorStatus = false;
                    // this.setMessage('请输入手机号');
                    return false;
                }
            }
        },
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