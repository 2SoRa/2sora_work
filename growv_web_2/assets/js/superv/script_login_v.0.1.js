$(window).on('load', function() {
    var loginId = getCookie("userInputId");
    if(!common.isNull(loginId)){
        $("#idSaveCheck").attr("checked", "checked");
        $("#userId").val(loginId);
    }
})

// 로그인
function fnLoginBtn(){
    var thisId = $("#userId").val();
    var thisPw = $("#userPw").val();
    // $('.custom-error').hide();
    /*2023.07.05 임시회원 로그인 및 간편가입 연결로 인하여 유효성 변경.*/
   /* if(!common.emailcheck(thisId)){
        // $('.custom-error.email').show();
        $('.custom-error.email').removeClass('hide');
        return false;
    };
    if(common.isNull(thisPw)){
        // $('.custom-error.password').show();
        $('.custom-error.password').removeClass('hide');
        return false;
    }
    if(!thisPw.startsWith("010")){
        if(!common.pwCheck(thisPw)){
            // $('.custom-error.password').show();
            $('.custom-error.password').removeClass('hide');
            return false;
        }
    }else{
        $('.custom-error.password').addClass('hide');
    }*/
    if(common.isNull(thisId)){
        $('.custom-error.email').removeClass('hide');
        return false;
    };
    if(common.isNull(thisPw)){
        $('.custom-error.password').removeClass('hide');
        return false;
    }
    const res = function(response) {
        if(response.code == "200"){
            fnGetTempMemberCheck(response.data);
        }else{
            if(response.message != null){
                alert(response.message);
            }else{
                alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            }
            return false;
        }
    }
    let data = {"email" : thisId, "password" : thisPw};
    data = JSON.stringify(data);
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/account/v1/web/user/login',  data, res);

}

function fnSaveUserInfo(){
    const res = function(response) {
        if(response.code == "200"){
            sessionStorage.setItem("vuex",JSON.stringify(response.data));
            /*var jwtTokcen = jwt.getAllToken();
            var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
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

            /*쿠키저장*/
            if($("#idSaveCheck").is(":checked")){
                var userInputId = $("#userId").val();
                setCookie("userInputId", userInputId, 60);
            } else {
                deleteCookie("userInputId");
            }
            var beforePage = document.referrer;
            if(!common.isNull(beforePage) && beforePage.indexOf("/pages/member/") == -1){
                location.href = beforePage;
            }else{
                common.hrefFunction("/");
            }
        }else{
            alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            return false;
        }
    }
    let data = [];
    /*23.07.20*/
    com_ajax.ajax('get', '/clientsvc/account/v1/web/user/info',  data, res);
}
//쿠키값 Set
function setCookie(cookieName, value, exdays){
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" +
        exdate.toGMTString());
    document.cookie = cookieName + "=" + cookieValue;
}

//쿠키값 Delete
function deleteCookie(cookieName){
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() - 1);
    document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
}
//쿠키값 가져오기
function getCookie(cookie_name) {
    var x, y;
    var val = document.cookie.split(';');

    for (var i = 0; i < val.length; i++) {
        x = val[i].substr(0, val[i].indexOf('='));
        y = val[i].substr(val[i].indexOf('=') + 1);
        x = x.replace(/^\s+|\s+$/g, ''); // 앞과 뒤의 공백 제거하기

        if (x == cookie_name) {
            return unescape(y); // unescape로 디코딩 후 값 리턴
        }
    }
}


/*20221125_기존Script*/
var isDisabled = false;
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

    $("body").on("keyup", ".custom-input", function(){
        $(".custom-input").each(function(i){
            var ck = $(this).val();
            if(ck != ""){
                isDisabled = true;
            }else{
                isDisabled = false;
                return false;
            }
        })
        if(isDisabled){
            $(".custom-button").removeClass("disabled").prop("disabled", false);
        }else{
            $(".custom-button").addClass("disabled").prop("disabled", true);
        }
    });
});

function fnGetTempMemberCheck(thisData) {
    jwt.saveHeaderToken(thisData.accessToken);
    const res = function(response) {
        if(response.code == "200"){
            if(response.data.tempIdChangeYn){
                jwt.saveAllToken(thisData);
                fnSaveUserInfo();
            }else if(!response.data.tempIdChangeYn){
                if(confirm("임시 아이디로 로그인하셨습니다.\n지금 회원가입 하시겠습니까?")){
                    common.hrefFunction('/pages/member/signup.html');
                }else{
                    jwt.destroyAll();
                    return false;
                }
            }else{
                jwt.destroyAll();
                alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                return false;
            }
        }else{
            jwt.destroyAll();
            alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            return false;
        }
    }
    let data = [];
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/web/temp/check',  data, res);
}
