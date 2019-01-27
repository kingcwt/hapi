const Common = require('../lib/common');
const dao = require('../mongoose/models/dao');

exports.userLogin = async function(request,h){
	//console.log(request.auth)

	var user = request.auth.credentials;	
	return {"message":"用户登陆成功","statusCode":101,"resource":user}

}

exports.cc = async function(request,h){
	var user = request.auth.credentials;	
	console.log(user)
	return 123;

}

exports.userRegister = async function(request,h){
	let user = request.payload
    let time = Date.now();

	user.scope = ["USER"];
	user.pwd = Common.aesEncrypt(user.pwd,"AiMaGoo2016!@.")+"";
	let result = dao.User.create(user);
	if(result!=null){
		return {'message':'存入数据成功','statusCode':101}
	}else{
		return {'message':'存入数据失败','statusCode':102}
	}
	
}

exports.userInfo = async function(request,reply){
	let user = request.auth.credentials;

	let dongjieAlcResult = await dao.find(request,'user_alc_dongjie',
		{"userId":user._id+'',"info":"alc_jiaoyi"},
		{val:1}
	);
	let dongjieZzResult = await dao.find(request,'user_zz_dongjie',
		{"userId":user._id+'',"info":"zz_jiaoyi"},
		{val:1}
	);
	user.dongjieZz=0;
	user.dongjieAlc=0;
	if(dongjieAlcResult==null){
		reply({"message":"获取信息失败","statusCode":102});
		return;
	}else{
		for(let i= 0; i<dongjieAlcResult.length;i++){
			user.dongjieAlc += (dongjieAlcResult[i].val+dongjieAlcResult[i].shouxufei);
		}	
	};

	if(dongjieZzResult==null){
		reply({"message":"获取信息失败","statusCode":102});
		return;
	}else{
		for(let i= 0; i<dongjieZzResult.length;i++){
			user.dongjieZz += dongjieZzResult[i].val;
		}	
	}

	if(dongjieAlcResult!=null){
		//user.mobile[1]=user.mobile[1]?common.format('yyyy-MM-dd',new Date(parseInt(user.mobile[1]))):'';
		reply({"message":"获取信息成功","statusCode":101,"user":user})
	}else{
		reply({"message":"获取信息失败","statusCode":102})
	}
}

// exports.userUpdate = async function(request,reply){
// 	let user = request.auth.credentials
// 	let userAll = await dao.findById(request,'user',user._id+'')
// 	let payload = request.payload
// 	let time = new Date()

// 	//更改登陆密码
// 	if(payload.password){
// 		payload.password = CryptoJS.AES.encrypt(payload.password,"AiMaGoo2016!@.")+"";
// 		if(payload.oldPwd){
// 			let oldPwd = CryptoJS.AES.decrypt(userAll.password,"AiMaGoo2016!@.").toString(CryptoJS.enc.Utf8)
// 			if(oldPwd!=payload.oldPwd){
// 				reply({'message':'旧登陆密码错误',"statusCode":102})
// 				return
// 			}else{
// 				let pwdResult = await dao.updateOne(request,'user',{_id:user._id+''},{password:payload.password})
// 				if(pwdResult!=null){
// 					reply({'message':'更新登陆密码成功',"statusCode":101})
// 					return
// 				}
// 			}
// 		}else{
// 			reply({'message':'未输入之前登陆密码',"statusCode":102})
// 			return
// 		}
// 	}

// 	//更改电话
// 	if(payload.mobile){
// 		var mobiles = await dao.find(request,"user",{'mobile':payload.mobile})
// 		if(mobiles.length!=0){
// 			reply({"message":"此手机号已注册过，请重新输入手机号！","statusCode":102,"status":false})
// 			return
// 		}else{
// 		  if(!(/^[1][3,4,5,7,8][0-9]{9}$/.test(payload.mobile))){
// 			reply({"message":"手机号码格式不正确，请重新填写！","statusCode":102,"status":false})
// 			return;
// 		  }
// 		}

// 		var sms = await dao.find(request,"smsVerification",{mobile:payload.mobile});
// 		if (sms.length==0) {
// 			reply({"message":"验证码错误，请重新输入","statusCode":102,"status":false}) 
// 	        return
// 		}
// 	    if(!sms[0].code|| payload.smsVerification != sms[0].code){
// 	        reply({"message":"验证码错误，请重新输入","statusCode":102,"status":false}) 
// 	        return
// 	    }
// 	    if (!sms[0].createTime||time.getTime()-sms[0].createTime>=120000) {
// 	        reply({"message":"验证码已超时，请重新发送！","statusCode":102,"status":false});
// 	        return;
// 	    }
// 	    let mobileResult = await dao.updateOne(request,"user",
// 	    	{"_id":user._id+''},
// 	    	{mobile:[payload.mobile,format('yyyy-MM-dd',new Date())]}
// 	    )
// 	    if(mobileResult==null){
// 	    	reply({"message":"更新手机号失败","statusCode":102})
// 	    	return
// 	    }else{
// 	    	reply({"message":"更新手机号成功","statusCode":101})
// 	    }
// 	}

// 	//支付宝修改
// 	if(payload.alipay||payload.alipayImg){
// 		if(payload.oldTPwd){
// 			if(payload.alipay==undefined||payload.alipayImg==undefined){
// 				reply({'message':'信息不完整','statusCode':102});
// 				return;
// 			}
// 			let oldTPwd = CryptoJS.AES.decrypt(userAll.tPwd,"AiMaGoo2016!@.").toString(CryptoJS.enc.Utf8)
// 			if(oldTPwd==payload.oldTPwd){
// 				let alipayResult = await dao.updateOne(request,'user',{_id:user._id+''},
// 					{alipay:payload.alipay,alipayImg:payload.alipayImg},
// 					{upsert:true}
// 				)
// 				if(alipayResult==null){
// 					reply({'message':'更新失败',"statusCode":102})
// 					return
// 				}else{
// 					reply({'message':'更新成功',"statusCode":101})
// 					return
// 				}
// 			}else{
// 				reply({'message':'交易密码不正确',"statusCode":102})
// 				return
// 			}
// 		}else{
// 			reply({'message':'请先设置交易密码',"statusCode":102})
// 			return
// 		}
// 	}

// 	//交易密码修改
// 	if(payload.tPwd){
// 		if(payload.oldTPwd){
// 			let oldTPwd = CryptoJS.AES.decrypt(userAll.tPwd,"AiMaGoo2016!@.").toString(CryptoJS.enc.Utf8)
// 			if(oldTPwd==payload.oldTPwd){
// 				let newTPwd = CryptoJS.AES.encrypt(payload.tPwd,"AiMaGoo2016!@.")+""
// 				let tPwdResult = await dao.updateOne(request,'user',{_id:user._id+''},{'tPwd':newTPwd})
// 				if(tPwdResult==null){
// 					reply({'message':'更新失败',"statusCode":102})
// 					return
// 				}else{
// 					reply({'message':'更新成功',"statusCode":101})
// 					return
// 				}
// 			}else{
// 				reply({'message':'旧交易密码不正确',"statusCode":102})
// 				return
// 			}
// 		}else{
// 			reply({'message':'请先设置交易密码',"statusCode":102})
// 			return
// 		}
// 	}

// 	//银行卡修改
// 	if(payload.bankName){
// 		if(payload.kaihuAddress==''||payload.kaihuzhihang==''||payload.bankCard==''){
// 			reply({'message':'内容未填写完整',"statusCode":102})
// 			return
// 		}else{
// 			if(payload.oldTPwd){
// 				let oldTPwd = CryptoJS.AES.decrypt(userAll.tPwd,"AiMaGoo2016!@.").toString(CryptoJS.enc.Utf8)
// 				if(oldTPwd==payload.oldTPwd){
// 					let bankResult = await dao.updateOne(
// 						request,
// 						'user',
// 						{_id:user._id+''},
// 						{bankCard:[payload.bankName,payload.kaihuAddress,payload.kaihuzhihang,payload.bankCard]}
// 					)
// 					if(bankResult==null){
// 						reply({'message':'更新失败',"statusCode":102})
// 						return
// 					}else{
// 						reply({'message':'更新成功',"statusCode":101})
// 						return
// 					}
// 				}else{
// 					reply({'message':'交易密码不正确',"statusCode":102})
// 					return
// 				}
// 			}else{
// 				reply({'message':'请设置交易密码',"statusCode":102})
// 				return
// 			}
// 		}
// 	}

// 	//身份证绑定
// 	if(payload.realName||payload.shenfenCard){
// 		if(payload.realName&&payload.shenfenCard){
// 			if(payload.shenfenCard.toString().length!=18){
// 				reply({"message":"你的身份证号码不正确，请重新填写","statusCode":102});
// 				return;
// 			}
// 			let shenfenResult = await dao.updateOne(
// 				request,
// 				'user',
// 				{_id:user._id+''},
// 				{realName:payload.realName,shenfenCard:payload.shenfenCard}
// 			)
// 			if(shenfenResult==null){
// 				reply({'message':'绑定失败','statusCode':102})
// 				return
// 			}else{
// 				reply({'message':'绑定成功','statusCode':101})
// 				return
// 			}
// 		}else{
// 			reply({'message':'填写信息不完整','statusCode':102})
// 			return
// 		}
// 	}

// 	if(payload.weChat!=undefined||payload.weChatImg!=undefined){
// 		if(payload.oldTPwd){
// 			if(payload.weChat==undefined||payload.weChatImg==undefined){
// 				reply({'message':'信息不完整','statusCode':102});
// 				return;
// 			}
// 			let result = await dao.updateOne(request,'user',{'_id':user._id+''},
// 				{'weChat':payload.weChat,'weChatImg':payload.weChatImg},
// 				{upsert:true}
// 			);
// 			if(result==null){
// 				reply({'message':'绑定失败','statusCode':102});
// 				return;
// 			}else{
// 				reply({'message':'绑定成功','statusCode':101})
// 				return
// 			}
// 		}else{
// 			reply({'message':'请设置交易密码',"statusCode":102});
// 			return;
// 		}
// 	}

// 	if(request.payload.ltc!=undefined){
// 		await dao.updateOne(request,'user',{'_id':user._id+''},{'ltc':payload.ltc});
// 	}
// 	if(request.payload.btc!=undefined){
// 		await dao.updateOne(request,'user',{'_id':user._id+''},{'ltc':payload.btc});
// 	}
// 	if(request.payload.agcc!=undefined){
// 		await dao.updateOne(request,'user',{'_id':user._id+''},{'ltc':payload.agcc});

// 	}

// 	reply({'message':'保存完成','statusCode':101})
// 	return
// }
