var deliveryId;
var revokeDtlUid;
var revokeOrderId;
var parentId;

$(document).ready(function () {
    const urlParams = new URL(location.href).searchParams;
    deliveryId = urlParams.get('deliveryId');
    revokeDtlUid = urlParams.get('revokeDtlUid');
    revokeOrderId = urlParams.get('revokeOrderId');
    if(common.isNull(deliveryId) && common.isNull(revokeDtlUid) && common.isNull(revokeOrderId)){
        alert("상품정보가 없습니다. 관리자에게 문의하시기 바랍니다.");
        common.hrefFunction('/main.html');
    }
    var jwtTokcen = jwt.getAllToken();
    if (!common.isNull(jwtTokcen.getItem(ACCESS_TOKEN_NAME)) && !common.isNull(jwtTokcen.getItem(EXPIRED_TIME_NAME)) && !common.isNull(jwtTokcen.getItem(REFRESH_TOKEN_NAME))) {
        var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
        if (!common.isNull(userInfo.parentId)) {
            parentId = userInfo.parentId;
            if(!common.isNull(revokeDtlUid)){
                $("[name='orderInfoWrap']").remove();
                fnGetRevokeInfo();
            }else if(!common.isNull(revokeOrderId)){
                $("[name='orderInfoWrap']").remove();
                fnGetPayAddInfo();
            }else {
                /*상품정보 가져오기*/
                const res = function (response) {
                    if (response.code == "200") {
                        var returnData = response.data;
                        var prodNm = returnData.prodNm;
                        $('[name="prodNm"]').html(prodNm);
                        var studentNm = returnData.studentNm;
                        $('[name="deliveryStudentNm"]').html(studentNm);
                        var recvClientNm = returnData.recvClientNm;
                        $('[name="deliveryNm"]').html(recvClientNm);
                        var recvPhoneNo = returnData.recvPhoneNo;
                        $('[name="deliveryPhone"]').html(recvPhoneNo);
                        var addrZim = returnData.zipcode;
                        var addr1 = returnData.adr1;
                        var addr2 = returnData.adr2;
                        var deliveryHtml = '';
                        deliveryHtml += recvClientNm + "   " + common.dashForPhone(recvPhoneNo) + "</br>";
                        deliveryHtml += addr1 + '</br>';
                        deliveryHtml += addr2 + '</br>';
                        $('[name="deliveryAddr"]').html(deliveryHtml);
                        var deviceCaseDiv = returnData.deviceCaseDiv;
                        if (deviceCaseDiv == '1') {
                            $('[name="deviceCaseNm"]').html('슈키');
                        } else {
                            $('[name="deviceCaseNm"]').html('이비');
                        }
                        var cardNm = returnData.cardNm;
                        $('[name="cardNm"]').html(cardNm);
                        var monthPayPrice = returnData.monthPayPrice;
                        var studyMonthdayCn = returnData.studyMonthdayCn;
                        var invoiceDay = returnData.invoiceDay;
                        if (common.isNull(invoiceDay)) {
                            const today = new Date();
                            invoiceDay = today.getDate();
                        }
                        if (String(returnData.payTypeCd) == "1") {
                            $('[name="payTypeMonth"]').show();
                            $('[name="payDay"]').html(invoiceDay);
                            $('[name="monthPay"]').html(common.comma(monthPayPrice));
                            $('[name="monthCn"]').html(studyMonthdayCn);
                        } else {
                            $('[name="payTypeCard"]').show();
                            $('[name="monthPay"]').html(common.comma(returnData.lumppayPrice));
                        }
                    } else {
                        if (response.message != null) {
                            alert(response.message);
                            common.hrefFunction('/main.html');
                            return false;
                        } else {
                            alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                            common.hrefFunction('/main.html');
                        }
                        return false;
                    }
                }
                let data = {
                    "deliveryId": deliveryId,
                    "parentId": parentId,
                };
                data = JSON.stringify(data);
                /*23.07.20*/
                com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/mypage/payment/info', data, res);
            }
        } else {
            alert("로그인 후 진행해주세요.");
            common.hrefFunction("/member/login.html");
            return false;
        }
    } else {
        alert("로그인 후 진행해주세요.");
        common.hrefFunction("/member/login.html");
        return false;
    }

})

function fnGetRevokeInfo(){
    const res = function (response) {
        if (response.code == "200") {
            $("[name='deliveryStudentNm']").html(response.data.studentNm);
            $("[name='prodNm']").html(response.data.prodNm);
            $("[name='monthPay']").html(common.comma(response.data.orderAmt));
            $("[name='payTypeRevoke']").show();
            $(".cate").addClass("wide");
            if(response.data.revokeTypeCd == "1") {
                $(".cate").html("해지반환금");
            }else {
                $(".cate").html("추가납입금");
            }
        }else {
            alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            common.hrefFunction('/main.html');
        }
    }
    let data = {
        "revokeDtlUid": revokeDtlUid,
        "parentId": parentId,
    };
    data = JSON.stringify(data);
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/mypage/revoke/info', data, res);
}
function fnGetPayAddInfo(){
    const res = function (response) {
        if (response.code == "200") {
            $("[name='deliveryStudentNm']").html(response.data.studentNm);
            $("[name='prodNm']").html(response.data.prodNm);
            $("[name='monthPay']").html(common.comma(response.data.orderAmt));
            $("[name='payTypeRevoke']").show();
            $(".cate").addClass("wide");
            $(".cate").html("취소청구금");
        }else {
            alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            common.hrefFunction('/main.html');
        }
    }
    let data = {
        "revokeOrderId": revokeOrderId,
        "parentId": parentId,
    };

    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/mypage/payadd/info', JSON.stringify(data), res);
}