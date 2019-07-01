<template>
    <div class="activity-signup">
        <div class="banner"></div>
        <div class="price flex">
            <div class="price-item">
                <span>￥6.1</span>
                ￥<span>1299.00</span>
            </div>
            <div class="price-item flex-item flex">
                <div class="activity-end flex-item">
                    <span>活动结束 仅剩</span>
                </div>
                
                <ul class="time flex flex-item">
                    <li class="time-item flex-item">{{isDay}}</li>天
                    <li class="time-item flex-item">{{isHour}}</li>:
                    <li class="time-item flex-item">{{isMinute}}</li>:
                    <li class="time-item flex-item">{{isSecond}}</li>
                </ul>
            </div>
        </div>
        <div class="activity-instruction">
            <h3>活动介绍</h3>
            <p class="instruction-content">{{content}}</p>
        </div>
        <div class="join-box">
            <div class="immediately-join active" @click="setPath">立即参与</div>
        </div>
        <!-- 加载中 -->
        <!-- <div class="loading" v-show="loading"></div> -->
        <!-- 全局提示框 -->
        <div class="messageBox" v-show="message.flag">
            <div class="message clearfix">
                <div class="warning"></div>
                <span>{{message.value}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import router from '@/router/index';

    export default {
        name: 'activity-signup',
        data() {
            return {
                // 测试接口地址
                // baseUrl: 'https://sixsix.taoerxue.com.cn/taoerxue-app/1',
                // 正式接口地址
                baseUrl: 'https://newapi.taoerxue.cn/2',
                // code
                code: '',
                openId: '',           
                // 活动结束时间 (ios手机不能使用 2019-06-30 23:59:59 格式)
                endTime: '2019/06/30 23:59:59',
                day: 0,
                hours: 0,
                minute: 0,
                second: 0,
                content: "为了丰富孩子们的课余生活，培养运动兴趣，增强体质，并掌握一项必备的生存技能。淘儿学携手杭城游泳机构共同举办此次“六一游泳季——6.1元抢购1299元课程”节日活动。“泳”往直前，收获健康快乐吧！",
                // 全局提示框相关变量
                loading: false,
                message: {
                    flag: false,
                    flagSuc: false,
                    value: "",
                    // fnTimeout: ""
                },
            }
        },
        created: function() {
            const vm = this;
            // 获取code
            vm.getCode();
        },
        mounted: function() {
            // 倒计时
            setInterval(() => {                
                this.countdown();                
            }, 1000)
        },
        methods: {
            // 获取参数中的code
            getUrlParam(name) {
                var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg)
                if(r!=null) {
                    return unescape(r[2]);
                }
                return null;
            },
            getCode() {
                const vm = this;
                // let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx718cffff1118e5e3&redirect_uri=' + encodeURIComponent(local) + '&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect';
                // 非静默授权，第一次有弹框
                let access_code = vm.getUrlParam('code');
                // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId
                let local = window.location.href;
                vm.local = local;
                console.log(local);
                if (access_code === null || access_code === '') {
                    // window.location.href = url;
                } else {
                    vm.code = access_code;
                    // 通过code获取openid
                    // vm.getOpenId(vm.code);         
                }
            },
            // 设置跳转路由
            setPath() {
                const vm = this;
                console.log(vm.data);
                vm.loading = true;
                // vm.setMessage('加载中...', true);
                if (vm.code) {
                    vm.getOpenId(vm.code)
                }           
            },
            // 通过code获取openid
            getOpenId (code, url) {
                const vm = this;
                axios({
                    url: vm.baseUrl + '/swimActivity/getOpenid',
                    type: 'json',
                    method: 'post',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    data: {
                        code: code,
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
                        // if (response.data.data === '') {
                        //     window.location.href = url;
                        // }
                        // vm.setMessage('加载成功', false)
                        vm.loading = false;
                        vm.openId = response.data.data;
                        console.log(response.data.data);
                        // localStorage.setItem('openId', response.data);
                        // 跳转支付页面
                        vm.$router.push({
                            path: '/activity-detail',
                            query: {
                                openId: response.data.data,
                            }
                            // 一定要写name,params必须用name来识别路径
                            // name: '/ActivityDetail',
                            // params: {
                            //     openId: openId
                            // },
                        })   
                    } else {
                        alert("失败")
                        vm.loading = true;
                    }
                }).catch((error) => {
                    alert(error)
                    vm.setMessage(error);
                    vm.loading = true;
                }); 
            },            
            // 设置页面滚动高度
            setScrollTop(value, flag) {
                if (flag) {
                    document.documentElement.scrollTop = value;
                    window.pageYOffset = value;
                    document.body.scrollTop = value;
                }
            },
            // 倒计时
            countdown() {
                var nowTime = Math.floor(new Date());
                var endTime = Math.floor(new Date(this.endTime));
                var difference = endTime - nowTime;
                if (difference > 0) {
                    // 将毫秒差换算成天数
                    this.day = Math.floor(difference / (24 * 60 * 60 * 1000));
                    difference = difference -(this.day * 24 * 60 * 60 * 1000);
                    // 换算成小时数
                    this.hours = Math.floor(difference / (60 * 60 * 1000));
                    difference = difference - (this.hours * 60 * 60 * 1000);
                    // 换算成分钟数
                    this.minute = Math.floor(difference / (60*1000));
                    difference = difference - (this.minute * 60 * 1000) ;
                    // 换算成秒数
                    this.second = Math.floor(difference / (1000));
                    difference = difference - (this.second * 1000);
                } else {
                    clearInterval();
                }
            },
            // 全局提示框内容设置
            setMessage(value) {
                clearTimeout(this.message.fnTimeout);
                this.message.flag = true;
                this.message.value = value;
                // this.message.fnTimeout = setTimeout(() => {
                //     this.message = {
                //         flag: false,
                //         value: "",
                //         fnTimeout: ""
                //     }
                // }, 3000)
            },
        },        
        computed: {
            isDay: function () {
                return this.day < 10 ? '0' + this.day : this.day;
            },
            isHour: function () {
                return this.hours < 10 ? '0' + this.hours : this.hours;
            },
            isMinute: function () {
                return this.minute < 10 ? '0' + this.minute : this.minute;
            },
            isSecond: function () {
                return this.second < 10 ? '0' + this.second : this.second;
            },
        },
        watch: {},
    };
</script>

<style scoped>
@import "../assets/style/activity.css";
</style>