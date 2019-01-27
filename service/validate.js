
const https = require('https');
const Boom = require('boom');
const Common = require('../lib/Common');
const dao = require('../mongoose/models/dao');

exports.validateFunc =async function(request, token, callback){
    var tokens = token.split(":");
    if(tokens.length==2){
        collectionName = dao.User;
    }else if(tokens.length==3){
        collectionName = dao.Admin;
    }else{
        throw Boom.unauthorized('未知错误');
    }
    let user = await collectionName.findOne({"username":tokens[0]}).catch(err=>{
        throw err;
    });
    if(user!=null){
        var decoded;
        if (user.scope=="[]") {
            throw Boom.unauthorized('账户被冻结');
            //return {isValid: false,credentials: 123}
        }
        //密码验证
        try {
            var pwd = Common.aesDecrypt(user.pwd).toString();
            decoded = Common.aesDecrypt(tokens[1]).toString().split(":");
            if(pwd!=decoded[1]){
                throw Boom.unauthorized('密码错误');
                //return {isValid: false,credentials: 123}
            }
        }catch (e){
            throw Boom.unauthorized('密码错误');
            //return {isValid: false,credentials: 123}
        }

        //对比访问的url是否与token中的url相等
        if(decoded[0]!=request.url.path){
            throw Boom.unauthorized('访问路径不正确');
            //return {isValid: false,credentials: 123}
        }

        //查询之前是否访问过
        let access_record = await dao.AccessRecord.findOne({"guid":decoded[2]});
        if(access_record){
            throw Boom.unauthorized('token失效,重新获取');
            //return {isValid: false,credentials: 123}
        }else{
            dao.AccessRecord.create({'guid':decoded[2]});
        }

        return {isValid: true,credentials: user};
    }else{
        throw Boom.unauthorized('用户名不对');
        //return {isValid: false,credentials: 123};
    }   
}

exports.getToken = function(request,reply){
    var time = Date.now();
    var admin = "";
    if(request.payload.userORadmin == "admin"){
        admin = ":admin"
    }
    var token = "bearer "+request.payload.username+":"+Common.aesEncrypt(request.payload.url+':'+request.payload.pwd+":"+Date.now()).toString()+admin;
    return {"toekn":token};
}

// "bearer "+'123'+":"+sgfghdhhgfyjrfjhr