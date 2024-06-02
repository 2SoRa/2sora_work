/*도메인 설정*/
var easypayUrl = 'http://testoffice.easypay.co.kr/mcht/receipt/CardReceiptAction.do';
var thisUrlCheck = new URL(location.href).host;
if(thisUrlCheck.indexOf('dev') != -1){
    easypayUrl = 'http://testoffice.easypay.co.kr/mcht/receipt/CardReceiptAction.do';
}else if(thisUrlCheck.indexOf('www.superv.com') != -1){
    easypayUrl = 'http://office.easypay.co.kr/mcht/receipt/CardReceiptAction.do';
}

var totalCnt = 0;
$(document).ready(function (){
/*$(window).on('load', function() {*/
    const urlParams = new URL(location.href).searchParams;
    var jwtTokcen = jwt.getAllToken();
    var parentId = null;
    if (!common.isNull(jwtTokcen.getItem(ACCESS_TOKEN_NAME)) && !common.isNull(jwtTokcen.getItem(EXPIRED_TIME_NAME)) && !common.isNull(jwtTokcen.getItem(REFRESH_TOKEN_NAME))) {
        var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
        if(!common.isNull(userInfo.parentId)){
            parentId = userInfo.parentId;
            /*상품정보 가져오기*/
            const res = function (response) {
                if (response.code == "200") {
                    var returnData = new Array();
                    returnData = response.data;
                    var myPaymentPartHtml = '';
                    if (returnData.length > 0) {
                        $.each(returnData, function (index, item) {
                            if(!common.isNull(item.payApprovalDtm)){
                            myPaymentPartHtml += '<li>';
                            myPaymentPartHtml += '<div class="mtit">';
                                myPaymentPartHtml += item.payApprovalDtm.substring(0,10);

                            myPaymentPartHtml += '</div>';
                            myPaymentPartHtml += '<div class="paym-cont-wrap">';
                            if(item.orderStateCd == '2' || item.orderStateCd == '4' || item.payStateCd == '5' || item.payStateCd == '6'){
                                myPaymentPartHtml += '<div class="mpic" style="background:url(../images/etc/etc-payment-status-cancel.svg)"></div>';
                            }else {
                                myPaymentPartHtml += '<div class="mpic" style="background:url(../images/etc/etc-payment-status-complete.svg)"></div>';
                            }
                            myPaymentPartHtml += '<div class="mcont">';
                            myPaymentPartHtml += '<div class="mname">'+item.payerNm+'</div>';
                            if(item.lumppayTypeCd == "2"){
                                myPaymentPartHtml += '<div class="mdesc">[해지반환금] '+item.prodNm+'</div>';
                            }else if(item.lumppayTypeCd == "3"){
                                myPaymentPartHtml += '<div class="mdesc">[추가납입금] '+item.prodNm+'</div>';
                            }else if(item.lumppayTypeCd == "5"){
                                myPaymentPartHtml += '<div class="mdesc">[취소청구금] '+item.prodNm+'</div>';
                            }else{
                                myPaymentPartHtml += '<div class="mdesc">'+item.prodNm+'</div>';
                            }
                            myPaymentPartHtml += '</div>';
                            if(!common.isNull(item.pgConnNo) && !common.isNull(item.batchSeq)) {
                                myPaymentPartHtml += '<div class="cnt"><strong>' + item.batchSeq + '회차</strong> / ' + item.studyMonthdayCn + '회자</div>';
                            }else{
                                myPaymentPartHtml += '<div class="cnt"><strong>일시납</strong></div>';
                            }
                            myPaymentPartHtml += '</div>';
                            myPaymentPartHtml += '<div class="paym-bottom-wrap">';

                            if(!common.isNull(item.invoiceAmt)){
                                    myPaymentPartHtml += '<div class="price">';
                                    myPaymentPartHtml += common.comma(item.invoiceAmt)+'원';
                                    myPaymentPartHtml +='</div>';
                            }else if(!common.isNull(item.payApprovalAmt)){
                                myPaymentPartHtml += '<div class="price">';
                                myPaymentPartHtml += common.comma(item.payApprovalAmt)+'원';
                                myPaymentPartHtml +='</div>';
                            }else if(!common.isNull(item.payAmt)){
                                myPaymentPartHtml += '<div class="price">';
                                myPaymentPartHtml += common.comma(item.payAmt)+'원';
                                myPaymentPartHtml +='</div>';
                            }

                            myPaymentPartHtml += '<div class="card">';
                            myPaymentPartHtml += '<div class="key">'+item.cardNm+'</div>';
                            if(!common.isNull(item.pgConnNo) && !common.isNull(item.batchSeq)){
                                myPaymentPartHtml += '<button type="button" onclick="fnGetRecipt(\''+item.pgConnNo+'\', \''+item.batchSeq+'\');">영수증</button>';
                            }else if(!common.isNull(item.pgConnNo)) {
                                myPaymentPartHtml += '<button type="button" onclick="fnGetRecipt(\''+item.pgConnNo+'\', \'\');">영수증</button>';
                            }
                            myPaymentPartHtml += '</div>';
                            myPaymentPartHtml += '<div class="order-num">';
                            myPaymentPartHtml += '<div class="key">주문번호</div>';
                            myPaymentPartHtml += '<div class="value">'+item.orderId+'</div>';
                            myPaymentPartHtml += '</div>';
                            myPaymentPartHtml += '</div>';
                            myPaymentPartHtml += '</li>';
                            }
                        })
                    }else{
                        myPaymentPartHtml = '<li>';
                        myPaymentPartHtml += '<div class="nodata">';
                        myPaymentPartHtml += '<img src="../images/icon/ico-payment-nodata.svg"/>';
                        myPaymentPartHtml += '<span>결제 정보가 없습니다.</span>';
                        myPaymentPartHtml += '</div>';
                        myPaymentPartHtml += '</li>';
                    }

                    $('[name="myPaymentPart"]').html(myPaymentPartHtml);
                } else {
                    if (response.message != null) {
                        alert(response.message);
                        common.hrefFunction('/main.html');
                        return false;
                    } else {
                        alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                    }
                    return false;
                }
            }
            let data = {
                "parentId": parentId,
            };
            data = JSON.stringify(data);
            /*23.07.20*/
            com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/mypage/payment/list', data, res);
        }else{
            alert("로그인 후 진행해주세요.");
            common.hrefFunction("/member/login.html");
            return false;
        }
    }else{
        alert("로그인 후 진행해주세요.");
        common.hrefFunction("/member/login.html");
        return false;
    }

})
function fnGetRecipt(controlNo, payment){
    if(parseInt(payment) < 10){
        payment = "0"+payment;
    }
    window.open(easypayUrl+"?controlNo="+controlNo+"&payment="+payment,'_blank', 'width=900,height=1000');
}
