/**
 * Created by lenovo on 2016/8/13.
 */


/**
 * 切换导航栏
 * @param index 导航索引
 */
function tabNav(index) {
    // 隐藏其他content Tab
    for (var i = 1; i < 7; i++) {

        $("#tab-" + i).removeClass("selected");
        $("#content-" + i).hide();
    }
    // 显示选择的content Tab
    $("#tab-" + index).addClass("selected");
    $("#content-" + index).show();
}

/**
 * 关闭面板
 */
function close() {
    // 隐藏面板
    $(".cover").hide();
    // 移除绑定的事件
    $("#yes-input").off("click");
    $("#no-input").off("click");
    $(".cover").off("click");
}

/**
 * 显示等待面板
 */
function showLoader(text) {

    close();
    $("#loader-panel").show();
    $("#loader-panel p").text(text || "");
}
function showLoader1(text) {
    close();
    $("#loader-panel").show();
    $("#loader-panel p").text(text || "");
}
/**
 * 更新进度
 */
function updateProgress(progress) {

    $("#loader-panel p").text("Upgrading..." + progress + "%");
}

/**
 * 打开确认面板
 * @param cmd 待发送的指令
 */
function showAlert(func) {
    // 显示
    $("#alert-panel").show();

    // 绑定发送指令事件
    $("#yes-input").one("click", function () {
        // 发送指令
        func();
    });
    // 绑定关闭面板事件
    $("#alert-panel").click(function (e) {

        if (e.target == this) {
            close();
        }
    });
    $("#no-input").one("click", function () {
        close();
    });
}


/**
 * 设置开关
 * @param cmd 指定开关相关的指令
 * @param flag 开关状态
 */
function switchSetting(cmd, flag, index) {

    var id = null;
    switch (cmd) {
        case CMD.Beep:
            id = "switch-beep";
            break;
        case CMD.Power:
            id = "switch-power";
            break;
        case CMD.ARC:
            id = "switch-arc-" + index;
            break;
        default:
    }

    $("#" + id)[0].checked = flag;
}

/**
 * 连接状态
 * @param inout 输入/输出
 * @param index 索引
 * @param flag 是否连接
 */
function connectionStatus(inout, index, flag) {
    var conn = $("#" + inout + "-" + index);
    if (flag) {
        conn.text("Yes");
        conn.addClass("keyboard-highlight");
    }
    else {
        conn.text("No");
        conn.removeClass("keyboard-highlight");
    }
}

/**
 * 通道设置
 * @param inIndex 输入索引
 * @param outIndex 输出索引
 */
function channelSetting(inIndex, outIndex) {

    $("#matrix-out-" + outIndex).text("IN " + inIndex);
}


/**
 * 设置选择框
 * @param cmd
 * @param index
 * @param selectIndex
 */
function selectSetting(cmd, index, selectIndex) {

    var id = null;
    switch (cmd) {
        case CMD.Audio:
            id = "select-matrix-" + index;
            break;
        case CMD.EDID:
            id = "select-edid";
            break;
        case CMD.AudioIn:
            id = "select-audio-" + index;
            break;
        default:
    }
    $("#" + id).val(selectIndex);
}


/**
 * EDID状态输出
 * @param edidIndex
 * @param inIndex   如果为0, 代表All
 * @param copyFlag
 * @constructor
 */
function EDIDPrint(edidIndex, inIndex, copyFlag) {

    if (copyFlag) {

        if (inIndex === 0) {
            // ALL
            for (var i = 1; i <= 8; i++) {
                switch(edidIndex){
                  case 1:   
                  $("#edid-in-" + i).text("Copy Tx A");
                  break;
                  case 2:
                  $("#edid-in-" + i).text("Copy Tx B");
                  break;
                  case 3:
                  $("#edid-in-" + i).text("Copy Tx C");
                  break;
                  case 4:
                  $("#edid-in-" + i).text("Copy Tx D");
                  break;
                  case 5:
                  $("#edid-in-" + i).text("Copy Tx E");
                  break;
                  case 6:
                  $("#edid-in-" + i).text("Copy Tx F");
                  break;
                  case 7:
                  $("#edid-in-" + i).text("Copy Tx G");
                  break;
                  case 8:
                  $("#edid-in-" + i).text("Copy Tx H");
                  break;
                }
            }
        }
        else {
            switch(edidIndex){
                  case 1:   
                  $("#edid-in-" + inIndex).text("Copy Tx A");
                  break;
                  case 2:
                  $("#edid-in-" + inIndex).text("Copy Tx B");
                  break;
                  case 3:
                  $("#edid-in-" + inIndex).text("Copy Tx C");
                  break;
                  case 4:
                  $("#edid-in-" + inIndex).text("Copy Tx D");
                  break;
                  case 5:
                  $("#edid-in-" + inIndex).text("Copy Tx E");
                  break;
                  case 6:
                  $("#edid-in-" + inIndex).text("Copy Tx F");
                  break;
                  case 7:
                  $("#edid-in-" + inIndex).text("Copy Tx G");
                  break;
                  case 8:
                  $("#edid-in-" + inIndex).text("Copy Tx H");
                  break;
                }
        }
    }
    else {
        if (inIndex === 0) {
            // ALL
            for (var i = 1; i <= 8; i++) {
                $("#edid-in-" + i).text($("#select-edid option")[edidIndex].text);
            }
        }
        else {
            if (edidIndex === 200) {
                $("#edid-in-" + inIndex).text("User define");
            }
            else {
                $("#edid-in-" + inIndex).text($("#select-edid option")[edidIndex].text);
            }
        }
    }

}

/**
 * 设置DHCP状态
 * @param flag
 * @constructor
 */

function DHCPSetting(flag) {

    document.getElementById("switch-dhcp").checked = flag;
}

/**
 * 展示数据
 * @param text
 */
function printLog(text) {

    text = $("#text-area-log").text() + text;
    $("#text-area-log").text(text);
}

/**
 * 清空数据
 */
function clearLog() {

    $("#text-area-log").text("");
}

/**
 * 禁用IP操作
 * @param flag
 */
function editBoxDisable(flag) {

    new EditBox("edit-box-ip").disabled(flag);
    new EditBox("edit-box-subnet").disabled(flag);
    new EditBox("edit-box-gate").disabled(flag);
    new EditBox("edit-box-mac").disabled(flag);
}


function arrToString(arr){
  var str = '';
  for(var i = 0; i < arr.length; i++){
       if(i < arr.length-1){
        str += arr[i].toString(16).replace(/^(\w)$/, "0$1") + "," 
      }else{
        str += arr[i].toString(16).replace(/^(\w)$/, "0$1") 
      }   
  }

  return str;
}
