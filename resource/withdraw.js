var widthdrawType = 1;
var withdraw = {
    submit: function () {
        var ele = this;
        var txtBalance = util.trim($("#txtBalance").val());
        var txtText = util.trim($("#txtText").val());
        var txtAmount = util.trim($("#txtAmount").val());
        var txtCode = util.trim($("#txtCode").val());
        if (txtText === "") {
            util.layerAlert("", util.getLan("user.tips.26"), 2);
            return;
        }
        if (txtAmount === "") {
            util.layerAlert("", util.getLan("user.tips.27"), 2);
            return;
        }
        if (txtCode === "") {
            util.layerAlert("", util.getLan("user.tips.28"), 2);
            return;
        }
        if (isNaN(txtBalance)) {
            util.layerAlert("", util.getLan("user.tips.29"), 2);
            return;
        }
        if (parseFloat(txtBalance) < parseFloat(txtAmount)) {
            util.layerAlert("", util.getLan("user.tips.29"), 2);
            return;
        }
        //提现类型，1是btc，2是eth，3是bcdn
        var param = {
            sessionid: localStorage.sessionid,
            token: localStorage.token,
            timestamp: new Date().getTime(),
            user_name: localStorage.user_name,
            data: JSON.stringify({
                "user_name": localStorage.user_name,
                "draw_address": txtText,
                "draw_count": txtAmount,
                "vcode": txtCode,
                "type": widthdrawType
            })
        };
        var callback = function (data) {
            if (data.status == 0) {
                util.layerAlert("", util.getLan("user.tips.30"), 1);
            } else {
                util.layerAlert("", data.message, 2);
            }
        };
        util.network({btn: ele, url: withdrawUrl, param: param, success: callback});
    },
    cancelCoinWithdraw: function (id) {
        alert(id);
        util.layerConfirm(util.getLan("user.tips.31"), function () {
            var param = {
                id: id
            };
            var callback = function (data) {
                if (data.status == 0) {
                    window.location.reload(true);
                } else {
                    util.layerAlert("", data.msg, 2);
                }
            };
            util.network({
                url: cancelDrawUrl,
                param: param,
                success: callback,
            });
        });
    }
};

$(function () {
    $("#btnSendEmailCode").on("click", function () {
        email.sendcode($(this).data().msgtype, $(this).data().tipsid, this.id, localStorage.user_name,3);
    });
    $("#btnSubmit").on("click", function () {
        withdraw.submit()
    });
    $("#txtAmount").on("keypress", function (event) {
        return util.goIngKeypress(this, event, 4);
    });
    $(".withdraw-cancel").on("click", function (event) {
        withdraw.cancelCoinWithdraw($(this).attr('fid'));
    });

    //提现类型，1是btc，2是eth，3是bcdn
    $('.withdraw-btn').off('click').on('click', function () {
        $('.withdraw-btn').removeClass('active');
        $(this).addClass('active');
        var type = $(this).attr('type');
        if (type == 'BTC') {
            widthdrawType = 1;
            $('#txtBalance').val(btcCount);
            getQueryDraw(widthdrawType);
        }
        else if (type == 'ETH') {
            widthdrawType = 2;
            $('#txtBalance').val(ethCount);
            getQueryDraw(widthdrawType);
        }
        else {
            widthdrawType = 3;
            $('#txtBalance').val(bcdnCount);
            getQueryDraw(widthdrawType);
        }
    });
    getQueryDraw(widthdrawType);
});

function getQueryDraw(type) {
    $.ajax({
        url: queryDrawUrl,
        type: 'post',
        dataType: 'json',
        data: {
            sessionid: localStorage.sessionid,
            token: localStorage.token,
            timestamp: new Date().getTime(),
            user_name: localStorage.user_name,
            data: JSON.stringify({user_name:localStorage.user_name,type:type})
        },
        success: function(json){
            console.log('提现记录:',type, json);
            if (json.status == 0){

            }
            else if (json.status == 431 || json.status == 402) {
                util.layerAlert("", json.message, 2, function () {
                    location.href = 'login.html';
                });
            }
            else {
                util.layerAlert("", json.message, 2);
            }
        }
    });
}