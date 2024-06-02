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
let thisCertCheck = false;
var timerInterval = null;
/*휴대전화번호 확인.*/
$(document).on('keyup', '[name="inquiryMdnNo"]', function (){
    $(".error-msg").removeClass("on");
    var curVal = $(this).val().replaceAll("-", "");
    $('[name="inquiryMdnNo"]').val(curVal);
    const numPattern = /^[0-9]+$/;
    if (!numPattern.test($('[name="inquiryMdnNo"]').val())) {
        curVal = curVal.replace(/[^0-9]/g,'');
    }
    /*10글자 확인*/
    if($('[name="inquiryMdnNo"]').val().length > 11){
        curVal = curVal.substring(0, 11);
    }
    $("[name='inquiryMdnNo']").val(curVal);
    if(curVal.length == 11){
        $("#consultCertBtn").attr("disabled", false);
    }
})

function fnGetCert(){
    if(!common.isNull($("[name='inquiryMdnNo']").val())){
        $("#checkMdnNo").hide();
        const res = function(response) {
            if(response.code == "200"){
                thisCertCheck = false;
                fnGetTime(180);
            }else{
                alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                return false;
            }
        }
        let data = {"mdnNo" : $("[name='inquiryMdnNo']").val()};
        /*23.07.20*/
        com_ajax.ajax('post', '/clientsvc/account/v1/web/sms/cert/send', JSON.stringify(data), res);
    }else{
        alert("휴대폰번호를 입력해 주세요.");
    }
}

function fnGetTime(restTime){
    $("#certPart").removeClass("hide");
    $('#consultCertBtn').attr('disabled', true);
    $('[name="inquiryMdnNo"]').attr('disabled', true);
    $('#consultCertConfirmBtn').attr('disabled', true);
    $('#consultCertValue').attr('disabled', false);
    restTime = parseInt(restTime);
    var timer = restTime, minutes, seconds;
    timerInterval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        $('#consultCertTime').html(minutes + ":" + seconds);

        if (--timer < 0) {

            $('#checkMdnNo').html("인증번호 입력 시간이 만료되었습니다. 다시 요청해 주세요.");
            $("#certPart").addClass("hide");
            $('#checkMdnNo').show();
            clearInterval(timerInterval);
            $('#consultCertBtn').attr('disabled', false);
            $('[name="inquiryMdnNo"]').attr('disabled', false);
            $('#consultCertConfirmBtn').attr('disabled', false);
            $('#consultCertValue').attr('disabled', true);

            return false;
        }
    }, 1000);
}
/*인증번호 한글 확인.*/
$(document).on('keyup click keydown', '#consultCertValue', function (){
    var curVal = $(this).val();
    var regex = /^[0-9]+$/;
    /*한글/영문만 입력가능*/
    if(!regex.test(curVal)){
        $("#consultCertValue").val(curVal.slice(0, curVal.length-1));
    }

    curVal = $("#consultCertValue").val();
    if(curVal.length > 4){
        $("#consultCertValue").val(curVal.slice(0, curVal.length-1));
        $('#consultCertConfirmBtn').attr('disabled', true);
    }else{
        $('#consultCertConfirmBtn').attr('disabled', true);
    }
    curVal = $("#consultCertValue").val();
    if(curVal.length == 4){
        $('#consultCertConfirmBtn').attr('disabled', false);
    }
});
/*인증번호 확인*/
$(document).on('click', '#consultCertConfirmBtn', function(){
    var mdnNo= $("[name='inquiryMdnNo']").val();
    var certNo = $("#consultCertValue").val();
    if(mdnNo == null || mdnNo == ""){
        $('#checkMdnNo').html("휴대폰 번호를 입력해주세요.");
        $('#checkMdnNo').show();
        $("[name='inquiryMdnNo']").focus();
        return false;
    }
    if(certNo == null || certNo == ""){
        $('#checkMdnNo').html("인증번호를 입력해주세요.");
        $('#checkMdnNo').show();
        $("#consultCertValue").focus();
        return false;
    }

    $('[name="checkMdnNo"]').hide();

    const res = function(response) {
        if(response.code == "200"){
            if(response.message == "OK"){

                clearInterval(timerInterval);
                $('#consultCertBtn').attr('disabled', true);
                $('[name="inquiryMdnNo"]').attr('disabled', true);
                $('#consultCertConfirmBtn').attr('disabled', true);
                $('#consultCertValue').attr('disabled', true);
                $('#checkMdnNo').html("인증되었습니다.");
                $('#checkMdnNo').show();
                thisCertCheck = true;
            }else{
                $('#checkMdnNo').html("인증번호가 일치하지 않습니다. 다시 인증해주세요.");
                thisCertCheck = false;
                $('#checkMdnNo').show();
                return false;
            }
        }else{
            alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            return false;
        }
    }
    let data = {"mdnNo" : mdnNo, "certNo" : certNo};
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/account/v1/web/sms/cert/check',  JSON.stringify(data), res);

});

/*학부모 이름 20byte, 영문, 한글 확인.*/
$(document).on('keyup', '[name="inquiryParentNm"]', function (){
    $(".error-msg").removeClass("on");
    var curVal = $(this).val();
    var pattern = /[\u3131-\u314e|\u314f-\u3163|\uac00-\ud7a3]/g;
    var koreanLangCnt = !!curVal.match(pattern) ? curVal.match(pattern).length : 0;
    var etcLangCnt = curVal.length - koreanLangCnt;
    var koreanLangByte = koreanLangCnt * 2;
    var etcLangByte = etcLangCnt;
    var totalCnt = koreanLangByte + etcLangByte;
    var regex =  /^[ㄱ-ㅎㅏ-ㅣ가-힣ㅣ\u318Dㅣ\u119Eㅣ\u11A2ㅣ\u2022ㅣ\u2025ㅣ\u00B7ㅣ\uFE55|a-z|A-Z]+$/;
    /*한글/영문만 입력가능*/
    if(!regex.test(curVal)){
        curVal = curVal.slice(0, curVal.length-1)
    }
    curVal = curVal.replace(/[1-9]/gi, '');
    /*20Byte 체크*/
    //남은 바이트수를 표시 하기
    if(totalCnt > 20){
        while(totalCnt > 20){
            curVal = curVal.substring(0, curVal.length-1);
            totalCnt = getByte(curVal);
        }
    }
    $(this).val(curVal);

});
/*
2023.06.23 공통으로변경
function getByte(str) {
    let resultSize = 0;
    if (str == null) {
        return 0;
    }
    for (let i = 0; i < str.length; i++) {
        let c = escape(str.charAt(i));
        if (c.length == 1) {
            resultSize++;
        } else if (c.indexOf("%u") != -1) {
            resultSize += 2;
        } else {
            resultSize++;
        }
    }
    return resultSize;
}
*/


function fnSetInquiry(){
    $(".error-msg").removeClass("on");
    var parentNm = $("[name='inquiryParentNm']").val();
    if(common.isNull(parentNm)){
        $("[name='inquiryParentNm']").parent("div").siblings(".error-msg").addClass("on");
        alert("학부모이름을 입력해 주세요.");
        return false;
    }
    var mdnNo = $("[name='inquiryMdnNo']").val();
    if(common.isNull(mdnNo) || mdnNo.length != 11){
        $("[name='inquiryMdnNo']").parent("div").siblings(".error-msg").addClass("on");
        alert("휴대폰 번호를 올바르게 입력해 주세요.");
        return false;
    }
    var certNo = $("#consultCertValue").val();
    if(certNo == null || certNo == "" || !thisCertCheck){
        alert("휴대폰 인증을 진행해 주세요.");
        $('#checkMdnNo').html("인증번호를 입력해 주세요.");
        $('#checkMdnNo').show();
        $("#consultCertValue").focus();
        return false;
    }
    let yearSel = $('[name="yearSel"]').val();
    if(yearSel == null || yearSel == "" || yearSel == "0"){
        alert("자녀 생년월일을 입력해 주세요.");
        return false;
    }

    let monthSel = $('[name="monthSel"]').val();
    if(monthSel == null || monthSel == ""|| monthSel == "0"){
        alert("자녀 생년월일을 입력해 주세요.");
        return false;
    }

    let daySel = $('[name="daySel"]').val();
    if(daySel == null || daySel == "" || daySel == "0"){
        alert("자녀 생년월일을 입력해 주세요.");
        return false;
    }

    if(parseInt(monthSel) < 10){
        monthSel = "0" + monthSel;
    }
    if(parseInt(daySel) < 10){
        daySel = "0" + daySel;
    }

    var privacyAgreeYn = $("[name='inquiryPrivacyAgreeYn']:checked").val();
    if(common.isNull(privacyAgreeYn)){
        alert("개인정보 수집에 동의해주세요..");
        return false;
    }

    var parentId = null;
    var jwtTokcen = jwt.getAllToken();
    if(!common.isNull(jwtTokcen.getItem(ACCESS_TOKEN_NAME)) && !common.isNull(jwtTokcen.getItem(EXPIRED_TIME_NAME)) && !common.isNull(jwtTokcen.getItem(REFRESH_TOKEN_NAME))){
        var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
        if(!common.isNull(userInfo.parentId)){
            parentId = userInfo.parentId;
        }
    }
    const res = function(response) {
        if(response.code == "200"){
            if(response.data.result = "Y"){
                alert("신청이 완료되었습니다.\n연락 드리겠습니다.");
                $("#pop-buy-req").removeClass("active");
                $("body").removeClass("disabled");
                fnResetInquiryForm();
            }else{
                if(response.data.message != null){
                    alert(response.data.message);
                }else{
                    alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                }
                return false;
            }
        }else{
            if(response.data.message != null){
                alert(response.data.message);
            }else{
                alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            }
            return false;
        }
    }
    let data = {
        "parentNm" : parentNm,
        "mdnNo" : mdnNo,
        "birthdate" : yearSel+'-'+monthSel+'-'+daySel,
        "privacyAgreeYn" : privacyAgreeYn,
        "parentId" : parentId,
        "certNo" :  $("#consultCertValue").val(),
        "consultLocationDiv" : "SV"
    };
    if(!common.isNull($("[name='buy_req_title']").attr("data-cosultdiv"))){
        data.cosultDiv = $("[name='buy_req_title']").attr("data-cosultdiv");
    }
    data = JSON.stringify(data);
    /*23.07.20*/
    com_ajax.ajax('put', '/clientsvc/hpg/v1/svh/web/consult/inquiry',  data, res);

}
function fnResetInquiryForm(){
    fnSetCalendar(minYear, maxYear, minMonth, maxMonth, minDay, maxDay);
    $("[name='inquiryParentNm']").val('');
    $("[name='inquiryMdnNo']").val('');
    $("[name='inquiryMdnNo']").attr('disabled',false);
    $("[name='inquiryBirthDate']").val('');
    $("[name='inquiryPrivacyAgreeYn']").prop("checked", false);
    $('[name="yearSel"]').val('');
    $('[name="monthSel"]').val('');
    $('[name="daySel"]').val('');
    $("#consultCertBtn").attr("disabled",true);
    $("#certPart").addClass("hide");
    $("#consultCertValue").val("");
    $("#consultCertConfirmBtn").attr("disabled",true);
    $("#consultCertTime").html("");
    $("#checkMdnNo").hide();
    thisCertCheck = false;
}
$(document).on('change', '[name="yearSel"], [name="monthSel"], [name="daySel"]', function (){
    let yearSel = $('[name="yearSel"]').val();
    if(yearSel == minYear){
        var thisMinMM = studentStartDate.getMonth();
        fnSetCalendar(minYear, maxYear, 1, 12, minDay, maxDay);
    }else if(yearSel == maxYear){
        var thisMaxMM = studentEndDate.getMonth();
        fnSetCalendar(minYear, maxYear, 1, thisMaxMM+1, minDay, maxDay);
    }else {
        fnSetCalendar(minYear, maxYear, minMonth, maxMonth, minDay, maxDay);
    }
    let monthSel = $('[name="monthSel"]').val();
    let daySel = $('[name="daySel"]').val();
    if(yearSel != null && yearSel != ""  && yearSel != "0" && monthSel != null && monthSel != "" && monthSel != "0" && daySel != null && daySel != "" && daySel != "0"){
        fncalcAge(yearSel+'-'+monthSel+'-'+daySel);
    }else{
        $("[name='calAgeInput']").val('');
    }
});

function fnSetCalendar(thisMinYear, thisMaxYear, thisMinMonth, thisMaxMonth, thisMinDay, thisMaxDay){
    let yearSel = $('[name="yearSel"]').val();
    let monthSel = $('[name="monthSel"]').val();
    let daySel = $('[name="daySel"]').val();


    let fullHtml = "";
    let yearHtml = '<select name="yearSel" class="select">';
    yearHtml += '<option value="0">년</option>';
    for(let y = thisMinYear; y<=thisMaxYear; y++){
        yearHtml += '<option value="'+y+'"';
        if(yearSel == y){
            yearHtml += 'selected';
        }
        yearHtml +='>'+y+'년</option>';
    }
    yearHtml += '</select>';

    let monthHtml = '<select name="monthSel" class="select">' ;
    monthHtml += '<option value="0">월</option>';
    for(let m = thisMinMonth; m<=thisMaxMonth; m++){
        monthHtml += '<option value="'+m+'"';
        if(monthSel == m){
            monthHtml += 'selected';
        }
        monthHtml += '>'+m+'월</option>';
    }
    monthHtml += '</select>';

    let dayHtml = '<select name="daySel" class="select">';
    dayHtml += '<option value="0">일</option>';
    for(let d = thisMinDay; d<=thisMaxDay; d++){
        dayHtml += '<option value="'+d+'"';
        if(daySel == d){
            dayHtml += 'selected';
        }
        dayHtml += '>'+d+'일</option>';
    }
    dayHtml += '</select>';
    fullHtml = yearHtml+monthHtml+dayHtml;
    fullHtml += '<input type="text" name="calAgeInput" class="inp" placeholder="" readonly />';
    $('[name="calHtmlPart"]').html(fullHtml);
}

function fncalcAge(birthDate) {
    let age = '';

    const birthYear = String(birthDate).substring(0,4);
    const todayYear = new Date().getFullYear();

    age = todayYear - birthYear + 1;
    age += "세";
    $("[name='calAgeInput']").val(age);
}

$(function(){
    $("body").on("click", ".counsel button, .product-apply-container .buttons a:nth-child(7)", function(){
        fnSetCalendar(minYear, maxYear, minMonth, maxMonth, minDay, maxDay)
        var thisClass = $(this).attr("class");
        var thisTitle = "상담신청";
        var thisValue = "상담신청";
        if(thisClass == "counsel-right"){
            thisTitle = "바로결제 상담신청";
            thisValue = "D";
        }else if(thisClass == "counsel-bro"){
            thisTitle = "형제상품 상담신청";
            thisValue = "B";
        }
        $("[name='buy_req_title']").html(thisTitle);
        $("[name='buy_req_title']").attr("data-cosultDiv",thisValue);
        $("#pop-buy-req").addClass("active");
        $("body").addClass("disabled");
    });
    $("body").on("click", ".pop-header-wrap button", function(){
        $(".dialog").removeClass("on");
        $("body").removeClass("disabled");
    });

   $("body").on("click", ".product-bottom a", function(){
        $("body").addClass("disabled");
        $("#agree-01").addClass("active");
    });
    $("body").on("click", ".btn_layerclose", function(){
        $("#agree-01").removeClass("active");
        $("#pop-buy-req").removeClass("active");
        $("body").removeClass("disabled");
    });
    /*
   $("body").on("click", ".btn-add", function(){
       $(".dialog").addClass("on");
       $("body").addClass("disabled");
   });
   $("body").on("click", ".pop-cont-wrap button", function(){
       $(".dialog").removeClass("on");
       $("body").removeClass("disabled");
   });
   $("body").on("click", ".agree-item-wrap input", function(){
       var ck = $(this).prop("checked");
       if(ck){
           $("html, body").stop().animate({ scrollTop : "10000px"},1500);
           $(".agree-item-wrap button").prop("disabled", false);
       }else{
           $(".agree-item-wrap button").prop("disabled", true);
       }
   });
   $("body").on("change", ".select", function(){
       var ck = parseInt($(this).val());
       if(ck == 0){
           $(this).removeClass("selected");
       }else{
           $(this).addClass("selected");
       }
   });*/
    //
    //.agree-item-wrap
});