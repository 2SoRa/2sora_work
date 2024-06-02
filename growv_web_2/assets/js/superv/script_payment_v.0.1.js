/*도메인 설정*/
var paymentUrl = 'https://dev-admin.superv.com';
var thisUrlCheck = new URL(location.href).host;
if(thisUrlCheck.indexOf('dev') != -1){
    paymentUrl = 'https://dev-admin.superv.com';
}else if(thisUrlCheck.indexOf('reading.superv.com') != -1){
    paymentUrl = 'https://admin.superv.com';
}
/*

const today = new Date();
// 84개월전
var studentStartDate = new Date(today.getFullYear()-6, today.getMonth(), today.getDate());
// 34개월전
var studentEndDate = new Date(today.getFullYear(), today.getMonth() - 34, today.getDate());

let minYear = studentStartDate.getFullYear();
let maxYear = studentEndDate.getFullYear();
let minMonth = 1;
let maxMonth = 12;
let minDay = 1;
let maxDay = 31;
*/

var thisStudentId;
var thisProdId;
var thisProdnm;
/*2023.03.29 해지환급금 관력 추가-유희목*/
var thisPayDiv;
var thisOrderAmt;
var revokeOrderId;
var revokeDetailUid;
var revokeTypeCd;
var thisOrderCartUid;
var thisPayTypeCd = 1;
var deliveryId;
var paymentParentId;
var paymentCheck = false;

$(document).ready(function () {
    fnLoginCheck();
    /*if(!fnLoginCheck()){
        alert("로그인 후 진행해주세요.");
        common.hrefFunction('/main/login');
        return;
    }*/
    const urlParams = new URL(location.href).searchParams;
    const prodId = urlParams.get('prodId');
    /*상품정보 가져오기*/
    if(common.isNull(prodId)) {
        alert("상품을 먼저 선택해주세요");
        common.hrefFunction("/pages/product/product.html");
    }
    var jwtTokcen = jwt.getAllToken();
    var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
    if (!common.isNull(userInfo) && !common.isNull(userInfo.parentId)) {
        paymentParentId = userInfo.parentId;
        /*장바구니 상품 검증하기*/
        const orderCartUid = urlParams.get('orderCartUid');
        if (orderCartUid != null && orderCartUid != '') {
            thisOrderCartUid = orderCartUid;
            /*상품 구매가능 상태 확인*/
            const buyCheck = function (response1) {
                /*2023.03.29 해지환급금 추가-유희목*/
                thisPayDiv = response1.data.payDiv;
                if(thisPayDiv == "T"|| thisPayDiv == "C"){
                    $("[name='orderInfoWrap']").remove();
                }
                $('.container').show();
                thisOrderAmt = response1.data.orderAmt;
                revokeOrderId = response1.data.revokeOrderId;
                revokeDetailUid = response1.data.revokeDtlUid;
                revokeTypeCd = response1.data.revokeTypeCd;
                thisStudentId = response1.data.studentId;
                if (response1.code == "200") {
                    if (!response1.data.status) {
                        if (response1.data.msg != null) {
                            alert(response1.data.msg);
                        }else{
                            alert("장바구니 정보가 존재하지 않습니다.");
                        }
                        common.hrefFunction("/pages/product/product.html");
                    } else {
                        thisPayTypeCd = response1.data.payTypeCd;
                        getProdInfo(prodId);
                    }
                } else {
                    if (response1.data.msg != null) {
                        alert(response1.data.msg);
                        common.hrefFunction("/pages/product/product.html");
                    } else {
                        alert("상품 정보가 존재하지 않습니다.");
                        common.hrefFunction("/pages/product/product.html");
                    }
                }
            }
            let data3 = {
                "parentId": paymentParentId,
                "orderCartUid": orderCartUid
            };
            data3 = JSON.stringify(data3);
            /*23.07.20*/
            com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/mypage/cart/check', data3, buyCheck);
        } else {
            /*장바구니 외 일반 상품 검증하기*/
            /*상품 구매가능 상태 확인*/
            const productCheck = function (proResponse) {
                if (proResponse.code == "200") {
                    if (!proResponse.data.returnCheck) {
                        if (!common.isNull(proResponse.data.msg)) {
                            alert(proResponse.data.msg);
                            common.hrefFunction("/pages/product/product.html");
                        }
                    } else {
                        getProdInfo(prodId);
                    }
                }else {
                    if (proResponse.message != null) {
                        alert(proResponse.message);
                        common.hrefFunction("/pages/product/product.html");
                    } else {
                        alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                    }
                    return false;
                }
            }
            let proData = {
                "prodId": prodId,
            };
            proData = JSON.stringify(proData);
            /*23.07.20*/
            com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/product/product/check', proData, productCheck);
        }
    }else{
        alert("로그인 후 진행해주세요.");
        common.hrefFunction('/main/login');
        return;
    }
    fnGetMemInfoForexpRequest();
})

function fnSubmitPay(){
    if(thisPayDiv != "T" && thisPayDiv != "C"){
        thisStudentId = $("[name='child']:checked").val();
    }

    if(common.isNull(thisStudentId)){
        alert("결제할 자녀를 선택해 주세요.");
        $("#paymentBtn").addClass('disabled');
        $("[name='paymentBtn']").addClass('disabled');
        return false;
    }
    if(!paymentCheck){
        alert("상품 정보가 없습니다.");
        $("#paymentBtn").addClass('disabled');
        $("[name='paymentBtn']").addClass('disabled');
        common.hrefFunction("/pages/product/product.html");
        return false;
    }
    if(thisPayDiv == "T"|| thisPayDiv == "C"){
        fnGetRevokePay();
    }else{
        /*배송정보 저장하기*/
        var device = "pc";
        const res = function (response) {
            if (response.code == "200") {
                var UserAgent = navigator.userAgent;
                if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
                    device = 'mobile';
                }
                deliveryId = response.data;
                var appendHtml = '';
                if(thisOrderCartUid != null && thisOrderCartUid != ''){
                    if(thisPayTypeCd == '1'){
                        appendHtml = '<iframe style="z-index:999;overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px" src="'+paymentUrl+'/payment.html#/billkey?prodId='+thisProdId+'&parentId='+paymentParentId+'&studentId='+thisStudentId+'&deliveryId='+deliveryId+'&device='+device+'&orderCartUid='+thisOrderCartUid+'"></iframe>';
                    }else{
                        appendHtml = '<iframe style="z-index:999;overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px" src="'+paymentUrl+'/payment.html#/card?prodId='+thisProdId+'&parentId='+paymentParentId+'&studentId='+thisStudentId+'&deliveryId='+deliveryId+'&device='+device+'&orderCartUid='+thisOrderCartUid+'"></iframe>';
                    }
                }
                else{
                    if(thisPayTypeCd == '1'){
                        appendHtml = '<iframe style="z-index:999;overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px" src="'+paymentUrl+'/payment.html#/billkey?prodId='+thisProdId+'&parentId='+paymentParentId+'&studentId='+thisStudentId+'&deliveryId='+deliveryId+'&device='+device+'"></iframe>';
                    }else{
                        appendHtml = '<iframe style="z-index:999;overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px" src="'+paymentUrl+'/payment.html#/card?prodId='+thisProdId+'&parentId='+paymentParentId+'&studentId='+thisStudentId+'&deliveryId='+deliveryId+'&device='+device+'"></iframe>';
                    }
                }
                $("#replaceIframe").html(appendHtml);
                $("#payPop").show();
                document.querySelector('body').style.overflow = 'hidden';
            } else {
                if (response.message != null) {
                    alert(response.message);
                } else {
                    alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                }
                return false;
            }
        }
        var zipcode = $("#zipcode").val();
        var address1 = $("#address1").val();
        var address2 = $("#address2").val();
        if(common.isNull(zipcode)){
            $('[name="addrMsg"]').html("배송 주소를 입력해주세요.");
            $('[name="addrMsg"]').show();
            return false;
        }
        if(common.isNull(address2)){
            $('[name="addrMsg"]').html("상세주소를 입력해 주세요.");
            $('[name="addrMsg"]').show();
            return false;
        }
        var recvClientNm = $("[name='recvClientNm']").val();
        var recvPhoneNo = $("[name='recvPhoneNo']").val();
        var deliveryMemo = $("[name='recvMemo']").val();
        if(deliveryMemo == '6'){
            deliveryMemo = $('[name="recvMemoTextPart"]').val();
        }
        let deviceCaseDiv = $("[name='deviceCaseDiv']:checked").val();
        // TODO : 선택된 input 부모 label active 시키기
        if(common.isNull(deviceCaseDiv)){
            alert("태블릿 케이스를 선택해주세요.");
            return false;
        }
        let agreeCheck = $("[name='agreeCheck']:checked").val();
        if(common.isNull(agreeCheck)){
            alert("약정상품 구매 및 환불 규정에 동의해 주세요.");
            return false;
        }
        let data = {
            'parentId':paymentParentId,
            'zipcode' :zipcode,
            'adr1' : address1,
            'adr2' : common.decodeHTMLEntities(address2),
            'recvClientNm' :recvClientNm,
            'recvPhoneNo' : recvPhoneNo,
            'deliveryMemo' : deliveryMemo,
            'deviceCaseDiv' : deviceCaseDiv
        };
        data = JSON.stringify(data);
        /*23.07.20*/
        com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/parent/delivery', data, res);
    }
}
$(document).on("change", "[name='recvMemo']", function (){
    var thisVal = $(this).val();
    if(thisVal == '6'){
        $('[name="recvMemoTextPart"]').show();
    }else{
        $('[name="recvMemoTextPart"]').hide();
    }
})

/*학부모 이름 20byte, 영문, 한글 확인.*/
$(document).on('keyup click keydown', '[name="recvClientNm"]', function (){
    $(this).val(common.nameCheck($(this).val()));

});
window.addEventListener('message', function(e) {
    if(!common.isNull(e.data.message)){
        $("#payPop").hide();
        alert("결제 중 오류가 발생했습니다.\n잠시 후 다시 결제 진행하시기 바랍니다.\n");
        console.log(e.data.message);
        document.querySelector('body').style.overflow = 'auto';
    }else if(e.data == 'cancel'){
        $("#payPop").hide();
        document.querySelector('body').style.overflow = 'auto';
    }else if(e.data == 'success'){
        if(!common.isNull(revokeOrderId)){
            common.hrefFunction('/pages/payment/order-result.html?revokeDtlUid='+revokeDetailUid);
        }else{
            common.hrefFunction('/pages/payment/order-result.html?deliveryId='+deliveryId);
        }
    }else if(e.data == 'close'){
        $("#payPop").hide();
        document.querySelector('body').style.overflow = 'auto';
    }else if(e.data == 'fail'){
        $("#payPop").hide();
        document.querySelector('body').style.overflow = 'auto';
    }/*else{
        $("#payPop").hide();
        document.querySelector('body').style.overflow = 'auto';
    }*/

});

function getProdInfo(prodId){
    /*상품정보 가져오기*/
    const res = function (response) {
        if (response.code == "200") {
            var retunrMap = response.data;
            thisProdId = prodId;
            thisProdnm = retunrMap.prodNm;

            var html = '';
            html += '<li name="prodId">';
            html += '<a>';
            if(thisPayDiv == "T"){
                if(revokeTypeCd == "1"){
                    html += '<div class="cate wide">해지환급금</div>';
                }else{
                    html += '<div class="cate wide">추가납입금</div>';
                }
                $("[name='agreeCheck']").prop("checked", true);
                $("#paymentBtn").removeClass('disabled');
                $("[name='paymentBtn']").removeClass('disabled');
            }else if(thisPayDiv == "C"){
                html += '<div class="cate wide">취소청구금</div>';
                $("[name='agreeCheck']").prop("checked", true);
                $("#paymentBtn").removeClass('disabled');
            }else{
                html += '<div class="cate">약정</div>';
            }
            html += '<div class="stit"><strong>' + retunrMap.prodNm + '</strong>';
            /*                        html += '[상품 금액] 월 <span>'+monthpay+'</span>원 X <span>'+retunrMap.studyMonthdayCn+'</span>개월';*/
           if(thisPayDiv == "T" || thisPayDiv == "C"){
               var orderAmtPay = common.comma(thisOrderAmt);
               html += '<br>[금액] <span>' + orderAmtPay + '</span>원';
           }else if(String(thisPayTypeCd) == '1'){
               var monthpay = common.comma(retunrMap.monthpayPrice);
               html += '<br>[상품 금액] 월 <span>' + monthpay + '</span>원';
            }else{
                var lumppayPrice = common.comma(retunrMap.lumppayPrice);
                html += '<br>[상품 금액] 일시납 <span>' + lumppayPrice + '</span>원';
            }
            html += '</div>';
            html += '</a>';
            html += '</li>';
            $('[name="htmlPart"]').html(html);
            $('.container').show();
            paymentCheck = true;
        } else {
            if (response.message != null) {
                alert(response.message);
                common.hrefFunction("/pages/product/product.html");
            } else {
                alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            }
            return false;
        }
    }
    let data = {
        "prodId": prodId,
    };
    data = JSON.stringify(data);
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/product/product/Info', data, res);
}

function fnGetRevokePay(){
    var UserAgent = navigator.userAgent;
    var device = 'pc';
    if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
        device = 'mobile';
    }
    var appendHtml = '';
    if(thisOrderCartUid != null && thisOrderCartUid != ''){
        appendHtml = '<iframe style="z-index:999;overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px" ' +
            'src="'+paymentUrl+'/payment.html#/cardRevoke?parentId='+paymentParentId+'&studentId='+thisStudentId+'&revokeOrderId='+revokeOrderId+'&uid='+revokeDetailUid+'&device='+device+'&orderCartUid='+thisOrderCartUid+'"></iframe>';
    }
    else{
        appendHtml = '<iframe style="z-index:999;overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px" ' +
            'src="'+paymentUrl+'/payment.html#/cardRevoke?parentId='+paymentParentId+'&studentId='+thisStudentId+'&revokeOrderId='+revokeOrderId+'&uid='+revokeDetailUid+'&device='+device+'"></iframe>';
    }

    $("#replaceIframe").html(appendHtml);
    $("#payPop").show();
    document.querySelector('body').style.overflow = 'hidden';
}


function fnGetMemInfoForexpRequest(){
    $("[name='recommendDiv']").hide();
    $("[name='inviteRecommMdnNoPart']").hide();
    $(".pop_contents").addClass("member");
    var jwtTokcen = jwt.getAllToken();
    var checkLogin = 0;
    if(!common.isNull(jwtTokcen.getItem("vuex"))) {
        var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
        paymentParentId = userInfo.parentId;
        if(!common.isNull(paymentParentId)){
            checkLogin++;
            const res = function(response) {
                if(response.message == "OK"){
                    var thisData = response.data;
                    if(thisData.code == "200"){
                        $("[name='recvClientNm']").val(thisData.data.parentNm);
                        $("[name='recvPhoneNo']").val(thisData.data.mdnNo);
                        $("#zipcode").val(thisData.data.zipcode);
                        $("#address1").val(thisData.data.adr1);
                        $("#address2").val(thisData.data.adr2);
                        var childGroup = "";
                        var stuList = thisData.data.stuInfos;
                        stuCnt = stuList.length;
                        if(stuCnt >=3){
                            $("#addChildBtn").remove();
                        }
                        $.each(stuList, function (i, item) {
                            var childId = "child0"+i;
                            childGroup += '<label For="'+childId+'" class="radiobox_label'
                            if(item.stateCd == "2"){
                                childGroup += ' disabled';
                            }
                            childGroup += '">';
                            childGroup += '<input type="radio" name="child" class="radiobox_item" id="'+childId+'" value="'+item.studentId+'">';
                            childGroup += item.studentNm;
                            childGroup += '</label>';
                        })
                        if(stuCnt < 3) {
                            childGroup += " <button class=\"child_plus\" onclick=\"fnOpenAddChildPop();\" id=\"addChildBtn\">자녀 추가</button>"
                        }
                        $(".child_group").html(childGroup);
                    }else{
                        checkLogin = 0;
                        if(!common.isNull(thisData.msg)){
                            alert(thisData.msg);
                        }else{
                            alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                        }
                    }
                }else{
                    alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                    return false;
                }
            }
            let data = {
                "parentId" :paymentParentId
            }
            /*23.07.20*/
            com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/exp/member/student', JSON.stringify(data), res);
        }

    }
    if(checkLogin == 0){
        fnInitPhoneForm();
        return false;
    }
}

function fnReLoadChildInfo(){
    fnGetMemInfoForexpRequest();
}
$(document).on('keyup click keydown', '[name="agreeCheck"]', function (){
    let agreeCheck = $('[name="agreeCheck"]:checked').val();
    let thisStudentIdPage = $("[name='child']:checked").val();
    if(common.isNull(agreeCheck) || common.isNull(thisStudentIdPage)){
        $("#paymentBtn").addClass('disabled');
        $("[name='paymentBtn']").addClass('disabled');
    }else{
        $("#paymentBtn").removeClass('disabled');
        $("[name='paymentBtn']").removeClass('disabled');
    }
});
$(document).on('keyup click keydown change', '[name="child"]', function (){
    let agreeCheck = $('[name="agreeCheck"]:checked').val();
    let thisStudentIdPage = $("[name='child']:checked").val();
    if(common.isNull(agreeCheck) || common.isNull(thisStudentIdPage)){
        $("#paymentBtn").addClass('disabled');
        $("[name='paymentBtn']").addClass('disabled');
    }else{
        $("#paymentBtn").removeClass('disabled');
        $("[name='paymentBtn']").removeClass('disabled');
    }
});