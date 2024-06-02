var isDisabled = false;
var timerInterval;
var certCheck = false;
var changeCheck = false;
var findParentId;
var loginId;

/*인증번호 확인.*/
$(document).on('keyup', '#certNo', function (){

    if($(this).val().length == 4){
        $('[name="submitCertNo"]').removeClass("disabled");
        $('[name="submitCertNo"]').attr("disabled", false);
    };
})
/*휴대전화번호 확인.*/
$(document).on('keyup', '[name="submitMdnNo"]', function (){
    if($(this).val().length == 11){
        $("[name='getCertBtn']").removeClass("disabled");
    }else{
        $("[name='getCertBtn']").addClass("disabled");
    }
    fnFormCheck();
})
/*학부모 이름 20byte, 영문, 한글 확인.*/
$(document).on('keyup', '[name="submitName"]', function (){
    $(this).val(common.nameCheck($(this).val()));
    fnFormCheck();
});
/*이메일확인.*/
$(document).on('keyup', '[name="submitEmail"]', function (){
    fnFormCheck();
});


function fnGetCert(){
    var thisMdnNo = $('[name="submitMdnNo"]').val();
    if(common.isNull(thisMdnNo)){
        $('[name="submitMdnNo"]').focus();
        return false;
    }
    const res = function(response) {
        if(response.code == "200"){
            fnGetTime(179);
        }else{
            alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            fnInitPhoneForm();
            return false;
        }
    }
    let data = {"mdnNo" : thisMdnNo};
    data = JSON.stringify(data);
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/account/v1/web/sms/cert/send/pw', data, res);
}

function fnGetTime(restTime){
    certCheck = false;
    $("[name='submitMdnNo']").attr('disabled', true);
    $('.custom-error.contact').addClass("hide");
    $('[name="divSubmitCertNo"]').removeClass("hide");
    $('.phoneResetBtn').removeClass('disabled');
    $('[name="getCertBtn"]').attr('disabled', true);
    $('[name="getCertBtn"]').addClass('disabled');
    $('[name="getCertBtn"]').html('재전송');
    restTime = parseInt(restTime);
    var timer = restTime, minutes, seconds;
    timerInterval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        $('[name="restTime"]').html(minutes + ":" + seconds);

        if (--timer < 0) {
            $('[name="checkMdnNo"]').find(".warn_para").html("인증번호 입력 시간이 만료되었습니다. 다시 요청해 주세요.");
            $('[name="checkMdnNo"]').show();
            clearInterval(timerInterval);
            fnInitPhoneForm();
            return false;
        }
    }, 1000);
}

function fnInitPhoneForm(){
    $('[name="restTime"]').html("03:00");
    clearInterval(timerInterval);
    certCheck = false;
    $("[name='submitMdnNo']").attr('disabled', false);
    $('.custom-error.contact').addClass("hide");
    $('[name="divSubmitCertNo"]').addClass("hide");
    $('.phoneResetBtn').addClass('disabled');
    $('[name="getCertBtn"]').attr('disabled', true);
    $('[name="getCertBtn"]').removeClass('disabled');

}


/*인증번호 확인*/
$(document).on('click', '[name="submitCertNo"]', function(){
    var mdnNo= $("[name='submitMdnNo']").val();
    var certNo = $("#certNo").val();
    if(mdnNo == null || mdnNo == ""){
        $('.custom-error.contact').removeClass("hide");
        return false;
    }

    if(certNo == null || certNo == "" || certNo.length != 4){
        $('.custom-error.authcode').removeClass("hide");
        return false;
    }

    const res = function(response) {
        if(response.code == "200"){
            if(response.message == "OK"){
                clearInterval(timerInterval);
                certCheck = true;
                alert("인증되었습니다.");
                $('.custom-error.authcode').addClass("hide");
                $("[name='submitMdnNo']").attr('disabled', true);
                $('.phoneResetBtn').addClass('disabled');
                $("#certNo").attr('disabled', true);
                $('[name="getCertBtn"]').attr('disabled', true);
                $('[name="getCertBtn"]').addClass('disabled');
                $('[name="submitCertNo"]').attr('disabled', true);
                $('[name="submitCertNo"]').addClass('disabled');
                fnFormCheck();
            }else{
                certCheck = false;
                $('.custom-error.authcode').removeClass("hide");
                return false;
            }
        }else{
            alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            return false;
        }
    }
    let data = {"mdnNo" : mdnNo, "certNo" : certNo};
    data = JSON.stringify(data);
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/account/v1/web/sms/cert/check',  data, res);

});

function fnSubmitFinal(){
    if(fnFormCheck() && certCheck){
        const res = function(response) {
            if(response.code == "200"){
                if(response.message == "OK"){
                    $("[name='requestPw']").hide();
                    $("[name='resetPw']").show();
                    $('.login_info').html("비밀번호를 새롭게 설정해 주세요.");
                    changeCheck = true;
                    findParentId = response.data.id;
                    loginId = response.data.loginId;
                    var regDtm = response.data.regDt;
                    $("[name='thisReturnId']").html(loginId);
                    $("[name='thisReturnRegDtm']").html(regDtm);
                }else{
                    if(!common.isNull(response.message)){
                        alert(response.message);
                        return false;
                    }
                }
            }else{
                if(!common.isNull(response.message)){
                    alert(response.message);
                    return false;
                }else{
                    alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                }
                return false;
            }
        }
        let data = {
            loginId: $('[name="submitEmail"]').val(),
            name: $('[name="submitName"]').val(),
            mdnNo: $('[name="submitMdnNo"]').val(),
            isMobileNoCertified: certCheck
        }
        data = JSON.stringify(data);
        /*23.07.20*/
        com_ajax.ajax('post', '/clientsvc/account/v1/web/user/search/pw',  data, res);

    }
}

function fnFormCheck(){
    var returnBoolean = false;
    var submitEmail = $('[name="submitEmail"]').val();
    if(!common.emailcheck(submitEmail)){
        $("[name='submitFinalBtn']").addClass("disabled");
        $("[name='submitFinalBtn']").attr("disabled",true);
        return returnBoolean;
    }
    var submitname = $('[name="submitName"]').val();
    var nameByte = getByte(submitname);
    if(nameByte > 20 || nameByte <= 1){
        $("[name='submitFinalBtn']").addClass("disabled");
        $("[name='submitFinalBtn']").attr("disabled",true);
        return returnBoolean;
    }
    if(!certCheck){
        $("[name='submitFinalBtn']").addClass("disabled");
        $("[name='submitFinalBtn']").attr("disabled",true);
        return returnBoolean;
    }
    returnBoolean = true;
    $("[name='submitFinalBtn']").removeClass("disabled");
    $("[name='submitFinalBtn']").attr("disabled",false);
    return returnBoolean;
}


function fnChangePw(){
    var firstPw = $("#firstPassword").val();
    if(common.isNull(firstPw)){
        alert("비밀번호를 입력해주세요.")
        return false;
    }
    var secondPw = $("#secondPassword").val();
    if(common.isNull(secondPw)){
        alert("비밀번호를 입력해주세요.")
        return false;
    }
    if(firstPw !== secondPw) {
        $("[name='changePwBtn']").addClass("disabled");
        $("[name='changePwBtn']").attr("disabled", true);
        $('.custom-error.confirm-password').html("비밀번호가 일치하지 않습니다.");
        $('.custom-error.confirm-password').removeClass('hide');
        return false;
    }
    // 영문+숫자 8자 이상 체크
    const pw_reg1 = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,50}$/; //영문,숫자
    // 특수문자 포함 6자 이상
    const pw_reg2_check1 = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,50}$/; //영문,특수문자
    const pw_reg2_check2 = /^(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{6,50}$/; //특수문자, 숫자
    if (!pw_reg1.test(firstPw) && (!pw_reg2_check1.test(firstPw) || !pw_reg2_check2.test(firstPw))) {
        $("[name='changePwBtn']").addClass("disabled");
        $("[name='changePwBtn']").attr("disabled", true);
        $('.custom-error.confirm-password').html("영문/숫자/특수문자 중 2가지 이상 포함해주세요.");
        $('.custom-error.confirm-password').removeClass('hide');
        return false;
    }
    var koreanCheck = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    if(koreanCheck.test(firstPw)){
        $("[name='changePwBtn']").addClass("disabled");
        $("[name='changePwBtn']").attr("disabled", true);
        $('.custom-error.confirm-password').html("영문/숫자/특수문자 중 2가지 이상 포함해주세요.");
        $('.custom-error.confirm-password').removeClass('hide');
        return false;
    }
    $("[name='changePwBtn']").removeClass("disabled");
    $('.custom-error.confirm-password').addClass('hide');
    $("[name='changePwBtn']").attr("disabled", false);
    if(!changeCheck){
        alert("비밀번호 찾기 후 진행해 주세요.");
        return false;
    }
    const res = function(response) {
        if(response.code == "200"){
            if(response.message == "OK"){
                alert('비밀번호 재설정이 완료되었습니다. 로그인 해주세요.');
                fnInitAllPage();
                common.hrefFunction('/main/login');
            }else{
            }
        }else{
            alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            return false;
        }
    }
    let data = {
        id: findParentId,
        loginId: loginId,
        password: firstPw
    }
    data = JSON.stringify(data);
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/account/v1/web/user/pw',  data, res);
}
$(document).on('keyup', '#firstPassword,#secondPassword', function (){
    var thisValue = $(this).val();
    var firstPw = $("#firstPassword").val();
    var secondPw = $("#secondPassword").val();
    if(firstPw !== secondPw && !common.isNull(firstPw) && !common.isNull(secondPw)) {
        $("[name='changePwBtn']").addClass("disabled");
        $("[name='changePwBtn']").attr("disabled", true);
        $('.custom-error.confirm-password').html("비밀번호가 일치하지 않습니다.");
        $('.custom-error.confirm-password').removeClass('hide');
        return false;
    }
    // 영문+숫자 8자 이상 체크
    const pw_reg1 = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,50}$/; //영문,숫자
    // 특수문자 포함 6자 이상
    const pw_reg2_check1 = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,50}$/; //영문,특수문자
    const pw_reg2_check2 = /^(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{6,50}$/; //특수문자, 숫자
    if (!pw_reg1.test(thisValue) && (!pw_reg2_check1.test(thisValue) || !pw_reg2_check2.test(thisValue))) {
        $("[name='changePwBtn']").addClass("disabled");
        $("[name='changePwBtn']").attr("disabled", true);
        $('.custom-error.confirm-password').html("영문/숫자/특수문자 중 2가지 이상 포함해주세요.");
        $('.custom-error.confirm-password').removeClass('hide');
        return false;
    }
    var koreanCheck = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    if(koreanCheck.test(firstPw)){
        $("[name='changePwBtn']").addClass("disabled");
        $("[name='changePwBtn']").attr("disabled", true);
        $('.custom-error.confirm-password').html("영문/숫자/특수문자 중 2가지 이상 포함해주세요.");
        $('.custom-error.confirm-password').removeClass('hide');
        return false;
    }
    $("[name='changePwBtn']").removeClass("disabled");
    $('.custom-error.confirm-password').addClass('hide');
    $("[name='changePwBtn']").attr("disabled", false);

})


function fnInitAllPage(){
    /*전체초기화*/
    $(".custom-error").addClass('hide');
    $("[name='requestPw']").show();
    $("[name='resetPw']").hide();
    $("[name='submitEmail']").val('');
    $("[name='submitEmail']").attr("disabled",false);
    $("[name='submitName']").val('');
    $("[name='submitName']").attr("disabled",false);
    $("[name='submitMdnNo']").val('');
    $("[name='submitMdnNo']").attr("disabled",false);
    $("[name='getCertBtn']").attr("disabled",true);
    $("[name='getCertBtn']").addClass("disabled");
    $("[name='divSubmitCertNo']").addClass("hide");
    $("#certNo").val('');
    $("[name='submitCertNo']").attr("disabled",true);
    $("[name='submitCertNo']").addClass("disabled");
    $("[name='submitFinalBtn']").attr("disabled",true);
    $("[name='submitFinalBtn']").addClass("disabled");
    $("[name='thisReturnId']").html('');
    $("[name='thisReturnRegDtm']").html('');
    $("[name='firstPassword']").val('');
    $("[name='secondPassword']").val('');
    $("[name='changePwBtn']").attr("disabled",true);
    $("[name='changePwBtn']").addClass("disabled");
    certCheck = false;
    changeCheck = false;
    findParentId='';
    loginId='';

}

// 231110 btn-eye click 함수 추가 (script_login js 와 동일하게) by nature
$(function(){
    $("body").on("click", ".btn-eye", function(){
        var ck = $(this).hasClass("on");
        if(ck){
            $(this).removeClass("on");
            $(this).prev("input").attr("type", "password");
        }else{
            $(this).addClass("on");
            $(this).prev("input").attr("type", "text");
        }
    });
});