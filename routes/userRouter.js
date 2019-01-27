const Joi = require('joi');
const userService = require('../service/userService');

module.exports = [
    {
        method:'get',
        path:'/user/login',
        handler:userService.userLogin,
        config:{
            auth: {
                strategy: 'simple'
            },
            description: '用户登陆接口',
            tags: ['api'],
            validate: {
                headers: Joi.object({
                    'authorization': Joi.string().required().description('需要加token请求头')
                }).unknown()
            }
        }

    },

    {
        method:'get',
        path:'/cc',
        handler:userService.cc,
        options:{
            auth: {
                strategy: 'simple',
                scope: ['USER','ADMIN']
            },
            description: '用户登陆接口',
            tags: ['api'],
            validate: {
                headers: Joi.object({
                    'authorization': Joi.string().required().description('需要加token请求头')
                }).unknown()
            }
        }
    },

    {
        method:'POST',
        path:'/user/register',
        handler:userService.userRegister,
        config:{
            auth:false,
            description: '用户注册',
            tags: ['api'],
            validate: {
                payload:{
                    username        :Joi.string().required().description('用户名'),
                    pwd        :Joi.string().required().description('登录密码'),
                }
            }
        }
    },
    
    // {
    //     method:'get',
    //     path:'/user/info',
    //     handler:userService.userInfo,
    //     config:{
    //         //拦截器
    //         auth:{
    //             strategy: 'bearer',
    //             scope: 'USER'
    //         },
    //         description: '获取用户信息',
    //         notes: '获取用户信息',
    //         tags: ['api'],
    //         validate: {
    //             headers: Joi.object({
    //                 'authorization': Joi.string().required().description('需要加token请求头')
    //             }).unknown()
    //         }
    //     }
    // },

    // {
    //     method:'POST',
    //     path:'/user/update',
    //     handler:userService.userUpdate,
    //     config:{
    //         auth:{
    //             strategy: 'bearer',
    //             scope: ["USER"]
    //         },
    //         description: '用户修改信息',
    //         tags: ['api'],
    //         validate: {
    //             payload: {
    //                 mobile      :   Joi.string().description("电话号码"),
    //                 smsVerification:Joi.number().description('短信验证码'),

    //                 alipay      :   Joi.string().description("支付宝"),
    //                 alipayImg   :   Joi.string().description("支付宝图片路径"),
    //                 weChat      :   Joi.string().description('wechta'),
    //                 weChatImg      :   Joi.string().description('wechta图片路径'),
    //                 password    :   Joi.string().description("登陆密码"),
    //                 oldPwd      :   Joi.string().description("老的登陆密码"),
    //                 tPwd        :   Joi.string().description("交易密码"),
    //                 oldTPwd     :   Joi.string().description("老的交易密码"),

    //                 bankName    :   Joi.string().description("银行名称"),
    //                 kaihuAddress:   Joi.string().description("开户省市"),
    //                 kaihuzhihang:   Joi.string().description("开户支行"),
    //                 bankCard    :   Joi.string().description("银行卡号"),

    //                 realName    :   Joi.string().description("真实姓名"),
    //                 shenfenCard :   Joi.string().description("身份证号"),

    //                 ltc         :   Joi.string().description(' '),
    //                 btc         :   Joi.string().description(' '),
    //                 agcc        :   Joi.string().description(' ')
    
    //             },
    //             headers: Joi.object({
    //                 'authorization': Joi.string().required().description('需要加token请求头')
    //             }).unknown()
    //         }
    //     }
    // },

]
