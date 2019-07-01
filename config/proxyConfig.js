module.exports = {
    proxy: {
        '/api': {//将https://sixsix.taoerxue.com.cn映射为/apis
            // 测试代理地址
            target: 'https://sixsix.taoerxue.com.cn',  // 接口域名
            // 正式代理地址
            // target: 'https://newapi.taoerxue.cn',
            changeOrigin: true,  //是否跨域
            pathRewrite: { // 需要rewrite的(代理地址重写)
                '^/api': ''   // 将‘/api’替换为空即 ''
            }              
        }
    }
}