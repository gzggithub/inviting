<template>
    <div class="pay-success">
        <!-- <div class="success-icon">
            <div></div>
        </div>
        <div class="pay">支付成功</div> -->
        <div class="code-icon">
            <img src="static/images/code_picture@2x.png" alt="">
            <!-- <div></div> -->
        </div>
        <div class="attention">请关注“淘儿学” <br/>后台回复“游泳”获取完整有关游泳信息</div>
        <div class="finish" @click="payFinish">完成</div>
    </div>
</template>

<script>
    import axios from 'axios';
    import router from '@/router/index';

    export default {
        name: 'activity-detail',
        data() {
            return {}
        },
        created: function() {},
        mounted: function() {},
        methods: {
            setPath(id, path) {
                if (path) {
                    router.push({path: path, params: {id: id}})
                }                
            },
            payFinish() {
                console.log("payFinish");
                this.setPath(3, "/")
            },
        },
        watch: {},
        computed: {},       
    };
</script>

<style scoped>
@import "../assets/style/paySuccess.css";
</style>