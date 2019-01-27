const Joi = require('joi');
const dao = require('../mongoose/models/dao');
const Common = require('../lib/common.js');
const token = require('../service/validate');

module.exports = [

	{
        method: 'GET',
        path: '/decodeToken',
        handler: (request, h) => {

            const token = request.headers.authorization;
            return request.server.methods.jwtDecode(token);
        },
        options: {
            auth: false
        }
    },

    {
        method: 'GET',
        path: '/app',
        config:{
        	auth:false,
        	  // handler:token.getToken,
            description: '获取token接口',
        },
        handler: async (request, h) => {
            let a = await dao.Admin.find({username:'123'});
            return a;
        }
    },
    
	{
        method:'POST',
        path:'/get/token',
        config:{
            auth:false,
            handler:token.getToken,
            description: '获取token接口',
            tags: ['api'],
            validate: {
                payload: {
                    username: Joi.string().default('ceshi001').description('用户名'),
                    pwd     : Joi.string().default('12345678').description('密码'),
                    url     : Joi.string().required().default('/user/login').description("要访问的路径"),
                    userORadmin:Joi.string().default('user').description('管理员还是用户 admin or user')
                }
            }
        }
    },

	{
		method:'get',
		path:'/a',
		options:{
			auth:false,
            tags: [ 'api'],
			
		},
		handler:async(request,reply)=>{
			return {'message':123}
		}
	},

	{
		method:'post',
		path:'/a',
		options:{
			auth:{
                strategy: 'simple',
                scope: ['USER','ADMIN']
            },
            tags: [ 'api'],
            validate: {
                headers: Joi.object({
                    'authorization': Joi.string().required().description('需要加token请求头')
                }).unknown()
            }
			
		},
		handler:async(request,reply)=>{
			return {'message':123}
		}
	},

	{
	    method: 'GET',
	    path: '/test',
	    handler:function(request,h) {
		    return Common.aesEncrypt('123')
		},
	    options: {
	        tags: [ 'api'],
	        description: 'Test GET',
	    }
	},

	{
	    method:'GET',
	    path:'/hello/{id}',
	    config:{
	        description: 'Update sum',
	        tags: ['api'],
	        validate: {
	            params: {
	                id : Joi.number().description('the id for the todo item')
	            }
	        }
	    },
	    handler:function(request,h) {
	    	console.log(h.request.params)
	    	return {'message':'sunc','statusCode':101}
	    }
	},

	{
		method:'get',
		path:'/api/v1/paintings',
		options:{
			auth:false,
			description:'hahhaha',
			tags:['api']
		},
		handler:async function(request,h){
			let a = await dao.Painting.find({'name':'123'});
			let b = await dao.Painting.countDocuments({'name':'123'});
			if(b!=null){
				return {a,b}
			}
		}
	},

	{
		method:'post',
		path:'/api/v1/paintings',
		handler:(request,h)=>{
			const {name,url,other} = request.payload;
			const painting = new dao.Painting({
				name,
				url,
				other
			});
			return(dao.painting.save())
		}
	}
]