// 第一种方式
// const base = process.env.API_BASE_URL

// 第二种方式
// 测试代理地址
let base = 'https://sixsix.taoerxue.com.cn/taoerxue-app/1'
// 正式代理地址
// let base = 'https://newapi.taoerxue.cn/4'

export  default {
    // 获取所有机构类型
    getAllOrgType: `${base}/org/getAllOrgType`,
    // 获取上传文件token
    getToken: `${base}/file/getToken`,
    // 保存机构
    saveOrg: `${base}/org/saveOrg`,
    // 机构分享
    getOrgDetailInfo: `${base}/org/getDetailInfo`,
    // 课程分享分享
    getCourseDetailInfo: `${base}/course/getDetailInfo`,
    // 资讯分享
    getNewsDetail: `${base}/news/getDetail`,
    // 兑劵登录
    login: `${base}/weChat/getJsapi`,
    // 兑劵
    getJsapi: `${base}/weChat/getJsapi`,
    // 获取验证码
    getVerificationCode: `${base}/mobileCode/sendVerificationCode`,
    // 立即领取
    receive: `${base}/mobileCode/sendVerificationCode`,
}
