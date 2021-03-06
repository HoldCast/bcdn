var rateData = {};
var pageType = getQueryString('type') || '1';
var lastTime = '2017-08-15 00:35:00';

$(function () {
    $('#icoBtn1').off('click').on('click', function () {
        $('.withdraw-btn').removeClass('active');
        $(this).addClass('active');
        pageType = 1;
        buyRecord(pageType);//获取记录
        getRate(pageType);
    });

    $('#icoBtn2').off('click').on('click', function () {
        $('.withdraw-btn').removeClass('active');
        $(this).addClass('active');
        pageType = 2;
        getRate(pageType);
        buyRecord(pageType);
    });

    //点击锁定
    $('#icoSubmit').off('click').on('click', function () {
        var txtFinancesCount = $('#txtFinancesCount').val();
        if(txtFinancesCount){
            rateData.txtFinancesCount = txtFinancesCount;
            moneyBuy(rateData);
        }

    });

    $('#icoBtn' + pageType).click();


});

//购买记录
function buyRecord(type) {
    $.ajax({
        url: queryAllBuyUrl,
        type: 'post',
        dataType: 'json',
        data: {
            data: JSON.stringify({
                user_name: localStorage.user_name,
                type: type
            }),
            sessionid: localStorage.sessionid,
            token: localStorage.token,
            timestamp: new Date().getTime(),
            user_name: localStorage.user_name
        },
        success: function (json) {
            console.log('购买记录:', type,json);
            if (json.status == 0) {
                var data = json.data;
                $('#withdrawRecord').empty();
                for(var i=0;i<data.length;i++){
                    var buy_time = data[i].buy_time;
                    var buy_money_type = data[i].buy_money_type;
                    var buy_money = data[i].buy_money;
                    var bcdn = data[i].bcdn;
                    var trHtml = '<tr>' +
                        '<th width="240">' + formatDate(buy_time) + '</th>' +
                        '<th width="200">' + moneyType(buy_money_type) + '</th>' +
                        '<th width="200">' + buy_money + '</th>' +
                        '<th width="238">' + bcdn + '</th>' +
                        '</tr>';
                    $('#withdrawRecord').append(trHtml);
                }

            }
            //未开放购买的时间
            else if (json.status == 420) {
                var tips = util.getLan("add14");
                if(nowTimeNumber > lastTimeNumber){
                    tips = util.getLan("add15");
                }
                util.layerAlert("", tips, 1,function(){
                    $('#icoSubmit').css({
                        background:'#ccc',
                        borderColor: '#ccc'
                    }).off('click');
                });
            }
            else if (json.status == 431 || json.status == 402 || json.status == 430) {
                console.log('message:', json.message);
                util.layerAlert("", util.getLan("add4"), 2, function () {
                    location.href = 'login.html';
                });
            }
            else {
                util.layerAlert("", json.message, 2);
            }
        }
    });
}

function moneyType(type){
    //1是BTC,2是ETH
    var obj = {
        1: 'BTC',
        2: 'ETH'
    };
    return obj[type];
}

//锁定(购币)
function moneyBuy(rateData) {
    console.log(rateData);
    var ioc = rateData.txtFinancesCount;
    $.ajax({
        url: moneyBuyUrl,
        type: 'post',
        dataType: 'json',
        data: {
            data: JSON.stringify({
                type: rateData.type,
                user_name: localStorage.user_name,
                step: rateData.step,
                ioc: ioc
            }),
            sessionid: localStorage.sessionid,
            token: localStorage.token,
            timestamp: new Date().getTime(),
            user_name: localStorage.user_name
        },
        success: function (json) {
            console.log('购买:', json);
            if (json.status == 0) {
                util.layerAlert("", util.getLan("add6"), 1, function(){
                    location.href = 'ico.html?type=' + pageType;
                });
            }
            else if (json.status == 420) {
                util.layerAlert("", util.getLan("add5"), 2);
            }
            else if (json.status == 430) {
                util.layerAlert("", util.getLan("add16"), 2);
            }
            else if (json.status == 434) {
                util.layerAlert("", util.getLan("add17"), 2);
            }
            else if (json.status == 435) {
                util.layerAlert("", util.getLan("add16"), 2);
            }else if (json.status == 440) {
                util.layerAlert("", util.getLan("add22"), 2);
            }
            else if (json.status == 437) {
                var tips = util.getLan("add14");
                util.layerAlert("", tips, 1,function(){
                    $('#icoSubmit').css({
                        background:'#ccc',
                        borderColor: '#ccc'
                    }).off('click');
                });
            }
            else {
                util.layerAlert("", json.message, 2);
            }
        }
    });
}

//获取汇率
function getRate(type) {
    $('#txtFinancesCount').val('');
    $.ajax({
        url: moneyRateUrl,
        type: 'post',
        dataType: 'json',
        data: {
            data: JSON.stringify({
                type: type,
                user_name: localStorage.user_name
            }),
            sessionid: localStorage.sessionid,
            token: localStorage.token,
            timestamp: new Date().getTime(),
            user_name: localStorage.user_name
        },
        success: function (json) {
            console.log('汇率信息:' + type, json);
            var nowTimeNumber = Date.parse(new Date());
            var lastTimeNumber = json.data.last_time;
            console.log('现在的时间:',formatDate(nowTimeNumber),'最后的时间:',formatDate(lastTimeNumber));
            if (json.status == 0) {
                var data = json.data.moneyRate;
                rateData.type = data.type;
                rateData.step = data.step;
                rateData.number = data.number;
                rateData.rate = parseInt(data.rate);
                var rate = data.number + '*' + data.rate;
                $('#rateValue').text(rate);
                $('#btcbalance').val(data.money);
                $('#icoCount').text(data.max_buy);
            }
            //未开放购买的时间
            else if (json.status == 420) {
                var tips = util.getLan("add14");
                if(nowTimeNumber > lastTimeNumber){
                    tips = util.getLan("add15");
                }
                util.layerAlert("", tips, 1,function(){
                    $('#icoSubmit').css({
                        background:'#ccc',
                        borderColor: '#ccc'
                    }).off('click');
                });
            }
            else if (json.status == 431 || json.status == 402 || json.status == 430) {
                console.log('message:', json.message);
                util.layerAlert("", util.getLan("add4"), 2, function () {
                    location.href = 'login.html';
                });
            }
            else {
                util.layerAlert("", json.message, 2);
            }
        }
    });
}