
// 执行主入口
$(function () {

    $.ajaxSetup({
        timeout: 10000,
        cache:false,
        error: function (xhr, status) {
            // error 无网络
            // abort 终止
            // timeout 超时
            console.log(status);

            close();

            if (status === "error") {
                alert("Network unreachable!");
            }
            else if (status === "abort") {
                // console.log("手动终止");
            }
            else if (status === "timeout") {
                alert("Network timeout!");
                // 刷新网页
                setTimeout(function () {
                    location.reload();
                }, 500);

            }
        }
    });


    // init
    setTimeout(function () {
         getStatus(1);
    }, 5000);

    // nav
    $("#tab-1").click(function () {
        tabNav(1);
        statusRe(1);
//      window.clearInterval(checkRefresh);   
    });
    $("#tab-2").click(function () {
        tabNav(2);
        statusRe(2);
//       window.clearInterval(statusRefresh);   
    });
    $("#tab-3").click(function () {
        tabNav(3);
        statusRe(3);
         window.clearInterval(statusRefresh);   
//       window.clearInterval(checkRefresh);   
    });
    $("#tab-4").click(function () {
        tabNav(4);
         window.clearInterval(statusRefresh);   
//       window.clearInterval(checkRefresh);   
    });
    $("#tab-5").click(function () {
        tabNav(5);
        getStatus(5);
         window.clearInterval(statusRefresh);   
//       window.clearInterval(checkRefresh);   
    });
    $("#tab-6").click(function () {
        tabNav(6);
         window.clearInterval(statusRefresh);   
    });

    // power
    $("#switch-power").click(function () {
        this.checked = !this.checked;
        req.submit(CMD.getHex(CMD.Power, !this.checked));
    });
    // beep
    $("#switch-beep").click(function () {
        this.checked = !this.checked;

        req.submit(CMD.getHex(CMD.Beep, !this.checked));
    });
    // reset
    $("#reset").click(function () {

        // 打开面板
        showAlert(function () {

            req.submit(CMD.getHex(CMD.Restore));
        });
    });
    // reboot
    $("#reboot").click(function () {

        // 打开面板
        showAlert(function () {

            req.submit(CMD.getHex(CMD.Reboot));
        });
    });
    // connection status
    $("#conn-status").click(function () {

        getStatus(1);
    });

    // page 2
    for (var i = 1; i <= 8; i++) {

        // INOUT
        for (var j = 1; j <= 8; j++) {

            $("#out-" + i + "-in-" + j).click(function () {
                var inIndex = parseInt(this.id.substr(-1, 1)),
                    outIndex = parseInt(this.id.substr(4, 1));
                req.submit(CMD.getHex(CMD.INOUT, false, inIndex, outIndex));
            });
        }

        // ARC
        $("#switch-arc-" + i).click(function () {
            this.checked = !this.checked;

            var index = parseInt(this.id.substr(-1, 1));
            req.submit(CMD.getHex(CMD.ARC, !this.checked, index));
        });

        // Audio
        $("#select-matrix-" + i).change(function () {

            var outIndex = parseInt(this.id.substr(-1, 1)),
                selectIndex = this.selectedIndex + 1;
            req.submit(CMD.getHex(CMD.Audio, false, outIndex, selectIndex));
        });

        // page 3
        $("#select-audio-" + i).change(function () {

            var outIndex = parseInt(this.id.substr(-1, 1)),
                selectIndex = this.selectedIndex + 1;
            req.submit(CMD.getHex(CMD.AudioIn, false, outIndex, selectIndex));
        });
        // delay
        editDelay[i - 1].addEditListener(function (id, value) {

            var index = parseInt(id.substr(-1, 1));
            var delay = parseInt(value);

            req.submit(CMD.getHex(CMD.Delay, false, index, delay));
        });
        // vol
        sliderVol[i - 1].addSliderListener(function (id, value) {

            var vol = Math.round(volMap[value]);
            var index = parseInt(id.substr(-1, 1));
            req.submit(CMD.getHex(CMD.Vol, false, vol, index));
        });
    }

    // EDID
    $("#edid-set").click(function () {

        // 获取EDID索引     从0开始， 不用加1
        var edidIndex = $("#select-edid")[0].selectedIndex + 1;
        // 获取输入索引
        var inIndex = $("#select-edid-in")[0].selectedIndex + 1;

        if (inIndex > 8) {
            req.submit(CMD.getHex(CMD.EDIDAll, false, edidIndex), {delay: 800});
        }
        else {
            req.submit(CMD.getHex(CMD.EDID, false, edidIndex, inIndex), {delay: 800});
        }
    });
    // Copy
    $("#copy-set").click(function () {

        // 获取EDID索引
        var copyIndex = $("#select-copy")[0].selectedIndex + 1;
        // 获取输入索引
        var inIndex = $("#select-copy-in")[0].selectedIndex + 1;

        if (inIndex > 8) {
            req.submit(CMD.getHex(CMD.EDIDCopyAll, false, copyIndex));
        }
        else {
            req.submit(CMD.getHex(CMD.EDIDCopy, false, copyIndex, inIndex));
        }
    });
    // edid status
    $("#edid-status").click(function () {

        getStatus(4);
    });

    // Network
    $("#switch-dhcp").click(function () {
        this.checked = !this.checked;
        if(!this.checked){
          //req.submit(CMD.getHex(CMD.DHCP, !this.checked));
          DHCPSetting(true);
          editBoxDisable(true);
        }else{
          DHCPSetting(false);
          editBoxDisable(false);
        }
    });
    $("#net-status").click(function () {

        clearLog();
        /**
         * 查询 HDCP IP GateWay
         */
        req.submit(CMD.getHex(CMD.GetDHCP));
    });

    // Clear
    $("#clear").click(function () {

        clearLog();
    });

    // IP Subnet Gateway
    $("#save-changes").click(function () {

        if($('#switch-dhcp').is(':checked')){
           req.submit(CMD.getHex(CMD.DHCP, true)); 
        }else{
            // 获取IP
            var ip = new EditBox("edit-box-ip").getIP();
            if (!ip) {
                alert("Invalid IP address!");
                return;
            }else{
                var sip = arrToString(ip);
            }
            
            var subnet = new EditBox("edit-box-subnet").getIP();
            if (!subnet) {
                alert("Invalid subnet address!");
                return;
            }else{
                var ssubnet = arrToString(subnet);
            }

            var gate = new EditBox("edit-box-gate").getIP();
            if (!gate) {
                alert("Invalid gate address!");
                return;
            }else{
                var sgate = arrToString(gate);
            }

        //    var mac = new EditBox("edit-box-mac").getMAC();
         //     if (mac) {
          //       var smac = arrToString(mac);
            //  }

            showLoader("wait...");

             //if(currentMac != smac){
               //console.log(CMD.getHex(CMD.Mac, true, mac[0] * 0x100 + mac[1], mac[2] * 0x100 + mac[3], mac[4] * 0x100 + mac[5]));
             //}

            // if(currentGateway != sgate){
                setTimeout(function(){
                    req.submit(CMD.getHex(CMD.Gate, true, gate[0] * 0x100 + gate[1], gate[2] * 0x100 + gate[3]));
                },1200);
            // }
            // if(currentSubnet != ssubnet){
                setTimeout(function(){
                    req.submit(CMD.getHex(CMD.Subnet, true, subnet[0] * 0x100 + subnet[1], subnet[2] * 0x100 + subnet[3]));
                },2200);
            // }

            // if(currentIp != sip){
                setTimeout(function(){
                    req.submit(CMD.getHex(CMD.IP, true, ip[0] * 0x100 + ip[1], ip[2] * 0x100 + ip[3]));
                },3200);
            // }

            setTimeout(function(){
                req.submit(CMD.getHex(CMD.DHCP, false));
            },4500);

            setTimeout(function(){
                var ssip ="";
                ssip=(ip[0]).toString()+'.'+(ip[1]).toString()+'.'+(ip[2]).toString()+'.'+ip[3].toString()
                top.location.href = 'http://' + ssip
            },8000);

        }
    });


    // open upgrade file
    $("#file-upgrade").on("change", function () {

        if (this.files[0] == undefined) {
            $("#file-upgrade + i").text(fileName);
            return;
        }
        fileName = this.files[0].name;
        datalenth = this.files[0].size;
        // 获取文件名并显示
        $("#file-upgrade + i").text(fileName);

        if (window.FileReader) {

            // 创建文件读取对象
            var reader = new FileReader();

            // 文件读取成功后回调
            reader.onload = function (readEvt) {


                var bytes = new Uint8Array(readEvt.target.result);

				upgradePackage = bytes;
			}
			// 以二进制读取文件
			reader.readAsArrayBuffer(this.files[0]);
		}

        else {

            alert("Don't support this feature!\nPlease update your browser to IE 10 and above, or use other higher versions of the non IE browser to continue.");
        }
    });
    // Upgrade
    $("#upgrade").click(function () {

        // 判断是否加载文件
        if (!upgradePackage) {
            alert("No File!!!");
            return;
        }
        let xt;
        if(fileName.indexOf('MCU_MAIN')>-1){
        	xt='firmware_mcu.bin'
        }else if(fileName.indexOf('SIL_L')>-1){
        	xt='firmware_9396.bin'
        }
		  var xhr;
		  
          xhr = new XMLHttpRequest();
          
          var Url='/cgi-bin/upload?/upgrade/'+xt;
          
          xhr.open("post", Url, true);
          
          xhr.onload=function(){
          	
          }
          showLoader1("Upgrading...");
          updateProgress(0);
         setTimeout(function(){
         	xhr.send(upgradePackage);
         	setTimeout(function(){
	         	if(xt=='firmware_mcu.bin'){
	         		
	         		req.submit1('Upgrade mcu firmware!');
	         		
	         	}else if(xt=='firmware_9396.bin'){
	         		
	         		req.submit1('Upgrade 9396 firmware!');
	
	         	}
         	},5000)
         },500)

    });
    statusRe(1);
// var checkRefresh=window.setInterval(function(){
//  		checkActive()
//  },500)
});

/**
 * 一秒钟刷新status
 *
 * 
 */
var timedRefresh;
var statusRefresh;
function statusRe(index){
	var times;
	if(index==1){
		times=5000
		showLoader("Get status...",15000);
	}else if(index==2){
		times=3000
		showLoader("Get status...",15000);
	}
	window.clearInterval(statusRefresh)
    timedRefresh =$('#content-'+index).css('display');
     console.log(timedRefresh)
     showLoader("Get status...",15000);
    if(timedRefresh=='block'){//首页一秒钟请求状态
    	 statusRefresh= window.setInterval(function(){
    		
    	 	getStatus(index);
//  	 	checkActive()
    	},times)
    }
}

function statusRe1(index){
    window.clearInterval(statusRefresh)
    timedRefresh =$('#content-'+index).css('display');
     console.log(timedRefresh)
//   showLoader("Get status...",8000);
    if(timedRefresh=='block'){//首页一秒钟请求状态
         statusRefresh= window.setInterval(function(){
            
            getStatus(index);
        },5000)
    }
}
/**
 * 针对13个字节的通用指令，回调函数
 * @param req
 * @param res
 */
function response(req, res) {

    /**
     * 当一条指令，或一系列指令（查询状态）执行完成之后，
     * 清空当前发送的指令，currentCMD = null
     * 防止操作完成之后，还在继续处理查询的结果
     */
    if (req.cmd === null || res == "" || !/hex/.test(res)) return;

    // 拆分结果
    var resArr = res.substring(4, 42).split(",");
    var cmdArr = req.cmd.split(",");

    console.log('resArr ' + resArr)
    console.log('cmdArr ' + cmdArr)

    // 转换  字符串转十六进制
    for (var i = 0; i < resArr.length; i++) {

        resArr[i] = parseInt(resArr[i], 16);
    }
    for (var i = 0; i < cmdArr.length; i++) {

        cmdArr[i] = parseInt(cmdArr[i], 16);
    }

    var cmdType = cmdArr[CMD.cmdType],
        cmdIndex = cmdArr[CMD.cmdIndex],
        cmdPara1 = cmdArr[CMD.cmdPara1],
        cmdPara2 = cmdArr[CMD.cmdPara2];
    var resType = resArr[CMD.cmdType],
        resIndex = resArr[CMD.cmdIndex],
        resPara1 = resArr[CMD.cmdPara1],
        resPara2 = resArr[CMD.cmdPara2];

    console.log('cmdType '+ cmdType +' cmdIndex '+cmdIndex+' cmdPara1 '+cmdPara1+' cmdPara2 '+cmdPara2)
    console.log('resType '+ resType +' resIndex '+resIndex+' resPara1 '+resPara1+' resPara2 '+resPara2)

    // 判断是否为PowerOFF状态
    if (resType === 0x08 && resIndex === 0x0c) {

        /**
         * 如果接收到的结果是 PowerOFF 状态，
         * 则判断是否是Power查询指令。
         * 如果是Power查询指令，则正常往下指令；
         * 如果当前发送的是其他指令，但接收到的却是这条指令，
         * 则说明Power一定处于关闭状态
         */
        if (resType !== cmdType && resIndex !== cmdIndex) {

            if (resPara1 === 0xf0) {
                alert("Power Off !");
            }
            return;
        }
    }

    // 第一页状态查询入口 --------- start ----------------
    // Power Status
    if (cmdType === 0x08 && cmdIndex === 0x0c) {

        if (resType === cmdType && resIndex === cmdIndex) {

            req.cmd = null;
            req.consuming = false;



            if (resPara1 === 0x0f) {

                /**
                 * 能来到这里，说明查询指令生效（启动，重启等耗时操作完成），
                 * 可以继续往下查询，关闭等待面板
                 */
                // ON
                switchSetting(CMD.Power, true);

                // continue ?
                req.submit(CMD.getHex(CMD.GetBeep));
            }
            else if (resPara1 === 0xf0) {
                // OFF
                /**
                 * 来到这里，说明设备处于关闭状态，则没必要继续查询了
                 * 提示用户电源未打开
                 */
                switchSetting(CMD.Power, false);

                // 提示用户
                alert("Power OFF!");
                close();
            }
        }
        else {
            /**
             * 来到这里，说明查询操作未能正确执行（可是设备正处于开机、重启等耗时操作）
             * 每隔一段时间再次进行查询，检查耗时操作是否完成
             */
            if (req.consuming) {
                req.query({
                    maxCount: 40,
                    delay: 1000
                });
            }
            else {
                req.query();
            }

        }
        return;
    }
    // Beep Status
    if (cmdType === 0x01 && cmdIndex === 0x0b) {

        if (resType === cmdType && resIndex === cmdIndex) {

            req.cmd = null;
            // success
            if (resPara2 === 0x00) {
                // ON
                switchSetting(CMD.Beep, true);
            }
            else if (resPara2 === 0xff) {
                // OFF
                switchSetting(CMD.Beep, false);
            }

            // continue ?
           close();
        }
        else {
            // invalid
            req.query();
        }
        return;
    }
    // Get SI
    if (cmdType === 0x01 && cmdIndex === 0x14) {

        if (resType === cmdType && resIndex === cmdIndex) {
            // success  index = resArr[4]   flag = resArr[6]
            req.cmd = null;
//          showLoader("Get status...");
            connectionStatus("in", 1, resArr[4] === 0x00);
            connectionStatus("in", 2, resArr[5] === 0x00);
            connectionStatus("in", 3, resArr[6] === 0x00);
            connectionStatus("in", 4, resArr[7] === 0x00);
            connectionStatus("in", 5, resArr[8] === 0x00);
            connectionStatus("in", 6, resArr[9] === 0x00);
            connectionStatus("in", 7, resArr[10] === 0x00);
            connectionStatus("in", 8, resArr[11] === 0x00);
            req.submit(CMD.getHex(CMD.GetSO, false, 1));

            }else {
            // invalid
            req.query();
        }
        return;
    }
    // Get SO
    if (cmdType === 0x01 && cmdIndex === 0x15) {

        if (resType === cmdType && resIndex === cmdIndex) {
            // success      flag = resArr[6]
            req.cmd = null;
            connectionStatus("out", 1, resArr[4] === 0x00);
            connectionStatus("out", 2, resArr[5] === 0x00);
            connectionStatus("out", 3, resArr[6] === 0x00);
            connectionStatus("out", 4, resArr[7] === 0x00);
            connectionStatus("out", 5, resArr[8] === 0x00);
            connectionStatus("out", 6, resArr[9] === 0x00);
            connectionStatus("out", 7, resArr[10] === 0x00);
            connectionStatus("out", 8, resArr[11] === 0x00);
            req.submit(CMD.getHex(CMD.GetPower));
        }
        else {
            // invalid
            req.query();
        }
        return;
    }
    // 第一页状态查询出口  -------- end ------------------

    // Power
    if (cmdType === 0x08 && cmdIndex === 0x0b) {

        // 判断是否有效
        if (resType === cmdType && resIndex === cmdIndex && resPara1 === 0x00) {

            req.cmd = null;
            // ON
            if (cmdPara1 === 0x0f) {

                req.consuming = true;
                showLoader("Initializing...");

                // 获取该界面状态  30s后尝试
                setTimeout(function () {
                    req.submit(CMD.getHex(CMD.GetPower));
                }, 30000);
            }
            // OFF
            else if (cmdPara1 === 0xf0) {

                switchSetting(CMD.Power, false);
                connectionStatus("in", 1, resArr[4] === 0xff);
                connectionStatus("in", 2, resArr[5] === 0xff);
                connectionStatus("in", 3, resArr[6] === 0xff);
                connectionStatus("in", 4, resArr[7] === 0xff);
                connectionStatus("in", 5, resArr[8] === 0xff);
                connectionStatus("in", 6, resArr[9] === 0xff);
                connectionStatus("in", 7, resArr[10] === 0xff);
                connectionStatus("in", 8, resArr[11] === 0xff);
                connectionStatus("out", 1, resArr[4] === 0xff);
                connectionStatus("out", 2, resArr[5] === 0xff);
                connectionStatus("out", 3, resArr[6] === 0xff);
                connectionStatus("out", 4, resArr[7] === 0xff);
                connectionStatus("out", 5, resArr[8] === 0xff);
                connectionStatus("out", 6, resArr[9] === 0xff);
                connectionStatus("out", 7, resArr[10] === 0xff);
                connectionStatus("out", 8, resArr[11] === 0xff);
            }
        }
        // 无效
        else {
            req.query();
        }
        return;
    }
    // Beep
    if (cmdType === 0x06 && cmdIndex === 0x01) {

        if (resType === cmdType && resIndex === cmdIndex && resPara1 === 0x00) {
            // success

            req.cmd = null;

            if (cmdPara1 === 0x0f) {
                // ON
                switchSetting(CMD.Beep, true);
            }
            else if (cmdPara1 === 0xf0) {
                // OFF
                switchSetting(CMD.Beep, false);
            }
        }
        else {
            // invalid
            req.query();
        }
        return;
    }
    // 重启
    if (cmdType === 0x08 && cmdIndex === 0x0d) {

        if (resType === cmdType && resIndex === cmdIndex) {
            // success
            req.cmd = null;
            req.consuming = true;
            connectionStatus("in", 1, resArr[4] === 0xff);
            connectionStatus("in", 2, resArr[5] === 0xff);
            connectionStatus("in", 3, resArr[6] === 0xff);
            connectionStatus("in", 4, resArr[7] === 0xff);
            connectionStatus("in", 5, resArr[8] === 0xff);
            connectionStatus("in", 6, resArr[9] === 0xff);
            connectionStatus("in", 7, resArr[10] === 0xff);
            connectionStatus("in", 8, resArr[11] === 0xff);
            connectionStatus("out", 1, resArr[4] === 0xff);
            connectionStatus("out", 2, resArr[5] === 0xff);
            connectionStatus("out", 3, resArr[6] === 0xff);
            connectionStatus("out", 4, resArr[7] === 0xff);
            connectionStatus("out", 5, resArr[8] === 0xff);
            connectionStatus("out", 6, resArr[9] === 0xff);
            connectionStatus("out", 7, resArr[10] === 0xff);
            connectionStatus("out", 8, resArr[11] === 0xff);
            showLoader("Rebooting...");

            // 10s 后开始获取状态
            setTimeout(function () {
                req.submit(CMD.getHex(CMD.GetPower));
            }, 30000);

        }
        else {
            // invalid
            req.query();
        }
        return;
    }
    // 重置
    if (cmdType === 0x08 && cmdIndex === 0x0a) {

        /**
          * Problem with reset command:
          * After the instruction is sent, what is obtained is the result of the execution of the previous instruction;
          * It is necessary to send the command again to receive the result of the command execution correctly.
          *
          * Solution:
          * Open the waiting panel when sending for the first time,
          * The command sent for the first time is definitely invalid (but it may actually be valid), so send the confirmation again after 1s
          * After the second sending, if the correct result is returned, it means that the command is executed successfully, and the query status information starts
         */

        req.consuming = true;
        connectionStatus("in", 1, resArr[4] === 0xff);
        connectionStatus("in", 2, resArr[5] === 0xff);
        connectionStatus("in", 3, resArr[6] === 0xff);
        connectionStatus("in", 4, resArr[7] === 0xff);
        connectionStatus("in", 5, resArr[8] === 0xff);
        connectionStatus("in", 6, resArr[9] === 0xff);
        connectionStatus("in", 7, resArr[10] === 0xff);
        connectionStatus("in", 8, resArr[11] === 0xff);
        connectionStatus("out", 1, resArr[4] === 0xff);
        connectionStatus("out", 2, resArr[5] === 0xff);
        connectionStatus("out", 3, resArr[6] === 0xff);
        connectionStatus("out", 4, resArr[7] === 0xff);
        connectionStatus("out", 5, resArr[8] === 0xff);
        connectionStatus("out", 6, resArr[9] === 0xff);
        connectionStatus("out", 7, resArr[10] === 0xff);
        connectionStatus("out", 8, resArr[11] === 0xff);
        showLoader("Factory Resetting...");

        if (resType === cmdType && resIndex === cmdIndex) {
            // success
            req.cmd = null;

            // 开始尝试 获取状态
            setTimeout(function () {
                req.submit(CMD.getHex(CMD.GetPower));
            }, 24000);
        }
        else {
            /**
              * Here it is assumed that the first command has taken effect
              * Wait 10s for the device to reset, then confirm again
             */
            // invalid
            req.query({
                delay: 10000
            });
        }
        return;
    }


    // The second page status query entry ---------- start ----------------
    // Get OUT
    if (cmdType === 0x02 && cmdIndex === 0x11) {

        if (resType === cmdType && resIndex === cmdIndex) {
            // success  inIndex: resArr[6]    outIndex: cmdArr[4]
            req.cmd = null;

//          showLoader("Get status...");
            channelSetting(resArr[4], 1);
            channelSetting(resArr[5], 2);
            channelSetting(resArr[6], 3);
            channelSetting(resArr[7], 4);
            channelSetting(resArr[8], 5);
            channelSetting(resArr[9], 6);
            channelSetting(resArr[10], 7);
            channelSetting(resArr[11], 8);
            
            // req.submit(CMD.getHex(CMD.GetARC, false, 1), {delay: 100});
            close();
        }
        else {
            // invalid
            req.query();
        }
        return;
    }
    // Get ARC
    if (cmdType === 0x10 && cmdIndex === 0x02) {

        if (resType === cmdType && resIndex === cmdIndex && resPara2 === cmdPara2) {
            // resArr[4]: 0x00, 0xff    resArr[6]: index
            req.cmd = null;

            // update UI
            switchSetting(CMD.ARC, resPara1 === 0x0f, resPara2);

            // continue ?
            if (resPara2 < 8) {
                req.submit(CMD.getHex(CMD.GetARC, false, resPara2 + 1), {delay: 200});
            }
            else {
                req.submit(CMD.getHex(CMD.GetAudio, false, 1), {delay: 200});
            }
        }
        else {
            // invalid
            req.query();
        }
        return;
    }
    // Get Audio
    if (cmdType === 0x08 && cmdIndex === 0x43) {

        if (resType === cmdType && resIndex === cmdIndex && resPara1 === cmdPara1) {

            req.cmd = null;

            selectSetting(CMD.Audio, resPara1, resPara2);

            // continue ?
            if (resPara1 < 8) {
                req.submit(CMD.getHex(CMD.GetAudio, false, resPara1 + 1), {delay: 200});
            }else{
                close();
            }
        }
        else {
            // invalid
            req.query();
        }
        return;
    }
    // 第二页状态查询出口 ---------- end ------------------

    // ARC
    if (cmdType === 0x10 && cmdIndex === 0x01) {

        if (resType === cmdType && resIndex === cmdIndex && resPara1 === 0x00 && resPara2 === cmdPara2) {

            this.cmd = null;
            // update UI
            switchSetting(CMD.ARC, cmdPara1 === 0x0f, cmdPara2);
        }
        else {
            // invalid
            req.query();
        }
        return;
    }
    // INOUT
    if (cmdType === 0x02 && cmdIndex === 0x03) {

        if (resType === cmdType && resIndex === cmdIndex && resPara1 === 0x00 && resPara2 === cmdPara2) {

            req.cmd = null;

            channelSetting(cmdPara1, cmdPara2);
        }
        else {
            req.query();
        }
        return;
    }
    // Audio
    if (cmdType === 0x08 && cmdIndex === 0x42) {

        if (resType === cmdType && resIndex === cmdIndex && resPara1 === 0x00 && resPara2 === cmdPara2) {

            req.cmd = null;
            // modified, removed comment from selectsetting
            // selectSetting(CMD.Audio, cmdPara1, cmdPara2);
        }
        else {
            req.query();
        }
        return;
    }


    // 第三页状态查询 ---------------- start -----------------
    // Audio Status
    if (cmdType === 0x08 && cmdIndex === 0x45) {

        if (resType === cmdType && resIndex === cmdIndex && resPara1 === cmdPara1) {

            req.cmd = null;

            showLoader("Get status...");

            selectSetting(CMD.AudioIn, resPara1, resPara2);

            // continue ?
            if (resPara1 < 8) {

                req.submit(CMD.getHex(CMD.GetAudioIn, false, resPara1 + 1));
            }
            else {
                req.submit(CMD.getHex(CMD.GetDelay, false, 1));
            }
        }
        else {
            req.query();
        }
        return;
    }
    // Delay
    if (cmdType === 0x08 && cmdIndex === 0x41) {

        if (resType === cmdType && resIndex === cmdIndex && resPara1 === cmdPara1) {

            req.cmd = null;

            editDelay[resPara1 - 1].setValue(resPara2 * 0x100 + resArr[CMD.cmdPara2 + 1]);

            // continue ?
            if (resPara1 < 8) {

                req.submit(CMD.getHex(CMD.GetDelay, false, resPara1 + 1));
            }
            else {
                req.submit(CMD.getHex(CMD.GetVol, false, 1));
            }
        }
        else {
            req.query();
        }
        return;
    }
    // Vol
    if (cmdType === 0x17 && cmdIndex === 0x18) {

        if (resType === cmdType && resIndex === cmdIndex && resPara2 === cmdPara2) {

            req.cmd = null;

            var vol = Math.round(volMap.indexOf(resPara1));
            sliderVol[resPara2 - 1].setValue(vol);

            // continue ?
            if (resPara2 < 8) {

                req.submit(CMD.getHex(CMD.GetVol, false, resPara2 + 1));
            }else{
                close();
            }
        }
        else {
            req.query();
        }
        return;
    }
    // 第三页状态查询出口 ---------- end ------------------

    // Audio
    if (cmdType === 0x08 && cmdIndex === 0x44) {

        if (resType === cmdType && resIndex === cmdIndex && resPara1 === 0x00) {

            req.cmd = null;
        }
        else {
            req.query();
        }
    }
    // Delay
    if (cmdType === 0x08 && cmdIndex === 0x40) {

        if (resType === cmdType && resIndex === cmdIndex && resPara1 === 0x00) {

            req.cmd = null;
        }
        else {
            req.query();
        }
    }
    // Vol
    if (cmdType === 0x17 && cmdIndex === 0x17) {

        if (resType === cmdType && resIndex === cmdIndex && resPara1 === 0x00) {

            req.cmd = null;
        }
        else {
            req.query();
        }
    }


    // 第四页状态查询 ---------------- start -----------------
    // EDID Status
    if (cmdType === 0x01 && cmdIndex === 0x1c) {

        /**
         * 第4个字节：输入索引， 第6个字节；EDID索引 0...
         */
        if (resType === cmdType && resIndex === cmdIndex) {

            req.cmd = null;

            if (resPara2 > 18 && resPara2 <= 18 + 8) {
                // Copy
                EDIDPrint(resPara2 - 18, resPara1, true);
            } else {

                EDIDPrint(resArr[4]-1,1);
                EDIDPrint(resArr[5]-1,2);
                EDIDPrint(resArr[6]-1,3);
                EDIDPrint(resArr[7]-1,4);
                EDIDPrint(resArr[8]-1,5);
                EDIDPrint(resArr[9]-1,6);
                EDIDPrint(resArr[10]-1,7);
                EDIDPrint(resArr[11]-1,8);
            }


        
        }
        else {
            req.query();
        }
        return;
    }
    // ----------------------- end -------------------------

    // EDID
    if (cmdType === 0x03 && cmdIndex === 02) {

        /**
         * 第4个字节：EDID索引，01...   第6个字节：输入索引
         * 指令执行成功，第4个字节清零
         */
        if (resType === cmdType && resIndex === cmdIndex && resPara1 === 0x00 && resPara2 === cmdPara2) {

            req.cmd = null;

            EDIDPrint(cmdPara1 - 1, cmdPara2);
        }
        else {
            req.query();
        }
        return;
    }
    // EDID ALL
    if (cmdType === 0x03 && cmdIndex === 0x01) {

        /**
         * 第4个字节是：EDID索引，指令执行成功该字节清零
         * 通过发送指令的第4个字节判断EDID的索引
         */
        if (resType === cmdType && resIndex === cmdIndex && resPara1 === 0x00) {

            req.cmd = null;

            EDIDPrint(cmdPara1 - 1, 0);
        }
        else {
            req.query();
        }
        return;
    }
    // EDID copy
    if (cmdType === 0x03 && cmdIndex === 0x04) {

        /**
         * 第4个字节：COPY索引， 第6个字节：输入索引
         * 返回：
         * 第4个字节：表示指令执行结果；0f：失败
         * 第6个字节：输入索引
         */
        if (resType === cmdType && resIndex === cmdIndex && resPara2 === cmdPara2) {

            req.cmd = null;

            if (resPara1 === 0x0f) {

                alert("Can't find the valid data!");
            }
            else if (resPara1 === 0x00) {
                // 显示状态
                EDIDPrint(cmdPara1, cmdPara2, true);
            }
        }
        else {
            req.query();
        }
        return;
    }
    // EDID copy ALL
    if (cmdType === 0x03 && cmdIndex === 0x03) {

        /**
         * 第4个字节：COPY索引
         * 返回：
         * 第4个字节：表示指令执行结果；0f：失败
         */
        if (resType === cmdType && resIndex === cmdIndex) {

            req.cmd = null;

            if (resPara1 === 0x0f) {

                alert("Can't find the valid data!");
            }
            else if (resPara1 === 0x00) {
                // 显示状态
                EDIDPrint(cmdPara1, cmdPara2, true);
            }
        }
        else {
            req.query();
        }
        return;
    }

    // 网络配置信息查询 ------------- start -----------
    // Get DHCP
    if (cmdType === 0x22 && cmdIndex === 0x0b) {
        showLoader("wait...");
        if (resType === cmdType && resIndex === cmdIndex) {

            req.cmd = null;

            if (resPara1 === 0x0f) {
                // ON
                DHCPSetting(true);
                // 禁用 IP
                editBoxDisable(true);

                printLog("-> DHCP ON\n");
            }
            else if (resPara1 === 0xf0) {
                // OFF
                DHCPSetting(false);
                // 启用 IP
                editBoxDisable(false);

                printLog("-> DHCP OFF\n");
            }
            // continue ?
            req.submit(CMD.getHex(CMD.GetIP));
        }
        else {
            req.query();
        }

        return;
    }
    // Get IP/Subnet/Gate
    if (cmdType === 0x22 && (cmdIndex === 0x0f || cmdIndex === 0x72 || cmdIndex === 0x0d || cmdIndex === 0x14)) {

        if (resType === cmdType && resIndex === cmdIndex) {

            var resPara1_2 = resArr[CMD.cmdPara1 + 1],
                resPara2_2 = resArr[CMD.cmdPara2 + 1];

            req.cmd = null;

            var ip = resPara1.toString() + "." + resPara1_2.toString() + "." + resPara2.toString() + "." + resPara2_2.toString();

            if (cmdIndex === 0x0f) {

                currentIp = resArr[4].toString(16).replace(/^(\w)$/, "0$1") + "," + resArr[5].toString(16).replace(/^(\w)$/, "0$1") + "," + resArr[6].toString(16).replace(/^(\w)$/, "0$1") + "," + resArr[7].toString(16).replace(/^(\w)$/, "0$1");

                $("#ip-1").val(resArr[4].toString());
                $("#ip-2").val(resArr[5].toString());
                $("#ip-3").val(resArr[6].toString());
                $("#ip-4").val(resArr[7].toString()); 

                ip = "-> IP: " + ip + "\n";
                // continue
                req.submit(CMD.getHex(CMD.GetSubnet));
            }else if (cmdIndex === 0x72) {

                currentSubnet = resArr[4].toString(16).replace(/^(\w)$/, "0$1") + "," + resArr[5].toString(16).replace(/^(\w)$/, "0$1") + "," + resArr[6].toString(16).replace(/^(\w)$/, "0$1") + "," + resArr[7].toString(16).replace(/^(\w)$/, "0$1");

                $("#subnet-1").val(resArr[4].toString());
                $("#subnet-2").val(resArr[5].toString());
                $("#subnet-3").val(resArr[6].toString());
                $("#subnet-4").val(resArr[7].toString());  

                ip = "-> Subnet: " + ip + "\n";
                // continue
                req.submit(CMD.getHex(CMD.GetGate));
            }else if (cmdIndex === 0x0d) {
                currentGateway = resArr[4].toString(16).replace(/^(\w)$/, "0$1") + "," + resArr[5].toString(16).replace(/^(\w)$/, "0$1") + "," + resArr[6].toString(16).replace(/^(\w)$/, "0$1") + "," + resArr[7].toString(16).replace(/^(\w)$/, "0$1"); 
                
                $("#gate-1").val(resArr[4].toString());
                $("#gate-2").val(resArr[5].toString());
                $("#gate-3").val(resArr[6].toString());
                $("#gate-4").val(resArr[7].toString());    
                ip = "-> GateWay: " + ip + "\n";
                req.submit(CMD.getHex(CMD.GetMac));
            }else if (cmdIndex === 0x14) {
                var ip = resPara1.toString(16).replace(/^(\w)$/, "0$1") + ":" + resPara1_2.toString(16).replace(/^(\w)$/, "0$1") + ":" + resPara2.toString(16).replace(/^(\w)$/, "0$1") + ":" + resPara2_2.toString(16).replace(/^(\w)$/, "0$1") + ":" + resArr[8].toString(16).replace(/^(\w)$/, "0$1") + ":" + resArr[9].toString(16).replace(/^(\w)$/, "0$1");
                currentMac = resArr[4].toString(16).replace(/^(\w)$/, "0$1") + "," + resArr[5].toString(16).replace(/^(\w)$/, "0$1") + "," + resArr[6].toString(16).replace(/^(\w)$/, "0$1") + "," + resArr[7].toString(16).replace(/^(\w)$/, "0$1") + "," + resArr[8].toString(16).replace(/^(\w)$/, "0$1") + "," + resArr[9].toString(16).replace(/^(\w)$/, "0$1");

                $("#mac-1").val(resArr[4].toString(16).replace(/^(\w)$/, "0$1"));
                $("#mac-2").val(resArr[5].toString(16).replace(/^(\w)$/, "0$1"));
                $("#mac-3").val(resArr[6].toString(16).replace(/^(\w)$/, "0$1"));
                $("#mac-4").val(resArr[7].toString(16).replace(/^(\w)$/, "0$1"));
                $("#mac-5").val(resArr[8].toString(16).replace(/^(\w)$/, "0$1"));
                $("#mac-6").val(resArr[9].toString(16).replace(/^(\w)$/, "0$1"));
                ip = "-> Mac: " + ip + "\n";
                setTimeout(function () {
                    close();
                },200)
            }
            printLog(ip);
        }
        else {
            req.query();
        }

        return;
    }
    // ---------------------- end ------------------------

    // DHCP
    if (cmdType === 0x22 && cmdIndex === 0x0a) {

        if (resType === cmdType && resIndex === cmdIndex && resPara1 === 0x00) {

            req.cmd = null;

            DHCPSetting(cmdPara1 === 0x0f);
            editBoxDisable(cmdPara1 === 0x0f);

            // 需要重新打开页面
            printLog("-> Network configuration changed!\n");
        }
        else {
            req.query();
        }
        return;
    }

    // IP Subnet  Gateway
    if (cmdType === 0x22 && (cmdIndex === 0x0e || cmdIndex === 0x71 || cmdIndex === 0x0c || cmdIndex === 0x13)) {

        if (resType === cmdType && resIndex === cmdIndex && resPara1 === 0x00) {

            req.cmd = null;
            // 请重新加载页面
            //printLog("-> Network configuration changed!\n");
            if(cmdIndex === 0x0e){
                currentIp = cmdArr[4].toString(16).replace(/^(\w)$/, "0$1") + "," + cmdArr[5].toString(16).replace(/^(\w)$/, "0$1") + "," + cmdArr[6].toString(16).replace(/^(\w)$/, "0$1") + "," + cmdArr[7].toString(16).replace(/^(\w)$/, "0$1");
            }else if(cmdIndex === 0x71){
                currentSubnet = cmdArr[4].toString(16).replace(/^(\w)$/, "0$1") + "," + cmdArr[5].toString(16).replace(/^(\w)$/, "0$1") + "," + cmdArr[6].toString(16).replace(/^(\w)$/, "0$1") + "," + cmdArr[7].toString(16).replace(/^(\w)$/, "0$1");
            }else if(cmdIndex === 0x0c){
                currentGateway = cmdArr[4].toString(16).replace(/^(\w)$/, "0$1") + "," + cmdArr[5].toString(16).replace(/^(\w)$/, "0$1") + "," + cmdArr[6].toString(16).replace(/^(\w)$/, "0$1") + "," + cmdArr[7].toString(16).replace(/^(\w)$/, "0$1");
            }
            else if(cmdIndex === 0x13){
                currentMac = cmdArr[4].toString(16).replace(/^(\w)$/, "0$1") + "," + cmdArr[5].toString(16).replace(/^(\w)$/, "0$1") + "," + cmdArr[6].toString(16).replace(/^(\w)$/, "0$1") + "," + cmdArr[7].toString(16).replace(/^(\w)$/, "0$1") + "," + cmdArr[8].toString(16).replace(/^(\w)$/, "0$1") + "," + cmdArr[9].toString(16).replace(/^(\w)$/, "0$1");
            }
        }
        else {
            req.query();
        }
        return;
    }


    // Upgrade
    if (cmdType === 0x08 && cmdIndex === 0x07) {

        if (resType === cmdType && resIndex === cmdIndex && resPara1 === 0x00) {

            req.cmd = null;

            showLoader("Upgrading...");
            updateProgress(0);

            req.submit(CMD.getHex(CMD.UpgradeReady), {delay: 2000});
        }
        else {
            req.query();
        }
        return;
    }

    // Upgrade ready
    if (cmdType === 0x08 && cmdType === 0x08) {

        if (resType === cmdType && resIndex === cmdIndex && resPara1 === 0x00) {

            req.cmd = null;

            // 开始升级 发送数据
            upgrade(upgradePackage[0]);
        }
        else {
            req.submit(CMD.getHex(CMD.UpgradeReady), {delay: 500});
        }
        return;
    }

}


/**
 * 升级时，发送数据，回调监听
 * @param resText
 */
function upgradeListener(resText) {


    if (resText === "" || !/hex/.test(resText)) {

        req.query({
            delay: 200,
            overCount: function () {
                close();
                alert("Upgrade failed!");
            },
            success: upgradeListener
        });

        return;
    }

    // 拆分结果
    var resArr = resText.substring(4, 42).split(",");
    var cmdArr = req.cmd.split(",");

    for (var i = 0; i < cmdArr.length; i++) {

        cmdArr[i] = parseInt(cmdArr[i], 16);
    }

    // 转换  字符串转十六进制
    for (var i = 0; i < resArr.length; i++) {

        resArr[i] = parseInt(resArr[i], 16);
    }

    // 进度
    var currentProgress = Math.floor((resArr[3] + 1) / upgradePackage.length * 100);
    updateProgress(currentProgress);


    // 升级中
    if (resArr[0] === 0xfe && resArr[1] === 0xef && resArr[3] === cmdArr[3]) {

        if (resArr[2] === 0x00) {

            req.count = 0;
            // 发送下一个数据包
            upgrade(upgradePackage[resArr[3] + 1]);
        }

        else if (resArr[2] === 0x80) {
            req.cmd = null;
            updateProgress(100);

            setTimeout(function () {
                close();
                alert("upgrade successfully!");
            }, 2000);
        }

    }

    else {

        req.query({
            delay: 200,
            overCount: function () {
                alert("Upgrade failed!");
            },
            success: upgradeListener
        });
    }
    console.log('submit',req.cmd)
}


/**
 * 升级，传递一个1029个字节的数据包
 * @param data
 */
function upgrade(data) {

    req.cmd = data.substring(0, 11);

    var dataArr = [];
    // 拆分10个小包，分10次发送
    for (var i = 0; i < 5; i++) {

        var subData = data.substring(i * 600, 600 * (i + 1) - 1);
        if (i === 4) {
            subData = data.substring(i * 600);
        }

        dataArr.push(subData);
    }

    // 发送数据
    sendData(dataArr, 0);
}

/**
 * 发送数据包，一个1029字节分多次发送
 * @param dataArr 要发送的字节数组
 * @param index 要发送数组中的索引
 */
function sendData(dataArr, index) {

    $.ajax({
        url: "./cgi-bin/submit",
        data: {
            cmd: "hex(" + dataArr[index] + ")"
        },
        success: function () {

            if (index >= 4) {

                // 指令发送成功，开始查询指令 500ms
                setTimeout(function () {

                    $.get("./cgi-bin/query", function (response) {
                        console.log('query',response)
                        upgradeListener(response || "");
                    });

                }, 500);

                return;
            }

            setTimeout(function () {
                sendData(dataArr, index + 1);
            }, 100);

        }
    });
}


/**
 * 状态查询
 * @param pageIndex
 */
function getStatus(pageIndex) {

    switch (pageIndex) {

        case 1:
            // 获取 第一页
            req.submit(CMD.getHex(CMD.GetSI, false, 1));
            break;
        case 2:
            // 获取输出的输入通道		GetOUT1!	第二页
//          checkActive();
            req.submit(CMD.getHex(CMD.GetOUT, false, 1), {delay: 250});
            break;
        case 3:
            // 获取EDID状g态	GetEDID1!	第三页
            req.submit(CMD.getHex(CMD.GetAudioIn, false, 1));
            break;
        case 4:
            // 第四页
            req.submit(CMD.getHex(CMD.GetEDID, false, 1), {delay: 250});
            break;
        case 5:
            // 第四页
            clearLog();
            /**
             * 查询 HDCP IP GateWay
             */
            req.submit(CMD.getHex(CMD.GetDHCP));
            break;
        default:

    }

}


