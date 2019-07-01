<template>
    <div class="activity-detail">
        <h2 class="topTips">报名表</h2>
        <div class="content-box">
            <ul class="form">
                <li ref="name" class="item name clearfix necessary">
                    <div class="item-title">孩子姓名</div>
                    <div class="item-content">
                        <input type="text" placeholder="请输入姓名" v-model="data.name">
                    </div>
                    <div class="underline"></div>
                </li>
    
                <li ref="telephone" class="item telephone clearfix necessary">
                    <div class="item-title">联系电话</div>
                    <div class="item-content">
                        <input type="text" placeholder="请输入联系电话" v-model="data.phone">
                    </div>
                    <div class="underline"></div>
                </li>
            </ul>
            <ul class="items">
                <li class="item" :class="wxChooseStatus ? 'checked' : ''"  @click="selectWxPay">
                    <div class="wx-icon">
                        <div></div>
                    </div>
                    <span>微信支付</span>
                    <div class="icon">
                        <div></div>
                    </div>
                </li>
            </ul>
            <div class="join-box">
                <button type="button" class="button immediately-join" :disabled="payStatus ? false : true" :class="payStatus ? 'active' : ''" @click="immediatePay(data)">立即支付</button>
            </div>
        </div>
        <!-- 全局提示框 -->
        <div class="messageBox" v-show="message.flag">
            <div class="message clearfix">
                <!-- <div class="warning"></div> -->
                <div>{{message.value}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import router from '@/router/index';

    export default {
        name: 'activity-detail',
        data() {
            return {
                // 测试接口地址
                // baseUrl: 'https://sixsix.taoerxue.com.cn/taoerxue-app/1',
                // 正式接口地址
                baseUrl: 'https://newapi.taoerxue.cn/2',              
                // 支付方式状态
                wxChooseStatus: true,
                // 支付状态
                payStatus: true,
                wxData: {},
                data: {
                    name: '',
                    phone: '',
                    openid: '',
                },
                // 全局提示框相关变量
                message: {
                    flag: false,
                    value: "",
                    fnTimeout: ""
                },
                submitButtonFlag: false,
            }
        },
        created: function() {            
            // 获取用户Ip
            // this.getClientIp();
            // 获取参数
            this.getQuery();
            // 顶部
            this.setScrollTop(0, true);            
        },
        mounted: function() {},
        methods: {
            // 获取参数
            getQuery() {
                const vm = this;                
                vm.data.openid= vm.$route.query.openId;
            },
            // 设置支付成功后跳转页面        
            setPath(id, path) {
                if (path) {
                    router.push({path: path, params: {id: id}})
                }                
            },            
            // 选择支付方式
            selectWxPay() {
                const vm = this;
                console.log(vm.wxChooseStatus);
                if (vm.wxChooseStatus) {
                    vm.wxChooseStatus = false;
                    vm.payStatus = false;
                } else {
                    vm.wxChooseStatus = true;
                    vm.payStatus = true;
                }
            },
            // 点击立即支付
            immediatePay(data) {
                const vm = this;
                // 姓名校验(return false怎么还执行)
                // vm.isName(vm.data.name);
                // 电话校验
                // vm.isPhoneNumber(vm.data.phone);
                if (vm.payStatus && vm.isName(vm.data.name) && vm.isPhoneNumber(vm.data.phone)) {
                    console.log(34343)              
                    axios({
                        url: this.baseUrl + '/swimActivity/pay',
                        type: 'json',
                        method: 'post',
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        data: data,
                        transformRequest: [(data) => {
                            let ret = '';
                            for (let it in data) {
                                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                            }
                            ret = ret.slice(0, ret.length - 1);
                            return ret
                        }]
                    }).then((response) => {
                        console.log(response);
                        if (response.data.result === "0") {
                            // 后台给参数
                            vm.wxData = response.data.data;
                            let data = {
                                appId: vm.wxData.appId,
                                timeStamp: vm.wxData.timeStamp.toString(),
                                nonceStr: vm.wxData.nonceStr,
                                package: "prepay_id=" + vm.wxData.prepayId,
                                signType: vm.wxData.signType,
                                paySign: vm.wxData.paySign
                            }
                            // alert(data.appId);
                            // alert(data.timeStamp);
                            // alert(data.nonceStr);
                            // alert(data.package);
                            // alert(data.signType);
                            // alert(data.paySign);
                            vm.weixinPay(data);
                        } else if (response.data.result === "1") {
                            // 手机号为空
                            vm.setMessage(response.data.message);
                        } else {
                            vm.setMessage(response.data.message);
                        }
                    }).catch((error) => {
                        alert("失败");
                    }); 
                }                
            },
            // 根据后台返回的数据调微信支付
            weixinPay: function(data) {
                const vm= this;
                //微信浏览器内置对象。参考微信官方文档
                if (typeof WeixinJSBridge == "undefined"){
                    if( document.addEventListener ){
                        document.addEventListener('WeixinJSBridgeReady', vm.onBridgeReady(data), false);
                    }else if (document.attachEvent){
                        document.attachEvent('WeixinJSBridgeReady', vm.onBridgeReady(data));
                        document.attachEvent('onWeixinJSBridgeReady', vm.onBridgeReady(data));
                    }
                }else{
                    // 调微信支付
                    vm.onBridgeReady(data);
                }               
            },
            onBridgeReady: function(data) {
                const vm = this;
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', {
                        debug:true,
                        "appId": data.appId, //公众号名称，由商户传入
                        "timeStamp": data.timeStamp, //时间戳，自1970年以来的秒数
                        "nonceStr": data.nonceStr, //随机串
                        "package": data.package,
                        "signType": data.signType, //微信签名方式：
                        "paySign": data.paySign, //微信签名
                        //以上的信息从后台返回的接口获得。
                        // jsApiList: [
                        //     'chooseWXPay'
                        // ]
                },
                function(res){
                    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                    if(res.err_msg === "get_brand_wcpay_request:ok" ) {
                        // 支付成功后的回调
                        // 支付成功后跳转页面
                        vm.setPath(1, '/pay-success');
                    } else if (res.err_msg === "get_brand_wcpay_request:fail") {
                        vm.setMessage("支付失败");
                    } else if (res.err_msg === "get_brand_wcpay_request:cancel") {
                        vm.setMessage("支付取消");
                    } else {
                        // vm.setMessage(res.err_msg);
                        alert(res.err_msg);
                    }
                }
              );
            },
            // 获取ip
            getClientIp() {
                const vm = this;
                axios({
                    url: 'https://api.ipify.org/?format=json',
                    type: 'json',
                    method: 'get',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    transformRequest: [(data) => {
                        let ret = '';
                        for (let it in data) {
                            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                        }
                        ret = ret.slice(0, ret.length - 1);
                        return ret
                    }]
                }).then((response) => {
                    console.log(response);
                    if (response.status === 200) {
                        vm.data.ip = response.data.ip;
                        console.log(vm.data.ip);
                    } else {
                        vm.setMessage("失败");
                    }
                }).catch((error) => {
                    vm.setMessage(error);
                }); 
            },
            // 校验姓名
            isName(name) {
                if (name) {
                    return true;
                } else {
                    this.setMessage('姓名不能为空');
                    console.log(name)
                    return false;
                }
            },
            // 校验电话
            isPhoneNumber(phone) {
                if (phone) {
                    const isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
                    const isMob=/^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/; 
                    if (isPhone.test(phone) || isMob.test(phone)) {
                        return true;
                    } else {
                        this.setMessage('请输入正确电话');
                        return false;
                    }
                } else {
                    this.setMessage('电话不能为空');
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
        watch: {},
        computed: {},
    };
</script>

<style scoped>
@import "../assets/style/ActivityDetail.css";
@import "../assets/style/activity.css";
</style>