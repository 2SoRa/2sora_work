let parentToday = new Date();

var sendMsgCheck = false;
var timerInterval = null;
var certCheck = false;

var oneDubleCheck = 0;
var oneSubmitCheck = 0;

var aftthisU = null;
var aftthisU2 = null;

/*2023.06.26 정회원 전환 시 true*/
var modifyCheck = false;
/*2023.06.26 정회원 전환시*/
var parentId = null;
var thisLoadingCheck = false;

$(window).on('load', function() {
    fnParentBirthDate();
});
/*학부모*/
function fnParentBirthDate(){
    let yearSel = $('[name="pYearSel"]').val();
    let monthSel = $('[name="pMonthSel"]').val();
    let daySel = $('[name="pDaySel"]').val();
    let thisMinYear = 1950;
    let thisMaxYear = parentToday.getFullYear()-19;
    let thisMinMonth = 1;
    let thisMaxMonth = 12;
    let thisMinDay = 1;
    let thisMaxDay = 31;

    let fullHtml = "";
    let yearHtml = '<select name="pYearSel" class="select" required>';
    yearHtml += '<option value="">년</option>';
    for(let y = thisMinYear; y<=thisMaxYear; y++){
        yearHtml += '<option value="'+y+'"';
        if(yearSel == y){
            yearHtml += 'selected';
        }
        yearHtml +='>'+y+'년</option>';
    }
    yearHtml += '</select>';

    let monthHtml = '<select name="pMonthSel" class="select" required>';
    if(yearSel == null || yearSel == undefined || yearSel == ""){
        //monthHtml += 'disabled'
    }
    // monthHtml += '"> '
    monthHtml += '<option value="">월</option>';
    for(let m = thisMinMonth; m<=thisMaxMonth; m++){
        monthHtml += '<option value="'+m+'"';
        if(monthSel == m){
            monthHtml += 'selected';
        }
        monthHtml += '>'+m+'월</option>';
    }
    monthHtml += '</select>';

    let dayHtml = '<select name="pDaySel" class="select" required>';
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
    $('[name="parentDateHtml"]').html(fullHtml);
}

$(document).on('change', '[name="pYearSel"], [name="pMonthSel"]', function () {
    let yearSel = $('[name="pYearSel"]').val();
    var thisMaxDay = 31;
    var thisMonSelVal = $('[name="pMonthSel"]').val();
    let daySel = $('[name="pDaySel"]').val();
    if (thisMonSelVal != "0" && !common.isNull(thisMonSelVal) && parseInt(thisMonSelVal) > 0) {
        var montharray = new Array(31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
        thisMaxDay = montharray[parseInt(thisMonSelVal) - 1];
        //윤달 구하기
        if (thisMonSelVal == "2") {
            if ((parseInt(yearSel) / 4) != parseInt(parseInt(yearSel) / 4)) {
                thisMaxDay = 28;
            } else {
                thisMaxDay = 29;
            }
        }
    }
    let dayHtml = '<option value="">일</option>';
    for(let d = 1; d<=thisMaxDay; d++){
        dayHtml += '<option value="'+d+'"';
        if(daySel == d){
            dayHtml += 'selected';
        }
        dayHtml += '>'+d+'일</option>';
    }
    $("[name='pDaySel']").html(dayHtml);

});

/*<!--약관동의 전체체크 박스-->*/
function checkAllAgree(thisValue){
    let thisChecked = $(thisValue).is(':checked');
    let thisName = $(thisValue).attr("name");
    $("input:checkbox[name='"+thisName+"']").prop("checked",thisChecked);
    $("input:checkbox[name='require1']").prop("checked",thisChecked);
    $("input:checkbox[name='require2']").prop("checked",thisChecked);
    $("input:checkbox[name='require3']").prop("checked",thisChecked);
}

/*<!--약관동의 개별 체크박스-->*/
$(document).on("click","[name='require1'],[name='require2'],[name='require3'],[name='agreeAllCheckBox']",function (){
    let thisChecked = $(this).is(':checked');
    let thisName = $(this).attr("name");
    $("input:checkbox[name='"+thisName+"']").prop("checked",thisChecked);
    let require1Check = $("input:checkbox[name='require1']").is(':checked');
    let require2Check = $("input:checkbox[name='require2']").is(':checked');
    let require3Check = $("input:checkbox[name='require3']").is(':checked');
    if(require1Check && require2Check && require3Check){
        $("input:checkbox[name='agreeAllCheckBox']").prop('checked', true);
    }else{
        $("input:checkbox[name='agreeAllCheckBox']").prop('checked', false);
    }
    if(require1Check && require2Check){
        $("button[name='nextStepFirst']").removeClass("disabled");
        $("button[name='nextStepFirst']").attr("disabled", false);
    }else{
        $("button[name='nextStepFirst']").attr("disabled", true);
        $("button[name='nextStepFirst']").addClass("disabled");
    }
})

/*<!--약관동의 다음버튼-->*/
$(document).on("click", "[name='nextStepFirst']", function (){
    let thisCheck = $(this).hasClass("disabled");
    if(!thisCheck){
        $("[name='agreeDiv']").hide();
        if (typeof (history.pushState) != "undefined") {
            history.pushState(null, null, "#1");
        } else if(typeof (history.replaceState) != "undefined"){
            //브라우저가 지원하지 않는 경우 처리
            history.replaceState(null,null,'#1')
        }
        $('.window').animate( { scrollTop :  $("[name='formDiv']").offset().top }, 0 );
        $("[name='formDiv']").show();
    }else{
        return false;
    }
})

window.addEventListener("hashchange", function(){
        $("[name='formDiv']").hide();
        $("[name='agreeDiv']").show();
});

function fnGetCert(mdnNo){
    if(common.isNull(mdnNo)){
        mdnNo =  $('[name="mdnNo"]').val();
        if(common.isNull(mdnNo)){
            $('[name="checkMdnNo"]').html("휴대폰 번호를 입력해주세요.");
            $('[name="checkMdnNo"]').removeClass('hide');
            return false;
        }
    }
    const res = function(response) {
        if(response.code == "200"){
            certCheck = false;
            fnGetTime(179);
        }else{
            alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            fnInitPhoneForm();
            return false;
        }
    }
    let data = {"mdnNo" : mdnNo};
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/account/v1/web/sms/cert/send', JSON.stringify(data), res);
}
function fnGetTime(restTime){

    $("[name='getMdnBtn']").attr('disabled', true);
    $('[name="checkMdnNo"]').hide();
    $('[name="phoneResetBtn"]').attr('disabled', false);
    $('[name="certMsgSend"]').show();
    $('[name="certMsgAfter"]').hide();
    $('[name="certMsgExp"]').hide();
    $('[name="certMsgCheck"]').hide();
    $('[name="mdnNo"]').attr('disabled', true);
    /*2023.06.13 disabled 스타일로 수정*/
    $('[name="certNo"]').removeClass('disabled');
    /*$('[name="certNo"]').attr('disabled', false);*/
    $('[name="getCertBtn"]').attr('disabled', true);
    restTime = parseInt(restTime);
    var timer = restTime, minutes, seconds;
    timerInterval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        $('[name="restTime"]').html(minutes + ":" + seconds);

        if (--timer < 0) {
            $('[name="certMsgSend"]').hide();
            $('[name="certMsgCheck"]').hide();
            $('[name="certMsgAfter"]').hide();
            $('[name="certMsgExp"]').show();
            clearInterval(timerInterval);
            fnInitPhoneForm();
            return false;
        }
    }, 1000);


}
/*인증번호 한글 확인.*/
$(document).on('keyup click keydown', '[name="certNo"]', function (){
    var curVal = $(this).val();
    var regex = /^[0-9]+$/;
    if(!regex.test(curVal)){
        $('[name="certNo"]').val(curVal.slice(0, curVal.length-1));
    }

    curVal = $('[name="certNo"]').val();
    if(curVal.length == 4){
        $('[name="certBtn"]').attr('disabled', false);
        $('[name="certBtn"]').removeClass('disabled');
    }else if(curVal.length > 4){
        $("[name='certNo']").val(curVal.slice(0, curVal.length-1));
        $('[name="certBtn"]').attr('disabled', false);
        $('[name="certBtn"]').removeClass('disabled');
    }else{
        $('[name="certBtn"]').attr('disabled', true);
        $('[name="certBtn"]').addClass('disabled');
    }
});
function fnInitPhoneForm(){
    sendMsgCheck = false;
    clearInterval(timerInterval);
    $('[name="phoneResetBtn"]').attr('disabled', true);
    $('[name="getCertBtn"]').attr('disabled', false);
    $('[name="getMdnBtn"]').attr('disabled', false);
    $('[name="mdnNo"]').attr('disabled', false);
    /*2023.06.13 disabled 스타일로 수정*/
    $('[name="certNo"]').addClass('disabled');
    //$('[name="certNo"]').attr('disabled', true);
    $('[name="certMsg"]').hide();
    $('[name="certBtn"]').attr('disabled', true);
    //$('[name="certNo"]').attr('disabled', true);
    $('[name="certNo"]').val('');
    $('[name="restTime"]').html("");
}
/*인증번호 확인*/
$(document).on('click', '[name="certBtn"]', function(){
    if(!thisLoadingCheck){
        thisLoadingCheck = true;
        var mdnNo= $('[name="mdnNo"]').val();
        var certNo = $('[name="certNo"]').val();
        if(mdnNo == null || mdnNo == ""){
            return false;
        }
        if(certNo == null || certNo == ""){
            $('[name="certNo"]').focus();
            return false;
        }

        const res = function(response) {
            if(response.code == "200"){
                if(response.message == "OK"){
                    $('[name="checkMdnNo"]').hide();
                    clearInterval(timerInterval);
                    $('[name="phoneResetBtn"]').attr('disabled', true);
                    $('[name="getCertBtn"]').attr('disabled', true);
                    $('[name="mdnNo"]').attr('disabled', true);
                    /*2023.06.13 disabled 스타일로 수정*/
                    $('[name="certNo"]').addClass('disabled');
                    //$('[name="certNo"]').attr('disabled', true);
                    $('[name="certMsgSend"]').hide();
                    $('[name="certMsgExp"]').hide();
                    $('[name="certMsgCheck"]').hide();
                    $('[name="certMsgAfter"]').show();
                    $('[name="certBtn"]').attr('disabled', true);
                    $('[name="restTime"]').html("");
                    fnCheckParentStateByMdnNo();
                    thisLoadingCheck = false;
                    certCheck = true;
                }else{
                    $('[name="certMsgSend"]').hide();
                    $('[name="certMsgAfter"]').hide();
                    $('[name="certMsgExp"]').hide();
                    $('[name="certMsgCheck"]').show();
                    certCheck = false;
                    thisLoadingCheck = false;
                    return false;
                }
            }else{
                alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                thisLoadingCheck = false;
                return false;
            }
        }
        let data = {"mdnNo" : mdnNo, "certNo" : certNo};
        /*23.07.20*/
        com_ajax.ajax('post', '/clientsvc/account/v1/web/sms/cert/check',  JSON.stringify(data), res);
    }
});
/*휴대전화번호 확인.*/
$(document).on('keyup click keydown', '[name="mdnNo"]', function (){

    $('[name="certBtn"]').attr('disabled', true);
    let curVal = $(this).val();
    var totalCnt = curVal.length;

    if(totalCnt == 11){
        var regExp = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
        if( !regExp.test(curVal)) {
            $('[name="getMdnBtn"]').attr('disabled', true);
            $('[name="checkMdnNo"]').html("휴대폰 번호를 올바르게 입력해 주세요.");
            $('[name="checkMdnNo"]').removeClass('hide');
        }else{
            $('[name="getMdnBtn"]').attr('disabled', false);
        }
    }else{
        $('[name="checkMdnNo"]').addClass('hide');
        $('[name="getMdnBtn"]').attr('disabled', true);
    }
})
$(document).on('keyup click keydown change', '[name="thispliId"],[name="thispa"],[name="pwdCheck"],[name="parentNm"]' +
    ',[name="mdnNo"],[name="certNo"],[name="zipcode"],[name="address1"],[name="address2"],[name="stuName"]' +
    ',[name="yearSel"],[name="monthSel"],[name="daySel"],[name="pYearSel"],[name="pMonthSel"],[name="pDaySel"]' +
    ',[name="require1"],[name="require2"],[name="require3"]', function (){
    fnAllFormCheck();

})

function fnCheckPwd(){
    var firstPw = $('[name="thispa"]').val();
    var secondPw = $('[name="pwdCheck"]').val();
    // 영문+숫자 8자 이상 체크
    const pw_reg1 = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,18}$/; //영문,숫자
    // 특수문자 포함 6자 이상
    const pw_reg2_check1 = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,18}$/; //영문,특수문자
    const pw_reg2_check2 = /^(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{8,18}$/; //특수문자, 숫자
    if (!pw_reg1.test(firstPw) && (!pw_reg2_check1.test(firstPw) || !pw_reg2_check2.test(firstPw)) && !common.isNull(firstPw)) {
        $("[name='pwdVali1']").show();
        return false;
    }
    var koreanCheck = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    $("[name='pwdVali1']").html("영문/숫자/특수문자 중 2가지 이상을 포함한 8~18자 여야 합니다.");
    if(koreanCheck.test(firstPw)){
        $("[name='pwdVali1']").show();
        return false;
    }
    if(getByte(firstPw) > 18){
        $("[name='pwdVali1']").show();
        return false;
    }
    $("[name='pwdVali1']").hide();
    if(firstPw !== secondPw && !common.isNull(secondPw)) {
        $("[name='pwdVali1']").html("비밀번호가 일치하지 않습니다.");
        $("[name='pwdVali1']").show();
        return false;
    }
    $("[name='pwdVali1']").hide();
    return true;
}

function fnAllFormCheck(){
    var thispliId = $('[name="thispliId"]').val();
    var pwd = $('[name="thispa"]').val();
    var pwdCheck = $('[name="pwdCheck"]').val();
    var parentNm = $('[name="parentNm"]').val();
    var mdnNo = $('[name="mdnNo"]').val();
    var certNo = $('[name="certNo"]').val();
    var zipcode = $('[name="zipcode"]').val();
    var address1 = $('[name="address1"]').val();
    var address2 = $('[name="address2"]').val();
    var stuName = $('[name="stuName"]').val();
    var yearSel = $('[name="yearSel"]').val();
    var monthSel = $('[name="monthSel"]').val();
    var daySel = $('[name="daySel"]').val();
    var pYearSel = $('[name="pYearSel"]').val();
    var pMonSelVal = $('[name="pMonthSel"]').val();
    var pDaySel = $('[name="pDaySel"]').val();

    var formCheckCnt = 0;
    $('[name="emailCheckMsg"]').hide();
    if(common.isNull(thispliId)){
        formCheckCnt++;
    }else if(!common.emailcheck(thispliId)){
        $('[name="emailCheckMsg"]').show();
        formCheckCnt++;
    }else if(common.isNull(pwd)){
        formCheckCnt++;
    }else if(common.isNull(pwdCheck)){
        formCheckCnt++;
    }else if(common.isNull(parentNm)){
        formCheckCnt++;
    }else if(common.isNull(mdnNo)){
        formCheckCnt++;
    }else if(!certCheck){
        formCheckCnt++;
    }else if(common.isNull(certNo)){
        formCheckCnt++;
    }else if(common.isNull(zipcode)){
        formCheckCnt++;
    }else if(common.isNull(address1)){
        formCheckCnt++;
    }else if(common.isNull(address2)){
        formCheckCnt++;
    }else if(common.isNull(stuName)){
        formCheckCnt++;
    }else if(common.isNull(pYearSel) || String(pYearSel) == "0"){
        formCheckCnt++;
    }else if(common.isNull(pMonSelVal) || String(pMonSelVal) == "0"){
        formCheckCnt++;
    }else if(common.isNull(pDaySel) || String(pDaySel) == "0"){
        formCheckCnt++;
    }
    /*회원가입시 자녀생일 확인 추가.*/
    if(!modifyCheck){
        if(common.isNull(yearSel) || String(yearSel) == "0"){
            formCheckCnt++;
        }else if(common.isNull(monthSel) || String(monthSel) == "0"){
            formCheckCnt++;
        }else if(common.isNull(daySel) || String(daySel) == "0"){
            formCheckCnt++;
        }
    }


    if(!fnCheckPwd()){
        formCheckCnt++;
    }

    var require1 = $("[name='require1']").eq(0).is(':checked');
    var require2 = $("[name='require2']").eq(0).is(':checked');
    var require3 = $("[name='require3']").eq(0).is(':checked');

    if(formCheckCnt == 0 && require1 && require2){
        $('[name="joinBtn"]').removeClass("disabled");
        $('[name="joinBtn"]').attr("disabled", false);
        $('[name="joinBtn"]').addClass("primary");
    }else{
        $('[name="joinBtn"]').addClass("disabled");
        $('[name="joinBtn"]').attr("disabled", true);
        $('[name="joinBtn"]').removeClass("primary");
        return false;
    }
}
$(document).on('click', '[name="joinBtn"]', function (){
    fnAllFormCheck();
    oneDubleCheck++;
    if(oneDubleCheck == 1){
        if($(this).hasClass('disabled')){
            oneDubleCheck = 0;
            return false;
        }else{
            /*이메일 중복체크*/
            var thispliId = $('[name="thispliId"]').val();
            const res = function(response) {
                oneDubleCheck = 0;
                if (response.code == "200") {
                    if(response.data.dupCheck){
                        fnSubmitThisForm();
                    }
                }else{
                    if(!common.isNull(response.message)){
                        alert(response.message);
                    }else{
                        alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                    }
                    return false;
                }
            }
            let data = {
                "email": thispliId
            }
            /*23.07.20*/
            com_ajax.ajax('get', '/clientsvc/account/v1/web/user/email/dup',  data, res);
        }
    }
})
function fnSubmitThisForm(){
    fnAllFormCheck();
    oneSubmitCheck ++;
    var thispliId = $('[name="thispliId"]').val();
    var pwd = $('[name="thispa"]').val();
    var parentNm = $('[name="parentNm"]').val();
    var mdnNo = $('[name="mdnNo"]').val();
    var certNo = $('[name="certNo"]').val();
    var zipcode = $('[name="zipcode"]').val();
    var address1 = $('[name="address1"]').val();
    var address2 = common.decodeHTMLEntities($('[name="address2"]').val());
    var stuName = $('[name="stuName"]').val();
    var yearSel = $('[name="yearSel"]').val();
    var monthSel = $('[name="monthSel"]').val();
    var daySel = $('[name="daySel"]').val();
    var pYearSel = $('[name="pYearSel"]').val();
    var pMonSelVal = $('[name="pMonthSel"]').val();
    var pDaySel = $('[name="pDaySel"]').val();
    var require1 = $("[name='require1']").eq(0).is(':checked');
    var require2 = $("[name='require2']").eq(0).is(':checked');
    var require3 = $("[name='require3']").eq(0).is(':checked');


    if (parseInt(monthSel) < 10) {
        monthSel = "0" + monthSel;
    }
    if (parseInt(daySel) < 10) {
        daySel = "0" + daySel;
    }
    if (parseInt(pMonSelVal) < 10) {
        pMonSelVal = "0" + pMonSelVal;
    }
    if (parseInt(pDaySel) < 10) {
        pDaySel = "0" + pDaySel;
    }
    if(oneSubmitCheck == 1) {
        const res = function (response) {
            if (response.data.code == "200") {
                $("[name='completeLoginId']").html(thispliId);
                $("[name='completeLoginName']").html(stuName);
                $("[name='agreeDiv']").remove();
                $("[name='formDiv']").remove();
                $("[name='completeDiv']").show();
                try {
                    const element = document.getElementById("finalDisplay");
                    element.scrollIntoView();
                    $('.window').animate( { scrollTop :  $("[name='completeDiv']").offset().top }, 0 );
                }catch (e){
                    console.log(e);
                }
                aftthisU = thispliId;
                aftthisU2 = pwd

                oneSubmitCheck = 0;
            } else {
                if (!common.isNull(response.data.message)) {
                    alert(response.data.message);
                } else {
                    alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                }
                oneSubmitCheck = 0;
                return false;
            }
            oneSubmitCheck = 0;
        }
        let data = {
            "name": parentNm,
            "parentLoginId": thispliId,
            "pwd": pwd,
            "mdnNo": mdnNo,
            "zipcode": zipcode,
            "address1": address1,
            "address2": address2,
            "stuName": stuName,
            "parentBirthdate": pYearSel + '-' + pMonSelVal + '-' + pDaySel,
            //"deviceCaseDiv": deviceCaseDiv,
            "joinUrlCd": "10",
            //"brotherYn": brotherYn,
            "svcuseAgreeYn": require1,
            "privacyAgreeYn": require2,
            "mkiRcvYn": require3,
            "certNo": certNo,
        };
        /*23.07.20*/
        if(modifyCheck){
            data.parentId = parentId;
            com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/signup/temp/user', JSON.stringify(data), res);
        }else{
            data.birthdate =  yearSel + '-' + monthSel + '-' + daySel;
            com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/signup/user', JSON.stringify(data), res);
        }
    }

}

/*학부모 이름 20byte, 영문, 한글 확인.*/
$(document).on('keyup click keydown change', '[name="parentNm"],[name="stuName"]', function (){
    $(this).val(common.nameCheck($(this).val()));
});


// 로그인(회원가입후, 로그인 처리)
function fnLoginBtn(landingUrl) {
    if(common.isNull(landingUrl)){
        landingUrl = "/";
    }
    var jwtTokcen = jwt.getAllToken();
/*    var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
    /!*유료회원여부 확인*!/
    const res2 = function(response) {
        memberShipApi = true;
        if(response.code == "200"){
            if(!common.isNull(response.data)){
                if(response.data.membership == true ||response.data.membership == "true" ){
                    memberShipCheck = true;
                }
            }
        }else{
            return false;
        }
    }
    let data2 =
        {
            "parentId" : userInfo.parentId,
        };
    /!*23.07.20*!/
    com_ajax.ajax('post', '/clientsvc/hpg/v1/svr/member/reading/order/check', JSON.stringify(data2), res2);*/
    if (!common.isNull(jwtTokcen.getItem(ACCESS_TOKEN_NAME)) && !common.isNull(jwtTokcen.getItem(EXPIRED_TIME_NAME)) ) {
        if(!common.isNull(userInfo) && !common.isNull(userInfo.parentId)) {
            common.hrefFunction("/");
        }
    }
    if (!common.emailcheck(aftthisU)) {
        aftthisU = null;
        aftthisU2 = null;
        common.hrefFunction("/");
        return false;
    };
    if (common.isNull(aftthisU2)) {
        aftthisU = null;
        aftthisU2 = null;
        common.hrefFunction("/");
        return false;
    }
    if (!common.pwCheck(aftthisU2)) {
        aftthisU = null;
        aftthisU2 = null;
        common.hrefFunction("/");
        return false;
    }
    const res = function (response) {
        if (response.code == "200") {
            aftthisU = null;
            aftthisU2 = null;
            jwt.saveHeaderToken(response.data.accessToken);
            jwt.saveAllToken(response.data);
            fnSaveUserInfo(landingUrl);
        } else {
            aftthisU = null;
            aftthisU2 = null;
            jwt.destroyAll();
            if (response.message != null) {
                alert(response.message);
            } else {
                alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            }
            return false;
        }
    }
    let data = {"email": aftthisU, "password": aftthisU2};
    data = JSON.stringify(data);
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/account/v1/web/user/login', data, res);

}

function fnSaveUserInfo(landingUrl){
    if(common.isNull(landingUrl)){
        landingUrl = "/";
    }
    const res = function(response) {
        if(response.code == "200"){
            sessionStorage.setItem("vuex",JSON.stringify(response.data));
            common.hrefFunction(landingUrl);
        }else{
            common.hrefFunction(landingUrl);
            return false;
        }
    }
    let data = [];
    /*23.07.20
    * study에 따로 홈페이지용으로 만들어야함
    *
    * */
    com_ajax.ajax('get', '/clientsvc/account/v1/web/user/info',  data, res);
}


/*2023.06.26 회원가입한 회원 확인.*/
function fnCheckParentStateByMdnNo(){
    var mdnNo = $('[name="mdnNo"]').val();
    $('[name="checkMdnNo"]').hide();
    const res = function(response) {
        if(response.message == "OK"){
            if(response.data.code == "201"){
                /*휴대폰번모 미기입*/
                alert(response.data.msg);
                $('[name="mdnNo"]').focus();
                fnInitPhoneForm();
                return false;

            }else if(response.data.code == "202"){
                /*회원가입 회뭥*/
                if(confirm(response.data.msg)){
                    fnInitPhoneForm();
                    common.hrefFunction('/main/login');
                }else{
                    fnInitPhoneForm();
                    return false;
                }
            }else if(response.data.code == "203"){
                /*이미 무료체험 가입 신청한 회원*/
                if(confirm("이미 체험을 신청한 휴대폰 번호입니다.\n" +
                    "[확인]을 누르시면 체험신청 정보로 회원가입이 진행됩니다")){

                    /*회원정보 가져오기*/
                    fnGetTempMemberInfo();
                }else{
                    fnInitPhoneForm();
                    return false;
                }
            }
        }else{
            fnInitPhoneForm();
            alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            return false;
        }
    }
    let data = {
        "mdnNo" :mdnNo
    }
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/exp/member/check', JSON.stringify(data), res);
}

/*2023.06.26 임시회원 정보 가져오기*/
function fnGetTempMemberInfo(){
    modifyCheck = true;
    var mdnNo = $('[name="mdnNo"]').val();
    $('[name="checkMdnNo"]').hide();
    const res = function(response) {
        if(response.message == "OK"){
            if(response.data.code == "200"){
                let data = response.data.data;
                $("[name='parentNm']").attr('disabled', true);
                $("[name='parentNm']").val(data.parentNm);
                $("[name='stuName']").attr('disabled', true);
                $("[name='stuName']").val(data.myStudentList[0].studentNm);
                $("[name='mdnNo']").attr('disabled', true);
                $("[name='certNoRow']").hide();
                $("[name='getMdnBtn']").hide();
                $("[name='calHtmlPart']").hide();
                $("[name='zipcode']").val(data.zipcode);
                $("[name='address1']").val(data.adr1);
                $("[name='address2']").val(data.adr2);
                parentId = data.parentId;
                fnAllFormCheck();
            }else{
                $("input").val('');
                fnInitPhoneForm();
                alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                return false;
            }
        }else{
            fnInitPhoneForm();
            alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            return false;
        }
    }
    let data = {
        "mdnNo" :mdnNo
    }
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/parent/mdn', JSON.stringify(data), res);
}

function fnCertSnBtnCheck(){

}