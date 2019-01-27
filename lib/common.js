const Crypto = require('crypto')
const MD5_SUFFIX = 'asdhhsaghd超gas+——霅溪dkjashkda个风格de!^嘿嘿<ncvb1myo8级73432cxzcs>eq</ncvb马myo873432里cx1zcs>'

module.exports={
	//时间格式化
	format(fmt,data) { //author: meizz
		var o = {
			"M+": data.getMonth() + 1, //月份
			"d+": data.getDate(), //日
			"h+": data.getHours(), //小时
			"m+": data.getMinutes(), //分
			"s+": data.getSeconds(), //秒
			"q+": Math.floor((data.getMonth() + 3) / 3), //季度
			"S": data.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	},	
	md5(str){
		return Crypto.createHash('md5').update(str+MD5_SUFFIX).digest('hex')
	},
	aesEncrypt(data) {
		const cipher = Crypto.createCipher('aes192', MD5_SUFFIX);
		var crypted = cipher.update(data, 'utf8', 'hex');
		crypted += cipher.final('hex');
		return crypted;
	},
	aesDecrypt(encrypted) {
		const decipher = Crypto.createDecipher('aes192', MD5_SUFFIX);
		var decrypted = decipher.update(encrypted, 'hex', 'utf8');
		decrypted += decipher.final('utf8');
		return decrypted;
	},
	checkId(idcard) { 
		
		var area = { 
			11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 
			31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 
			42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 
			53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 
			81: "香港", 82: "澳门", 91: "国外"
		} 
		var retflag = false; 
		var idcard, Y, JYM , ereg; 
		var S, M; 
		var idcard_array = new Array(); 
		idcard_array = idcard.split(""); 
		//地区检验 
		if (area[parseInt(idcard.substr(0, 2))] == null) return false; 
		//身份号码位数及格式检验 
		switch (idcard.length) { 
			case 15: 
				if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) { 
					ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; //测试出生日期的合法性 
				} else { 
					ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; //测试出生日期的合法性 
				} 
				if (ereg.test(idcard)) { 
					return true; 
				} else { 
					return false; 
				} 
			break; 
			case 18: 
				if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) { 
					ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; //闰年出生日期的合法性正则表达式 
				} else { 
					ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; //平年出生日期的合法性正则表达式 
				} 
				if (ereg.test(idcard)) { //测试出生日期的合法性 
					//计算校验位 
					S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 + parseInt(idcard_array[7]) * 1 + parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3; 
					Y = S % 11; 
					M = "F"; 
					JYM = "10X98765432"; 
					M = JYM.substr(Y, 1); //判断校验位 
					if (M == idcard_array[17]) return true; //检测ID的校验位 
					else return false; 
				} else return false; 
			break; 
			default: 
				return false; 
			break; 
		} 
	}
}