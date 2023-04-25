/**
 * Created by lenovo on 2016/11/18.
 */

/**
 * 定义一个指令映射ID类，通过指令的ID来获取具体的指令
 */
if (typeof CMD == "undefined") {

    var CMD = {
        // page 1
        Power: 10,
        GetPower: 11,

        Beep: 12,
        GetBeep: 13,

        Restore: 14,
        Reboot: 15,

        GetSI: 16,
        GetSO: 17,

        // page 2
        ARC: 20,
        GetARC: 21,

        INOUT: 22,
        GetOUT: 23,

        Audio: 24,
        GetAudio: 25,

        // page 3
        AudioIn: 30,
        GetAudioIn: 31,

        Delay: 32,
        GetDelay: 33,

        Vol: 34,
        GetVol: 35,

        // page 4
        EDID: 40,
        EDIDAll: 41,
        EDIDCopy: 42,
        EDIDCopyAll: 43,
        GetEDID: 44,

        // page 5
        DHCP: 45,
        GetDHCP: 46,

        IP: 47,
        GetIP: 48,

        Gate: 49,
        GetGate: 50,

        Subnet: 51,
        GetSubnet: 52,

        Mac: 53,
        GetMac: 54,

        // page 6
        Upgrade: 55,
        UpgradeReady: 56,

        /////////////////////
        cmdType: 2,
        cmdIndex: 3,
        cmdPara1: 4,
        cmdPara2: 6,
        cmdPara3: 8,

        cmdVerify: 12
    };

    CMD.cmdHex = [0xa5, 0x5b, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00];

    /**
     * 获取具体的指令，cmd为必须参数，其他的为可选参数，根据需求传递相应的参数；
     * 对于一些可变的指令，必须传递对应的参数，以便自动计算校验位，和拼接正确的指令
     * @param cmd 要获取的指令的ID
     * @param flag 一般用来表示两个状态（true：开；false：关）
     * @param index1 一般用作索引
     * @param index2 一般用作索引
     * @returns {*} 返回一条具体的指令（13个字节，或者字符串），都是以字符串的数据类型返回
     */
    CMD.getHex = function (cmd, flag, index1, index2, index3) {

        switch (cmd) {
            case this.Beep:
                this.setHex(0x06, 0x01, flag ? 0x0f : 0xf0);
                break;
            case this.GetBeep:
                this.setHex(0x01, 0x0b);
                break;
            case this.Power:
                this.setHex(0x08, 0x0b, flag ? 0x0f : 0xf0);
                break;
            case this.GetPower:
                this.setHex(0x08, 0x0c);
                break;
            case this.Restore:
                this.setHex(0x08, 0x0a);
                break;
            case this.Reboot:
                this.setHex(0x08, 0x0d);
                break;
            case this.GetSI:
                this.setHex(0x01, 0x14);
                break;
            case this.GetSO:
                this.setHex(0x01, 0x15);
                break;
            ////
            case this.ARC:
                this.setHex(0x10, 0x01, flag ? 0x0f : 0xf0, index1);
                break;
            case this.GetARC:
                this.setHex(0x10, 0x02, 0x00, index1);
                break;
            case this.INOUT:
                this.setHex(0x02, 0x03, index1, index2);
                break;
            case this.GetOUT:
                this.setHex(0x02, 0x11, index1);
                break;
            case this.Audio:
                this.setHex(0x08, 0x42, index1, index2);
                break;
            case this.GetAudio:
                this.setHex(0x08, 0x43, index1);
                break;
            ////
            case this.AudioIn:
                this.setHex(0x08, 0x44, index1, index2);
                break;
            case this.GetAudioIn:
                this.setHex(0x08, 0x45, index1);
                break;
            case this.Delay: {
                this.setHex(0x08, 0x40, index1);
                // 特殊处理 0-2000ms
                this.cmdHex[this.cmdPara2] = Math.floor(index2 / 0x100);
                this.cmdHex[this.cmdPara2 + 1] = index2 % 0x100;
                break;
            }
            case this.GetDelay:
                this.setHex(0x08, 0x41, index1);
                break;
            case this.Vol:
                this.setHex(0x17, 0x17, index1, index2);
                break;
            case this.GetVol:
                this.setHex(0x17, 0x18, 0x00, index1);
                break;
            ////
            case this.EDID: {
                this.setHex(0x03, 0x02, index1, index2);
                // 特殊处理
                this.cmdHex[this.cmdPara1 + 1] = 0xf0;
                break;
            }
            case this.EDIDAll: {
                this.setHex(0x03, 0x01, index1);
                // 特殊处理
                this.cmdHex[this.cmdPara1 + 1] = 0xf0;
                break;
            }
            case this.GetEDID:
                this.setHex(0x01, 0x1c, index1);
                break;
            case this.EDIDCopy:
                this.setHex(0x03, 0x04, index1, index2);
                break;
            case this.EDIDCopyAll:
                this.setHex(0x03, 0x03, index1);
                break;
            ////
            case this.DHCP:
                this.setHex(0x22, 0x0a, flag ? 0x0f : 0xf0);
                break;
            case this.GetDHCP:
                this.setHex(0x22, 0x0b);
                break;
            case this.Gate:
                this.setHex(0x22, 0x0c, index1, index2);
                break;
            case this.GetGate:
                this.setHex(0x22, 0x0d);
                break;
            case this.IP:
                this.setHex(0x22, 0x0e, index1, index2);
                break;
            case this.GetIP:
                this.setHex(0x22, 0x0f);
                break;
            case this.Subnet:
                this.setHex(0x22, 0x71, index1, index2);
                break;
            case this.GetSubnet:
                this.setHex(0x22, 0x72);
                break;   
            case this.Mac:
                this.setHex(0x22, 0x13, index1, index2, index3);
                break;
            case this.GetMac:
                this.setHex(0x22, 0x14);
                break;
            case this.Upgrade:
                this.setHex(0x08, 0x07);
                break;
            case this.UpgradeReady:
                this.setHex(0x08, 0x08);
                break;
            default:
        }

        // 计算校验位
        this.cmdHex[this.cmdVerify] = this.calcVerify();
        // 转换成字符串并返回
        var cmdHex = [];
        for (var i = 0; i < this.cmdHex.length; i++) {

            cmdHex.push(this.cmdHex[i].toString(16).replace(/^(\w)$/, "0$1"));
        }
        return cmdHex.join();
    };

    /**
     * 设置指令
     * @param cmdType
     * @param cmdIndex
     * @param cmdPara1
     * @param cmdPara2
     */
    CMD.setHex = function (cmdType, cmdIndex, cmdPara1, cmdPara2, cmdPara3) {

        cmdPara1 = cmdPara1 || 0x00;
        cmdPara2 = cmdPara2 || 0x00;
        cmdPara3 = cmdPara3 || 0x00;

        this.cmdHex[this.cmdType] = cmdType;
        this.cmdHex[this.cmdIndex] = cmdIndex;

        // 针对双字节参数处理
        if (cmdPara1 > 0xff && cmdPara2 > 0xff || cmdPara3 > 0xff) {
            this.cmdHex[this.cmdPara1] = Math.floor(cmdPara1 / 0x100);
            this.cmdHex[this.cmdPara1 + 1] = cmdPara1 % 0x100;
            this.cmdHex[this.cmdPara2] = Math.floor(cmdPara2 / 0x100);
            this.cmdHex[this.cmdPara2 + 1] = cmdPara2 % 0x100;
            this.cmdHex[this.cmdPara3] = Math.floor(cmdPara3 / 0x100);
            this.cmdHex[this.cmdPara3 + 1] = cmdPara3 % 0x100;
        }
        else {
            this.cmdHex[this.cmdPara1] = cmdPara1;
            this.cmdHex[this.cmdPara1 + 1] = 0x00;
            this.cmdHex[this.cmdPara2] = cmdPara2;
            this.cmdHex[this.cmdPara2 + 1] = 0x00;
            this.cmdHex[this.cmdPara3] = cmdPara3;
            this.cmdHex[this.cmdPara3 + 1] = 0x00;
        }
    };
    /**
     * 计算指令校验位
     * @param cmdHex 十六进制数组
     * @returns {number}
     */
    CMD.calcVerify = function (cmdHex) {

        var cmdHex = cmdHex || this.cmdHex;

        var num = 0;
        for (var i = 0; i < (cmdHex.length - 1); i++) {

            num += cmdHex[i];
        }
        var fnum = cmdHex.length > 13 ? num % 0x100 : 0x100 - num % 0x100;
        if(fnum == 0x100){
            fnum = 0x00;
        }
        return fnum;
    };
}


/**
 * 将数据打包成1029个字节的数据包
 * @param bytes
 * @returns {Array}
 */
function packData(bytes) {

    // 转换为普通数组
    var bytes = Array.from(bytes);
    // 保存数据包
    var upgradePackage = new Array();

    var num = 0xfe + 0xef;
    var verify = 0;
    var index = 0;
    var cmd = "fe,ef,00,00,";

    // 1024补齐
    if (bytes.length % 1024 !== 0) {

        var count = 1024 - bytes.length % 1024;
        for (var i = 0; i < count; i++) {

            bytes.push(255);
        }
    }

    // 拆分成数据包
    for (var i = 0; i < bytes.length; i++) {

        // 对数据求和
        num += bytes[i];
        // 拼接数据
        cmd += (bytes[i].toString(16).replace(/^(\w)$/, "0$1") + ",");

        // 每1024字节进行打包
        if ((i + 1) % 1024 === 0) {

            /**
             * 当校验位为0x100时，去掉第一位：0x00
             * @type {string}
             */
            verify = (0x100 - num % 256).toString(16).replace(/^(\w)$/, "0$1").replace(/^\w(\w\w)$/, "$1");
            if (verify === "100") verify = "00";
            cmd += verify;
            upgradePackage.push(cmd);

            // 重新设置
            index += 1;
            num = 0xfe + 0xef + index;
            if (i === bytes.length - 1 - 1024) {
                num += 0x80;
                cmd = "fe,ef,80," + index.toString(16).replace(/^(\w)$/, "0$1") + ",";
            }
            else {
                cmd = "fe,ef,00," + index.toString(16).replace(/^(\w)$/, "0$1") + ",";
            }

        }
    }

    return upgradePackage;
}


/**
 * 滑块对象原型
 * @param id 滑块对象的id, 显示值的元素id必须遵循一定的命名规则
 * @constructor 添加事件
 */
function Slider(id) {

    this.id = /#/.test(id) ? id : "#" + id;
    this.progress = $(this.id);
    this.slider = $(this.id + " .slider");
    this.progressBg = $(this.id + " .bg");

    this.staticText = $(this.id + "-value");

    this.sliderFlag = false;
    this.minValue = 0;
    this.maxValue = this.progress.width() - this.slider.width();
    this.currentX = 0;
    this.clickX = 0;

    this.value = 0;
}
/**
 * 滑块添加事件
 * @param completed 事件完成回调函数
 */
Slider.prototype.addSliderListener = function (completed) {

    var _this = this;
    this.slider.mousedown(function (e) {

        _this.sliderFlag = true;
        _this.clickX = e.pageX;
        _this.currentX = $(this).position().left;
    });
    $(document.body).mousemove(function (e) {

        if (!_this.sliderFlag) {
            return;
        }

        var sliderX = _this.currentX + e.pageX - _this.clickX;
        if (sliderX < _this.minValue) {
            sliderX = _this.minValue;
        }
        if (sliderX > _this.maxValue) {
            sliderX = _this.maxValue;
        }

        _this.progressBg.css("width", sliderX + "px");
        _this.slider.css("left", sliderX + "px");

        _this.value = Math.round(sliderX * 100 / _this.maxValue)
        _this.staticText.text(_this.value);
    });
    $(document.body).mouseup(function () {
        if (!_this.sliderFlag) {
            return;
        }
        _this.sliderFlag = false;
        completed(_this.id, _this.value);
    });
    this.progress.mousedown(function (e) {
        // console.log(this.clientLeft);
        // slider.css("left", "+=" + (e.pageX - progress.clientLeft) + "px");
    });
};
/**
 * 为滑块设置值
 * @param value
 */
Slider.prototype.setValue = function (value) {

    this.value = value;

    this.staticText.text(value);

    var valueX = value * this.maxValue / 100;
    this.progressBg.css("width", valueX + "px");
    this.slider.css("left", valueX + "px");
};

/**
 * 编辑框
 * @param id
 * @constructor
 */
function EditBox(id) {

    this.id = /#/.test(id) ? id : "#" + id;

    this.value = "0";
}
/**
 * 编辑框添加监听事件(失去焦点)
 * @param completed 回调函数
 */
EditBox.prototype.addEditListener = function (completed) {

    var _this = this;
    $(this.id).focus(function () {

        this.placeholder = this.value;
        this.value = "";
    });
    $(this.id).blur(function () {

        if (this.value.length > 0) {

            _this.value = this.value;
            // 设置
            completed(this.id, this.value);
        }
        else {
            this.value = this.placeholder;
        }
    });
    $(this.id).keyup(function (e) {

        // > 2000 ?
        if (parseInt(this.value) > 2000) {
            this.value = "2000";
        }

        // 0...9    48...57
        if (e.keyCode === 13) {
            $(this).blur();
        }
    });
    $(this.id).keydown(function (e) {

        var keyCode = e.keyCode;
        if (keyCode <= 57 && keyCode >= 48 ||
            keyCode === 13 || keyCode === 8) {
            return true;
        }
        return false;
    });
}
/**
 * 为编辑框设置值
 * @param value
 */
EditBox.prototype.setValue = function (value) {

    this.value = value;

    $(this.id).val(value);
}

/**
 * 终端调试框
 * @param id
 * @constructor
 */
function Terminal(id) {

    this.id = /#/.test(id) ? id : "#" + id;
    this.$terminal = $(this.id);
    this.$head = $(this.id + " h4");
    this.$close = $(this.id + " .close");
    this.$textarea = $(this.id + " textarea");

    this.dragFlag = false;
    this.isShow = false;

    // 鼠标相对终端的位置
    this.offsetX = 0;
    this.offsetY = 0;

    // 宽度
    this.pageWidth = document.body.clientWidth;
    this.width = $(this.id).width();

    // 指令
    this.cmd = [0xa5, 0x5b, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];

    // 初始化
    var _this = this;
    // 点击聚焦
    this.$terminal.click(function (e) {

        if (e.target !== this && e.target !== _this.$head[0]) return;

        var pos = _this.$textarea.val().length;

        // 移动光标到末尾
        _this.$textarea[0].setSelectionRange(pos, pos);
        _this.$textarea.focus();
    })
        // 鼠标按下
        .mousedown(function (e) {

            if (e.target !== this && e.target !== _this.$head[0]) return;

            // 允许拖拽
            _this.dragFlag = true;

            _this.offsetX = e.pageX - $(this).position().left;
            _this.offsetY = e.pageY - $(this).position().top;

        });
    // 鼠标移动
    $(document).mousemove(function (e) {

        if (!_this.dragFlag) return;

        var left = e.pageX - _this.offsetX,
            top = e.pageY - _this.offsetY;

        if (left < _this.width * 0.5) left = _this.width * 0.5;
        if (left > _this.pageWidth - _this.width * 0.5) left = _this.pageWidth - _this.width * 0.5;
        if (top < 0) top = 0;
        _this.$terminal.css({
            left: left + "px",
            top: top + "px"
        });
    })
        // 鼠标弹起
        .mouseup(function () {

            _this.dragFlag = false;
        })
        // 打开事件
        .dblclick(function (e) {

            if (_this.isShow) {

                if (e.target === _this.$head[0] || e.target === _this.$terminal[0]) {
                    _this.$textarea.val("> ");
                }

                return;
            }

            // _this.$terminal.fadeIn(function () {

            //     _this.$textarea.val("> ").focus();
            //     _this.isShow = true;
            // });
        });
    // 关闭事件
    this.$close.click(function () {

        _this.$terminal.fadeOut(function () {

            _this.$textarea.val("");
            _this.isShow = false;
        });
    });
    // 键盘事件
    this.$textarea.keydown(function (e) {

        // console.log(e.keyCode);

        var keyCode = e.keyCode;
        if (keyCode === 13) {   // 回车

            var cmd = this.value.split("\n").pop();
            var reg = /([^>\s].*)/.exec(cmd);

            if (reg) {
                console.log(reg[1]);

                // 发送指令
                var cmdArr = [];
                if (/,/.test(reg[1])) {
                    cmdArr = reg[1].split(",");
                }
                else if (/\s/.test(reg[1])) {
                    cmdArr = reg[1].split(" ");
                }
                else {
                    _this.cmd = reg[1];
                }

                var len = cmdArr.length;
                // 字节指令
                if (len > 0) {

                    if (len === 2) {
                        _this.cmd[2] = parseInt(cmdArr[0], 16);
                        _this.cmd[3] = 0x00;
                        _this.cmd[4] = parseInt(cmdArr[1], 16);
                        _this.cmd[5] = 0x00;
                    }
                    else if (len === 4) {
                        _this.cmd[2] = parseInt(cmdArr[0], 16);
                        _this.cmd[3] = parseInt(cmdArr[1], 16);
                        _this.cmd[4] = parseInt(cmdArr[2], 16);
                        _this.cmd[5] = parseInt(cmdArr[3], 16);
                    }

                    _this.cmd[_this.cmd.length - 1] = CMD.calcVerify(_this.cmd);


                    // 转换成字符串
                    var cmdHex = [];
                    for (var i = 0; i < _this.cmd.length; i++) {

                        cmdHex.push(_this.cmd[i].toString(16).replace(/^(\w)$/, "0$1"));
                    }

                    req.submit(cmdHex);
                }
                // 设置指令
                else {
                    switch (_this.cmd) {
                        case "set13":
                            _this.cmd = [0xa5, 0x5b, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
                            break;
                        case "set18":
                            _this.cmd = [0xa5, 0x5b, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
                            break;
                        default:
                    }
                }


            }
            else {
                console.log("无效指令");
            }


            $(this).val(this.value + "\n> ");
            return false;
        }
        if (keyCode === 8) {   // 回退

        }

    }).keyup(function (e) {

        if (e.keyCode === 8) {


        }
    });

}
/**
 * 写入内容
 * @param text  文本内容
 * @param flag  是否为发送的内容
 */
Terminal.prototype.write = function (text, flag) {

    var tip = flag ? "     ----- write\n" : "     ----- read\n";
    text = this.$textarea[0].value + text + tip + "> ";
    this.$textarea.val(text);
}

/**
 * 获取IP地址, 无效的IP地址返回false
 * @returns {*}
 */
EditBox.prototype.getIP = function () {

    var ip = new Array(4);
    ip[0] = parseInt($(this.id + " input")[0].value);
    ip[1] = parseInt($(this.id + " input")[1].value);
    ip[2] = parseInt($(this.id + " input")[2].value);
    ip[3] = parseInt($(this.id + " input")[3].value);

    if (ip[0] > 0 && ip[1] >= 0 && ip[2] >= 0 && ip[3] >= 0 &&
        ip[0] < 256 && ip[1] < 256 && ip[2] < 256 && ip[3] < 256) {
        return ip;
    }
    else {
        return false;
    }
};

// EditBox.prototype.getMAC = function () {
//
//     var ip = new Array(4);
//     ip[0] = parseInt($(this.id + " input")[0].value,16);
//     ip[1] = parseInt($(this.id + " input")[1].value,16);
//     ip[2] = parseInt($(this.id + " input")[2].value,16);
//     ip[3] = parseInt($(this.id + " input")[3].value,16);
//     ip[4] = parseInt($(this.id + " input")[4].value,16);
//     ip[5] = parseInt($(this.id + " input")[5].value,16);
//
//     if (ip[0] >= 0 && ip[1] >= 0 && ip[2] >= 0 && ip[3] >= 0 && ip[4] >= 0 && ip[5] >= 0 &&
//         ip[0] < 256 && ip[1] < 256 && ip[2] < 256 && ip[3] < 256 && ip[4] < 256 && ip[4] < 256) {
//         return ip;
//     }
//     else {
//         return false;
//     }
// };
/**
 * 禁用输入框
 * @param flag
 */
EditBox.prototype.disabled = function (flag) {
    $(this.id + " input").each(function () {
        this.disabled = flag;
    });
};


/**
 * 请求类
 * @constructor
 */
function Request() {

    this.ajx = null;
    this.cmd = null;
    this.count = 0;

    this.consuming = false;

    this.timer = setTimeout(null, 0);
}
/**
 * 发送指令函数
 * @param cmd 要发送的具体指令，必须
 * json对象，可选
 * delay：不同的操作需要的延时可能不同，默认是100ms
 * flag：是否是字符串型的指令
 * success：成功回调
 */
Request.prototype.submit = function (cmd, json) {

    // 终止上一次的请求
    if (this.ajx) {
        this.ajx.abort();
    }
    // 取消定时器
    // 下一条指令将要发送，上一条指令的查询也就没有了意义
    clearTimeout(this.timer);

    // 重置请求次数
    this.count = 0;
    // 记录当前发送的CMD
    this.cmd = cmd;

    // 如果不是字符串指令，则进行拼接
    if (!(typeof json == "object" && json.flag)) {
        // 拼接CMD
        cmd = "hex(" + cmd + ")";
    }

    var _this = this;
    this.ajx = $.ajax({
        url: "./cgi-bin/submit",
        data: {
            cmd: cmd
        },
        success: function () {


            //
            terminal.write(_this.cmd, true);
            // 指令发送成功，开始查询指令 100ms
            _this.query({
                delay: (typeof json == "object" && json.delay) ? json.delay : null,
                success: (typeof json == "object" && json.success) ? json.success : null
            });

        }
    });
    console.log('submit:',cmd);
};
Request.prototype.submit1 = function(cmd, json) {

	// 终止上一次的请求
	if(this.ajx) {
		this.ajx.abort();
	}
	// 取消定时器
	// 下一条指令将要发送，上一条指令的查询也就没有了意义
	clearTimeout(this.timer);

	// 重置请求次数
	this.count = 0;
	// 记录当前发送的CMD
	this.cmd = cmd + '\r';


	var _this = this;
	this.ajx = $.ajax({
		url: "./cgi-bin/instr",
		data: {
			cmd: cmd
		},
		success: function() {

			//
//			terminal.write(_this.cmd, true);
			// 指令发送成功，开始查询指令 100ms
			if(_this.cmd.indexOf('Upgrade mcu firmware!')>-1||_this.cmd.indexOf('Upgrade 9396 firmware!')>-1){
				_this.query1({
					delay: (typeof json == "object" && json.delay) ? json.delay : null,
					success: (typeof json == "object" && json.success) ? json.success : null
				});
			}else{
				
				_this.query({
					delay: (typeof json == "object" && json.delay) ? json.delay : null,
					success: (typeof json == "object" && json.success) ? json.success : null
				});
			}

		}
	});
	console.log('submit1:', cmd);
};
/**
 * 查询指令发送结果
 * json是一个对象，可选。可接受的参数有：maxCount, delay, overCount, success
 * maxCount: 最大重复查询次数，默认10次。超过10次则终止查询
 * delay：查询延时，默认100ms
 * overCount：超过次数后回调函数
 * success：查询成功后的回调函数
 */
Request.prototype.query = function (json) {

    var _this = this;
    this.timer = setTimeout(function () {
        /**
         * 对发送同一条执行进行计数
         * 当相同指令发送超过 特定 次数后，就停止继续发送
         */
        _this.count += 1;

        if (_this.count > ((typeof json == "object" && json.maxCount) ? json.maxCount : 10)) {

            _this.count = 0;

            if (typeof json == "object" && json.overCount) {
                json.overCount();
            }
            else {
                alert("Request timeout!");
            }

            return;
        }

        _this.ajax = $.get("./cgi-bin/query", function (res) {

            //
            terminal.write(res);
            console.log('query:',res);

            if (typeof json == "object" && json.success) {

                json.success(_this, res || "");
            }
            else {
                response(_this, res || "");
            }

        });

	}, ((typeof json == "object" && json.delay) ? json.delay : 200));

};
Request.prototype.query1 = function(json) {

	var _this = this;
	this.timer = setTimeout(function() {
		/**
		 * 对发送同一条执行进行计数
		 * 当相同指令发送超过 特定 次数后，就停止继续发送
		 */
		_this.count += 1;

//		if(_this.count > ((typeof json == "object" && json.maxCount) ? json.maxCount : 25)) {
//
//			_this.count = 0;
//				console.log(json)
//			if(typeof json == "object" && json.overCount) {
//				json.overCount();
//			} else {
//				alert("Request timeout!");
//			}
//
//			return;
//		}

		_this.ajax = $.get("./cgi-bin/query", function(res) {

			//
//			terminal.write(res); 
			
			console.log('query:', res);
			
			 if(res.indexOf('Ok')>-1){
			 	
			 	 setTimeout(function () {
	                close();
	                alert("upgrade successfully!");
	                window.location.reload();
           		 }, 25000);
			 	return
			 }
			 
			var ls=res.length;
			
			var af=res.slice((ls-6),(ls));
			
			var ag=res.slice((ls-15),(ls-9));
			
			var fz=parseInt(ag,16);
			
			var fm=parseInt(af,16);
			
			var currentProgress = Math.floor(fz/ datalenth * 100);
//			if(currentProgress>=100){
// 				updateProgress(100)
// 			}
   			console.log(currentProgress);
   			
   			updateProgress(currentProgress);
   			
// 			if(currentProgress<100){
   				_this.query1()
// 			}
   			 
			if(typeof json == "object" && json.success) {

				json.success(res || "");
			} else {
				response(_this, res || "");
			}

		});

	}, ((typeof json == "object" && json.delay) ? json.delay : 200));

};


// 创建请求
var req = new Request();

var datalenth=null;
var sliderVol = [],
    editDelay = [];

for (var i = 1; i <= 8; i++) {

    // 创建滑块
    sliderVol.push(new Slider("audio-vol-" + i));

    // 创建输入框
    editDelay.push(new EditBox("edit-delay-" + i));
}

// 创建调试终端
var terminal = new Terminal("terminal")

var upgradePackage = null,
    fileName = "Open File...";

var volMap = [0,2,4,6,8,10,12,14,16,18,	// 间隔 2
            21,24,37,30,33,36,49,42,45,48,	// 间隔 3
            50,52,54,56,58,60,62,64,66,68,	// 间隔 2
            71,74,77,80,83,86,89,92,95,98,	// 间隔 3
            100,102,104,106,108,110,112,114,116,118,	// 间隔 2
            121,124,127,130,133,136,139,142,148,148,	// 间隔 3
            150,152,154,156,158,160,162,164,166,168,	// 间隔 2
            171,174,177,180,183,186,189,192,195,198,	// 间隔 3
            201,204,207,210,213,216,219,222,226,229,	// 间隔 3
            232,235,238,241,243,245,247,249,251,253,	// 间隔 2和3
            255];