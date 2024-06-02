
let sendCertCheck = true;
let certComplete = false;
let readingMemComplete = false;
let submitCheck = true;
let thisSalesId = null;
$(document).ready(function () {
    let removeCheck = 0;
    const urlParams = new URL(location.href).searchParams;
    /*추천코드 url 에 있을경우 */
    let eventRecommendCd = urlParams.get('recommendCd');
    if(!common.isNull(eventRecommendCd)){
        sessionStorage.setItem("recommendCd", eventRecommendCd);
        if(eventRecommendCd.indexOf('supervp') != -1){
            removeCheck++;
        }
    }
    /*추천코드 세션에 있을경우*/
    else if(!common.isNull(sessionStorage.getItem("recommendCd"))) {
        eventRecommendCd = sessionStorage.getItem("recommendCd");
        var cookieValue = eventRecommendCd + "; path=/;";
        document.cookie = "recommendCd" + "=" + cookieValue;
        if (eventRecommendCd.indexOf('supervp') != -1) {
            removeCheck++;
        }
    }
    /*추천교사 url에 있을경우*/
    let eventsalesRecommCd = urlParams.get('salesRecommCd');
    if(!common.isNull(eventsalesRecommCd)){
        thisSalesId = eventsalesRecommCd;
        var cookieValue = thisSalesId + "; path=/;";
        document.cookie = "salesRecommCd" + "=" + cookieValue;
    }
    /*추천교사 session에 있을경우*/
    else if(!common.isNull(sessionStorage.getItem("salesRecommCd"))) {
        thisSalesId = sessionStorage.getItem("salesRecommCd");
    }

    /*쿠키값에 추천코드, 추천교사 있을경우*/
    var x, y;
    var val = document.cookie.split(';');
    let thisRecommendCd = null;
    let thisSalesRecommCd = null;
    if(val.length > 0){
        let cookieCheck = 0;
        for (var i = 0; i < val.length; i++) {
            x = val[i].substr(0, val[i].indexOf('='));
            y = val[i].substr(val[i].indexOf('=') + 1);
            x = x.replace(/^\s+|\s+$/g, ''); // 앞과 뒤의 공백 제거하기

            if (x == "recommendCd") {
                sessionStorage.setItem("recommendCd", unescape(y)); // unescape로 디코딩 후 값 리턴
                thisRecommendCd = unescape(y);
                removeCheck++;
            }

            if (x == "salesRecommCd") {
                sessionStorage.setItem("salesRecommCd", unescape(y)); // unescape로 디코딩 후 값 리턴
                thisSalesRecommCd = unescape(y);
            }
        }
    }
    if(!common.isNull(thisRecommendCd) && common.isNull(eventRecommendCd)){
        eventRecommendCd = thisRecommendCd;
    }
    if(!common.isNull(thisSalesRecommCd) && common.isNull(thisSalesId)){
        thisSalesId = thisSalesRecommCd;
    }
    /*한글도서관,영어도서관 외부 홈페이지로 인하여 파라미터 누락시 재발행*/
    if (typeof (history.pushState) != "undefined") {
        let historyUrl = null;
        if(!common.isNull(eventRecommendCd)){
            historyUrl = "?recommendCd="+eventRecommendCd;
        }
        if(!common.isNull(thisSalesId)){
            if(historyUrl != null && historyUrl.indexOf("?") != -1){
                historyUrl = historyUrl+"&salesRecommCd="+thisSalesId;
            }else{
                historyUrl = "?salesRecommCd="+thisSalesId;
            }
        }
        /*2023.12.18 카울리 관련 추가.*/
        const cauly = urlParams.get("cauly_egmt_sec");
        const cauly2 = urlParams.get("cauly_rt_code");
        if(!common.isNull(cauly) && !common.isNull(cauly2)){
            if(historyUrl != null && historyUrl.indexOf("?") != -1){
                historyUrl = historyUrl+"&cauly_egmt_sec="+cauly+"&cauly_rt_code="+cauly2;
            }else{
                historyUrl = "?cauly_egmt_sec="+cauly+"&cauly_rt_code="+cauly2;
            }
        }


        if(!common.isNull(historyUrl)){
            history.pushState(null, null, historyUrl);
        }
    }

    if(removeCheck==0){
        $("[name='recommendDiv']").remove();
    }else{
        $("[name='recommendDiv']").show();
    }

});

function fnCertSnBtnCheck(){
    if(!common.isNull($("#parentNm").val())&&!common.isNull($("#studentNm").val())&&!common.isNull($("#studentNm").val())
        &&!common.isNull($('[name="yearSel"]').val()) &&!common.isNull($('[name="monthSel"]').val())&&!common.isNull($('[name="daySel"]').val()) &&!common.isNull($("#mdnNo").val())){
        $("#certSnBtn").attr("disabled",false);
    }else{
        $("#certSnBtn").attr("disabled",true);
    }
}
/*이름 20byte, 영문, 한글 확인.*/
$(document).on('keyup click keydown', '#parentNm, #studentNm', function (){
    $(this).val(common.nameCheck($(this).val()));
    if(!common.isNull($("#parentNm").val())&&!common.isNull($("#studentNm").val())&&!common.isNull($("#studentNm").val())
        &&!common.isNull($('[name="yearSel"]').val()) &&!common.isNull($('[name="monthSel"]').val())&&!common.isNull($('[name="daySel"]').val()) && !common.isNull($("#mdnNo").val())){
        $("#certSnBtn").attr("disabled",false);
    }else{
        $("#certSnBtn").attr("disabled",true);
    }
    fnAllFormCheck();
});

$(document).on('keyup click keydown', '#mdnNo', function (){
    if($(this).val().length == 11){
        if(!common.isNull($("#parentNm").val())&&!common.isNull($("#studentNm").val())&&!common.isNull($("#studentNm").val())
            &&!common.isNull($('[name="yearSel"]').val()) &&!common.isNull($('[name="monthSel"]').val())&&!common.isNull($('[name="daySel"]').val()) && !common.isNull($("#mdnNo").val())){
            $("#certSnBtn").attr("disabled",false);
        }else{
            $("#certSnBtn").attr("disabled",true);
        }
    }else{
        $("#certSnBtn").attr("disabled",true);
    }
})

$(document).on("click", "#certSnBtn", function (){
    $(".vali").removeClass("sendOk");
    $(".vali").removeClass("certOk");
    $(".vali").removeClass("certFail");
    memberFormCheck();
    const res = function(response) {
        $("#certSnBtn").html("재전송");
        if(response.code == "200"){
            $(".vali").addClass("sendOk");
            fnGetTime(179);
        }else{
            $(".vali").removeClass("sendOk");
            $(".vali").removeClass("certOk");
            $(".vali").removeClass("certFail");
            alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            return false;
        }
    }
    let data = {"mdnNo" : $("#mdnNo").val()};
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/account/v1/web/sms/cert/send', JSON.stringify(data), res);
})


let timerInterval = null;
function fnGetTime(restTime){
    $("#certInput").attr("disabled", false);
    restTime = parseInt(restTime);
    var timer = restTime, minutes, seconds;
    timerInterval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        $("#restTime").html(minutes + ":" + seconds);

        if (--timer < 0) {
            clearInterval(timerInterval);
            $(".vali").addClass("certFail");
            return false;
        }
    }, 1000);

}
$(document).on('keyup click keydown', '#certInput', function (){
    if($(this).val().length == 4){
        $("#certCheckBtn").attr("disabled",false);
    }else{
        $("#certCheckBtn").attr("disabled",true);
    }
})

$(document).on('keyup click keydown', '#certCheckBtn', function (){
    memberFormCheck();
    if(sendCertCheck) {
        sendCertCheck = false;
        const res = function (response) {
            if (response.code == "200") {
                if (response.message == "OK") {
                    certComplete = true;
                    fnReadingMemberCheck();
                } else {
                    certComplete = false;
                    $("#mdnNo").val('');
                    $("#certInput").val('');
                    $(".vali").removeClass("sendOk");
                    $(".vali").removeClass("certOk");
                    $(".vali").removeClass("certFail");
                }
            } else {
                $(".vali").removeClass("sendOk");
                $(".vali").removeClass("certOk");
                $(".vali").removeClass("certFail");
                alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                return false;
            }
        }
        let data = {"mdnNo": $("#mdnNo").val(), "certNo": $("#certInput").val()};
        com_ajax.ajax('post', '/clientsvc/account/v1/web/sms/cert/check', JSON.stringify(data), res);
        sendCertCheck = true;
    }
})

function fnReadingMemberCheck(){
    memberFormCheck();
    const res = function(response) {
        if(response.code == "200"){
            let returnCode = response.data.code;
         if(returnCode == "200"){
             alert("인증되었습니다.");
             clearInterval(timerInterval);
             $(".vali").addClass("certOk");
             readingMemComplete = true;
             $("#parentNm").attr("disabled",true);
             $("#studentNm").attr("disabled",true);
             $("[name='yearSel']").attr("disabled",true);
             $("[name='monthSel']").attr("disabled",true);
             $("[name='daySel']").attr("disabled",true);
             $("#mdnNo").attr("disabled",true);
             $("#certCheckBtn").attr("disabled",true);
             $("#certInput").attr("disabled",true);
             $("#certSnBtn").attr("disabled",true);
             fnAllFormCheck();
         }else{
             $(".vali").removeClass("sendOk");
             $(".vali").removeClass("certOk");
             $(".vali").removeClass("certFail");
             if(returnCode == "400"){
                 fnReSetMdn();
                 alert("휴대폰 인증을 진행해 주세요.");
             }else if(returnCode == "401"){
                 fnReSetMdn();
                 alert("죄송합니다. \n" +
                 "이미 가입된 휴대전화번호입니다.\n" +
                 "도움이 필요하시면 고객센터로 문의해주세요");
             }else if(!common.isNull(returnCode)){
                 fnReSetMdn();
                 alert("슈퍼리딩,슈퍼브이 체험(결제) 이력이 있어,\n" +
                     "체험신청을 하실 수 없습니다. \n" +
                     "도움이 필요하시면 고객센터로 문의해주세요.");
             }
             certComplete = false;
             readingMemComplete = false;
         }
        }else{
            $(".vali").removeClass("sendOk");
            $(".vali").removeClass("certOk");
            $(".vali").removeClass("certFail");
            certComplete = false;
            readingMemComplete = false;
        }
    }
    let yearSel = $('[name="yearSel"]').val();
    let monthSel = $('[name="monthSel"]').val();
    let daySel = $('[name="daySel"]').val();
    if (parseInt(monthSel) < 10) {
        monthSel = "0" + monthSel;
    }
    if (parseInt(daySel) < 10) {
        daySel = "0" + daySel;
    }
    let data = {
        "parentNm": $("#parentNm").val(),
        "mdnNo": $("#mdnNo").val(),
        "stuName": $("#studentNm").val(),
        "birthdate":  yearSel + '-' + monthSel + '-' + daySel,
    };
    com_ajax.ajax('post', '/clientsvc/hpg/v1/svr/exp/member/check',  JSON.stringify(data), res);
}

function memberFormCheck(){
    if(common.isNull($("#parentNm").val())){
        alert("학부모 이름을 입력해주세요.")
        $("#parentNm").focus();
        return false;
    }
    if(common.isNull($("#studentNm").val())){
        alert("자녀 정보를 입력해주세요.")
        $("#studentNm").focus();
        return false;
    }
    if(common.isNull($("#studentNm").val())){
        alert("자녀 정보를 입력해주세요.")
        $("#studentNm").focus();
        return false;
    }
    if(common.isNull($('[name="yearSel"]').val())){
        alert("자녀 정보를 입력해주세요.")
        return false;
    }
    if(common.isNull($('[name="monthSel"]').val())){
        alert("자녀 정보를 입력해주세요.")
        return false;
    }
    if(common.isNull($('[name="daySel"]').val())){
        alert("자녀 정보를 입력해주세요.")
        return false;
    }
    if(common.isNull($("#mdnNo").val())){
        alert("휴대폰 번호를 입력해주세요.")
        return false;
    }
    return true;

}
function fnAllFormCheck(){
    if(common.isNull($("#parentNm").val())){
        $("#submitBtn").attr("disabled", true);
        return false;
    }
    if(common.isNull($("#studentNm").val())){
        $("#submitBtn").attr("disabled", true);
        return false;
    }
    if(common.isNull($('[name="yearSel"]').val())){
        $("#submitBtn").attr("disabled", true);
        return false;
    }
    if(common.isNull($('[name="monthSel"]').val())){
        $("#submitBtn").attr("disabled", true);
        return false;
    }
    if(common.isNull($('[name="daySel"]').val())){
        $("#submitBtn").attr("disabled", true);
        return false;
    }
    if(common.isNull($("#mdnNo").val())){
        $("#submitBtn").attr("disabled", true);
        return false;
    }
    if(common.isNull($("#certInput").val())){
        $("#submitBtn").attr("disabled", true);
        return false;
    }
    let siblingCheck = $("[name='sibling']:checked").val();
    if(common.isNull(siblingCheck)){
        $("#submitBtn").attr("disabled", true);
        return false;
    }
    let deviceType = $("[name='deviceType']:checked").val();
    if(common.isNull(deviceType)){
        $("#submitBtn").attr("disabled", true);
        return false;
    }
    if(common.isNull($("#zipcode").val())){
        $("#submitBtn").attr("disabled", true);
        return false;
    }
    if(common.isNull($("#address1").val())){
        $("#submitBtn").attr("disabled", true);
        return false;
    }
    if(common.isNull($("#address2").val())){
        $("#submitBtn").attr("disabled", true);
        return false;
    }
    let agreement = $("[name='agreement']:checked").val()
    if(common.isNull(agreement)){
        $("#submitBtn").attr("disabled", true);
        return false;
    }
    if(!certComplete){
        $("#submitBtn").attr("disabled", true);
        return false;
    }
    if(!readingMemComplete){
        $("#submitBtn").attr("disabled", true);
        return false;
    }
    $("#submitBtn").attr("disabled", false);
}


$(document).on('keyup click keydown', '#zipcode, #address1,#address2, [name="sibling"], [name="deviceType"],[name="agreement"]', function (){
    fnAllFormCheck();
});

$(document).on("click", "#submitBtn", function (){
    if(submitCheck && certComplete && readingMemComplete) {
        submitCheck = false;
        const res = function (response) {
            submitCheck = true;
            if (response.code == "200") {
                let returnCode = response.data.code;
                if (returnCode == "200") {
                    <!--2023.12.11 카울리 광고 관련 추가.-->
                    try {
                        if((thisUrl.indexOf("dev") == -1) && (thisUrl.indexOf("local") == -1)){
                            /*2023.12.18 카울리 관련 추가.*/
                            const caUrlParams = new URL(location.href).searchParams;
                            const cauly = caUrlParams.get("cauly_egmt_sec");
                            const cauly2 = caUrlParams.get("cauly_rt_code");
                            if(!common.isNull(cauly) && !common.isNull(cauly2)) {
                                var param = {
                                    track_code: "be2a78f5-604a-414d-95cc-728da62759f5",
                                    event_name: "CA_CONVERSION",
                                    event_param: $("#mdnNo").val()
                                };
                                cauly_send(param);
                            }
                        }
                    }catch (e) {
                        console.log(e);
                    }

                    fnAllInput();
                    let returnMap = response.data.info;
                    sessionStorage.setItem("reP", returnMap.parentId);
                    sessionStorage.setItem("rePI", returnMap.parentLoginId);
                    sessionStorage.setItem("reTY", returnMap.tempIdChangeYn);
                    sessionStorage.setItem("reS", returnMap.stuId);
                    sessionStorage.setItem("reSNm", returnMap.studentNm);
                    common.hrefFunction("/pages/event-complete.html")
                } else {
                    if(returnCode == 400){
                        alert("휴대폰 인증을 진행해 주세요.");
                    }else if(returnCode == 401){
                        fnReSetMdn();
                        alert("죄송합니다. \n" +
                            "이미 가입된 휴대전화번호입니다.\n" +
                            "도움이 필요하시면 고객센터로 문의해주세요");
                    }else if(!common.isNull(returnCode)){
                        fnReSetMdn();
                        alert("슈퍼리딩,슈퍼브이 체험(결제) 이력이 있어,\n" +
                            "체험신청을 하실 수 없습니다. \n" +
                            "도움이 필요하시면 고객센터로 문의해주세요.");
                    }
                }
            } else {
                $("#mdnNo").val('');
            }
        }
        let yearSel = $('[name="yearSel"]').val();
        let monthSel = $('[name="monthSel"]').val();
        let daySel = $('[name="daySel"]').val();
        if (parseInt(monthSel) < 10) {
            monthSel = "0" + monthSel;
        }
        if (parseInt(daySel) < 10) {
            daySel = "0" + daySel;
        }
        let inviteRecommCd="";
        let joinUrlCd="10"

        const urlParams = new URL(location.href).searchParams;
        const name = urlParams.get('recommendCd');
        /*23.09.28 join_url_cd 값 api에서 판정.*/
        if(!common.isNull(name)){
            inviteRecommCd = name;
           /* if(name.indexOf('supervp') != -1){
                joinUrlCd = 6;
            }else{
                joinUrlCd = 7;
            }*/
        }else if(!common.isNull(sessionStorage.getItem("recommendCd"))){
            inviteRecommCd = sessionStorage.getItem("recommendCd");
            /*if(sessionStorage.getItem("recommendCd").indexOf('supervp') != -1){
                joinUrlCd = 6;
            }else{
                joinUrlCd = 7;
            }*/
        }

        let data = {
            "name": $("#parentNm").val(),
            "mdnNo": $("#mdnNo").val(),
            "stuName": $("#studentNm").val(),
            "birthdate": yearSel + '-' + monthSel + '-' + daySel,
            "zipcode": $("#zipcode").val(),
            "address1": $("#address1").val(),
            "address2": $("#address2").val(),
            "deviceCaseDiv": $("[name='deviceType']:checked").val(),
            "brotherYn": $("[name='sibling']:checked").val(),
            "isServiceUseAgreed": $("[name='agreement']:checked").val(),
            "joinUrlCd": joinUrlCd,
            "inviteRecommCd" : inviteRecommCd,
            "msgSlogan" : "독서육아를 위한 읽기혁명 슈퍼브이 '슈퍼리딩'입니다.",
            "youtubeUrl" : "https://bit.ly/3QjF0ER"
        };
        let consultTime = "";
        $("[name='consultTime']").each(function (i) {
            if ($(this).is(":checked") == true) {
                let thisVal = $(this).val();
                if (thisVal == "consultMorning") {
                    data.consultMorningYn = "Y";
                    consultTime = "10,11,12"
                }
                if (thisVal == "consultAfter") {
                    data.consultAfterYn = "Y";
                    if (!common.isNull(consultTime)) {
                        consultTime += ",13,14,15,16,17"
                    } else {
                        consultTime = "13,14,15,16,17";
                    }
                }
                if (thisVal == "consultEven") {
                    data.consultEvenYn = "Y";
                    if (!common.isNull(consultTime)) {
                        consultTime += ",18,19,20"
                    } else {
                        consultTime = "18,19,20";
                    }
                }
            }
        });
        if (!common.isNull(consultTime)) {
            data.consultTime = consultTime
        }
        let salesRecommCd = urlParams.get('salesRecommCd');
        if(!common.isNull(sessionStorage.getItem("salesRecommCd"))) {
            salesRecommCd = sessionStorage.getItem("salesRecommCd");
        }else if(!common.isNull(thisSalesId)){
            salesRecommCd = thisSalesId;
        }
        if(!common.isNull(salesRecommCd)){
            data.salesManagerId = parseInt(salesRecommCd);
        }
        /*2023.05.15 체험신청 후, 문자메세지 내용 전달*/
        let msgBody = "[광고] 슈퍼리딩 추천하면 1만원 드림!\n" +
            "\n" +
            "안녕하세요 #myName님\n" +
            "\n" +
            "슈퍼리딩을 친구에게 소개하고 '네이버페이 1만원' 받으세요\n" +
            "친구가 무료체험하면 네이버페이 1만원!\n" +
            "구매하면 신세계 상품권 3만원까지!\n" +
            "\n" +
            "◆참여방법◆\n" +
            "아래의 회원님만의 추천링크를 \n" +
            "친구에게 전달해 주세요.\n" +
            "\n" +
            "★회원님만의 추천링크\n" +
            "#myRecommCd \n" +
            "\n" +
            "※친구가 반드시 위 링크를 직접 클릭하여 접속하도록 안내해주세요\n" +
            "\n" +
            "◆참여혜택(1)◆\n" +
            "친구가 회원님의 추천링크를 통해 무료체험하면\n" +
            "★나도 친구도 '네이버페이 1만원'\n" +
            "(1인당 월 최대 10만원)\n" +
            "\n" +
            "◆참여혜택(2)◆\n" +
            "친구가 회원님의 추천링크를 통해 구매하면 \n" +
            "★나도 친구도 '신세계상품권 3만원'\n" +
            "(1인당 월 최대 30만원)\n" +
            "\n" +
            "★형제, 가족간 추천 등 부정참여는 고지없이 대상에서 제외됩니다!\n" +
            "\n" +
            "◆경품지급◆\n" +
            "4/17(수) LMS로 일괄 발송\n" +
            "(단, 친구가 '신규' 체험자이며 태블릿 로그인 완료한 경우에 한함)\n" +
            "\n" +
            "지금 바로 슈퍼리딩을 친구에게 추천하세요!\n" +
            "무료수신거부 0805331777";
        data.msgBody = msgBody;

        com_ajax.ajax('post', '/clientsvc/hpg/v1/svr/exp/member/info', JSON.stringify(data), res);
    }
})

function fnAllInput() {
    $(".vali").removeClass("sendOk");
    $(".vali").removeClass("certOk");
    $(".vali").removeClass("certFail");
    $("#parentNm").val('');
    $("#parentNm").attr("disabled", false);
    $("#studentNm").val('');
    $("#studentNm").attr('disabled', false);
    $("#childAgeSel").val('');
    $("#mdnNo").val('');
    $("#mdnNo").attr('disabled', false);
    $("#certInput").val('');
    $("#certInput").attr('disabled', true);
    $("#certSnBtn").html("인증번호");
    $("#restTime").html("03:00");
    clearInterval(timerInterval);
    $("#certSnBtn").attr('disabled', true);
    $("#submitBtn").attr('disabled', true);
    $("[name='sibling']").prop("checked", false);
    $("[name='deviceType']").prop("checked", false);
    $("#zipcode").val('');
    $("#address1").val('');
    $("#address2").val('');
    $("[name='consultTime']").prop("checked", false);
    $("[name='agreement']").prop("checked", false);
    $("[name='yearSel']").val('');
    $("[name='monthSel']").val('');
    $("[name='daySel']").val('');
}

function fnReSetMdn(){
    $("#mdnNo").val('');
    $("#certSnBtn").html("인증번호");
    $("#mdnNo").attr("disabled", false);
    $("#certInput").val('');
    $("#certInput").attr("disabled", true);
    $("#certSnBtn").attr("disabled", true);
    $("#certCheckBtn").attr("disabled", true);
    $("#restTime").html("03:00");
    clearInterval(timerInterval);
}

