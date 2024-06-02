const today = new Date();
var studentStartDate = new Date(today.getFullYear()-5, today.getMonth(), today.getDate());
var studentEndDate = new Date(today.getFullYear(), today.getMonth() - 20, today.getDate());
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
    if($(this).val().length == 11){
        $("#consultCertBtn").attr("disabled", false);
    }
})

function fnGetCert(){
    if(!common.isNull($("[name='inquiryMdnNo']").val())){
        $("#checkMdnNo").hide();
        const res = function(response) {
            if(response.code == "200"){
                thisCertCheck = false;
                fnGetTime(179);
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
$(document).on('keyup click keydown change', '[name="inquiryParentNm"]', function (){
    $(".error-msg").removeClass("on");
    $(this).val(common.nameCheck($(this).val()));

});

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
    if(!common.isNull(jwtTokcen.getItem(ACCESS_TOKEN_NAME)) && !common.isNull(jwtTokcen.getItem(EXPIRED_TIME_NAME)) ){
        var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
        if(!common.isNull(userInfo) && !common.isNull(userInfo.parentId)){
            parentId = userInfo.parentId;
        }
    }
    const res = function(response) {
        if(response.code == "200"){
            if(response.data.result = "Y"){
                alert("신청이 완료되었습니다.\n연락 드리겠습니다.");
                fnCloseThisPop('pop-buy-req');
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
        "consultLocationDiv" : "SR"
    };
    if(!common.isNull($("[name='buy_req_title']").attr("data-cosultdiv"))){
        data.cosultDiv = $("[name='buy_req_title']").attr("data-cosultdiv");
    }
    com_ajax.ajax('put', '/clientsvc/hpg/v1/svh/web/consult/inquiry',  JSON.stringify(data), res);

}
function fnResetInquiryForm(){
    /*구매상담 consultDiv추가.*/
    $("[name='buy_req_title']").attr("data-cosultDiv","D");
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
function changeCalendar(){
    let yearSel = $('[name="yearSel"]').val();
    var thisMaxDay = maxDay;
    var thisMonSelVal = $('[name="monthSel"]').val();
    if(thisMonSelVal != "0" && !common.isNull(thisMonSelVal) && parseInt(thisMonSelVal) >0){
        var montharray=new Array(31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
        thisMaxDay = montharray[parseInt(thisMonSelVal)-1];
        //윤달 구하기
        if (thisMonSelVal=="2"){
            if ((parseInt(yearSel)/4)!=parseInt(parseInt(yearSel)/4))
            {
                thisMaxDay=28;
            }
            else
            {
                thisMaxDay=29;
            }
        }
    }
    if(yearSel == minYear){
        var thisMinMM = studentStartDate.getMonth();
        fnSetCalendar(minYear, maxYear, 1, 12, minDay, thisMaxDay);
    }else if(yearSel == maxYear){
        var thisMaxMM = studentEndDate.getMonth();
        if(String(thisMaxMM+1) == $('[name="monthSel"]').val()){
            thisMaxDay = studentEndDate.getDate();
            fnSetCalendar(minYear, maxYear, 1, thisMaxMM+1, minDay, thisMaxDay);
        }else{
            fnSetCalendar(minYear, maxYear, 1, thisMaxMM+1, minDay, thisMaxDay);
        }
    }else {
        fnSetCalendar(minYear, maxYear, minMonth, maxMonth, minDay, thisMaxDay);
    }
    let monthSel = $('[name="monthSel"]').val();
    let daySel = $('[name="daySel"]').val();
    if(yearSel != null && yearSel != ""  && yearSel != "0" && monthSel != null && monthSel != "" && monthSel != "0" && daySel != null && daySel != "" && daySel != "0"){
        if (parseInt(monthSel) < 10) {
            monthSel = "0" + monthSel;
        }
        if (parseInt(daySel) < 10) {
            daySel = "0" + daySel;
        }
        fncalcAge(yearSel+'-'+monthSel+'-'+daySel);
    }else{
        $("[name='calAgeInput']").val('나이');
    }
};

function fnSetCalendar(thisMinYear, thisMaxYear, thisMinMonth, thisMaxMonth, thisMinDay, thisMaxDay){
    let yearSel = $('[name="yearSel"]').val();
    let monthSel = $('[name="monthSel"]').val();
    let daySel = $('[name="daySel"]').val();


    let fullHtml = "";
    let yearHtml = '<select name="yearSel" class="select" onchange="changeCalendar();">';
    yearHtml += '<option value="">년</option>';
    for(let y = thisMinYear; y<=thisMaxYear; y++){
        yearHtml += '<option value="'+y+'"';
        if(yearSel == y){
            yearHtml += 'selected';
        }
        yearHtml +='>'+y+'년</option>';
    }
    yearHtml += '</select>';

    let monthHtml = '<select name="monthSel" class="select" onchange="changeCalendar();">' ;
    monthHtml += '<option value="">월</option>';
    for(let m = thisMinMonth; m<=thisMaxMonth; m++){
        monthHtml += '<option value="'+m+'"';
        if(monthSel == m){
            monthHtml += 'selected';
        }
        monthHtml += '>'+m+'월</option>';
    }
    monthHtml += '</select>';

    let dayHtml = '<select name="daySel" class="select" onchange="changeCalendar();">';
    dayHtml += '<option value="">일</option>';
    for(let d = thisMinDay; d<=thisMaxDay; d++){
        dayHtml += '<option value="'+d+'"';
        if(daySel == d){
            dayHtml += 'selected';
        }
        dayHtml += '>'+d+'일</option>';
    }
    dayHtml += '</select>';
    fullHtml = yearHtml+monthHtml+dayHtml;
    fullHtml += '<input type="text" name="calAgeInput" class="inp" placeholder="나이" readonly />';
    $('[name="calHtmlPart"]').html(fullHtml);
}

function fncalcAge(birthDate) {
    let birthDateCheck = new Date(birthDate);
    let btMonth;
    let btYear = today.getFullYear() - birthDateCheck.getFullYear();
    if(btYear >=1){
        btMonth = (today.getMonth() - birthDateCheck.getMonth()+1) + (btYear*12);
    }else{
        btMonth = today.getMonth() - birthDateCheck.getMonth();
    }

    if(btMonth > 23){
        let age = '';
        const birthYear = String(birthDate).substring(0,4);
        const todayYear = new Date().getFullYear();

        age = todayYear - birthYear + 1;
        age += "세";
        $("[name='calAgeInput']").val(age);
    }else{

        $("[name='calAgeInput']").val(Math.ceil(btMonth)+"개월");
    }

}
