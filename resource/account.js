var pageType = getQueryString('type') || '1';
$(function () {
    $('.deposit-btn').off('click').on('click', function () {
        $('.deposit-btn').removeClass('active');
        $(this).addClass('active');
        var type = $(this).attr('type');
        if (type == 'ETH') {
            pageType = '2';
            $('#ETHArea').show();
            $('#BTCArea').hide();
            getFinancialRecord(pageType);
        }
        else {
            pageType = '1'
            $('#ETHArea').hide();
            $('#BTCArea').show();
            getFinancialRecord(pageType);
        }
    });

    $('#depositBtn' + pageType).click();

    setInterval(function () {
        console.log('3分钟自动刷新数据');
        getFinancialRecord(pageType)
    }, 1000 * 60 * 3);
});


function getFinancialRecord(type) {
    $.ajax({
        url: queryChargeUrl,
        type: 'post',
        dataType: 'json',
        data: {
            sessionid: localStorage.sessionid,
            token: localStorage.token,
            timestamp: new Date().getTime(),
            user_name: localStorage.user_name,
            data: JSON.stringify({user_name: localStorage.user_name, type: type})
        },
        success: function (json) {
            console.log('充值记录:', type, json);
            var withdrawAddress = '';
            if (type == '1'){
                withdrawAddress = 'https://blockchain.info/address/'
            }
            else if (type == '2'){
                withdrawAddress = 'https://etherscan.io/address/'
            }
            else if (type == '3'){
                withdrawAddress = 'https://etherscan.io/token/0x1e797ce986c3cff4472f7d38d5c4aba55dfefe40?a='
            }
            if (json.status == 0) {
                var data = json.data;
                $('#financialRecord').empty();
                if (data.length) {
                    for(var i=0;i<data.length;i++){
                        var itemData = data[i];
                        var time = itemData.time;
                        var recharge_money = itemData.recharge_money;
                        var recharge_out_address = itemData.recharge_out_address;
                        var recharge_address = withdrawAddress + recharge_out_address;
                        var status = depositeStatus(itemData.status);
                        var trHtml = '<tr>' +
                            '<th width="220">'+time+'</th>' +
                            '<th width="200">'+recharge_money+'</th>' +
                            '<th width="220"><p><a style="color: #5454FF;text-decoration:underline;" href="'+ recharge_address +'" target="_blank">'+recharge_out_address+'</a></p></th>' +

                            //'<th width="220"><p>'+recharge_out_address+'</p></th>' +
                            '<th width="212">'+status+'</th>' +
                            '</tr>';
                        $('#financialRecord').append(trHtml);
                    }

                }

            }
            else if (json.status == 431 || json.status == 402 || json.status == 430) {
                console.log('message:', json.message);
                util.layerAlert("", util.getLan("add4"), 2, function () {
                    localStorage.clear();
                    location.href = 'login.html';
                });
            }
            else {
                util.layerAlert("", json.message, 2);
                localStorage.clear();
                location.href = 'login.html';
            }
        }
    });
}

function depositeStatus(status) {
    var obj = {
        1 : util.getLan("add9"),
        2 : util.getLan("add10"),
        3 : util.getLan("add11"),
        4 : util.getLan("add12")
    };
    return obj[status];
}