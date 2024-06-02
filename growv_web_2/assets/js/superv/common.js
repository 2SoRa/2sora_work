/*도메인 설정*/
let prefixUrl = "https://dev-reading.superv.com";
// let prefixUrl = "http://localhost:8080";
var thisUrl = new URL(location.href).host;
if(thisUrl.indexOf('dev') != -1) {
    prefixUrl = "https://dev-reading.superv.com";
}else if(thisUrl.indexOf('www.superv.com') != -1){
    prefixUrl = "https://www.superv.com";
}else if(thisUrl.indexOf('superv.com') != -1){
    prefixUrl = "https://reading.superv.com";
}else if(thisUrl.indexOf('reading.superv.com') != -1){
    prefixUrl = "https://reading.superv.com";
}else if(thisUrl.indexOf('teaser.superv.com') != -1){
    prefixUrl = "https://www.superv.com";
}else if(thisUrl.indexOf('10.10.') != -1){
    prefixUrl = "http://10.10.21.242:8080";
}
/*도메인 설정*/
// let prefixUrl = "https://dev-reading.superv.com";
/*
let prefixUrl = "http://localhost:8080";
var thisUrl = new URL(location.href).host;
if(thisUrl.indexOf('dev') != -1) {
    prefixUrl = "https://dev-reading.superv.com";
}else if(thisUrl.indexOf('www.superv.com') != -1){
    prefixUrl = "https://www.superv.com";
}else if(thisUrl.indexOf('superv.com') != -1){
    prefixUrl = "https://www.superv.com";
}else if(thisUrl.indexOf('reading.superv.com') != -1){
    prefixUrl = "https://www.superv.com";
}else if(thisUrl.indexOf('teaser.superv.com') != -1){
    prefixUrl = "https://www.superv.com";
}else if(thisUrl.indexOf('10.10.') != -1){
    prefixUrl = "http://10.10.21.242:8080";
}
*/

const ACCESS_TOKEN_NAME = "accessToken";
const EXPIRED_TIME_NAME = "expiredTime";
const REFRESH_TOKEN_NAME = "refreshToken";
let myHeaders;
let memberShipCheck = false;
let couponSamCheck = false;

const jwt = {
    saveAllToken : function (jwtData){
        this.saveToken(jwtData.accessToken);
        this.saveExpiredTime(jwtData.expiredTime);
        this.saveRefreshToken(jwtData.refreshToken);
        /*myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+jwtData.accessToken);*/
        myHeaders = "Bearer "+jwtData.accessToken;
    },
    saveHeaderToken : function (accessToken){
        myHeaders = "Bearer "+accessToken;
        sessionStorage.setItem(ACCESS_TOKEN_NAME, accessToken);
    },
    saveToken : function (token) {
        sessionStorage.setItem(ACCESS_TOKEN_NAME, token);
    },
    saveExpiredTime : function (expiredTime) {
        sessionStorage.setItem(EXPIRED_TIME_NAME, expiredTime);
    },
    saveRefreshToken :function (token) {
        sessionStorage.setItem(REFRESH_TOKEN_NAME, token);
    },
    destroyAll : function () {
        sessionStorage.removeItem(ACCESS_TOKEN_NAME);
        sessionStorage.removeItem(EXPIRED_TIME_NAME);
        sessionStorage.removeItem(REFRESH_TOKEN_NAME);
        sessionStorage.removeItem("vuex");
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() - 1);
        document.cookie = "SuperVAKey" + "= " + "; path=/; expires=" + expireDate.toGMTString();
        document.cookie = "SuperVAKey" + "= " + "; domain=.superv.com; path=/; expires=" + expireDate.toGMTString();
        myHeaders = null;
    },
    getAllToken : function(){
        return sessionStorage;
    }
}
// 모바일 기기 체크
function commonisMobile(){
    var UserAgent = navigator.userAgent;
    console.log(UserAgent);
    if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
        return true;
    } else {
        return false;
    }
}

const com_ajax = {
    ajax: function (c_method, c_url, c_data, c_callback) {
        $.ajax({
            name: "form",
            type: c_method,
            url: prefixUrl + c_url,
            data: c_data,
            contentType : "application/json",
            success: function (response, status, req) {
                c_callback(response);
            },beforeSend : function(xhr) {
                var headerToken = jwt.getAllToken().getItem(ACCESS_TOKEN_NAME);
                if(!common.isNull(headerToken)){
                    xhr.setRequestHeader("Authorization", "Bearer "+headerToken);
                }
            },error: function (xhr, status, error) {
                $('.btn_formsubmit').removeClass("block");
                if(!common.isNull(xhr.responseJSON) && !common.isNull(xhr.responseJSON.code) && xhr.responseJSON.code == 'EXPIRED'){
                    alert("로그인 시간이 만료되었습니다. 재로그인 해주세요.");
                    jwt.destroyAll();
                    common.hrefFunction('/main/login');
                    return false;
                }
                if(!common.isNull(xhr.responseJSON) && !common.isNull(xhr.responseJSON.message) && xhr.responseJSON.message != null){
                    alert(xhr.responseJSON.message);
                    return false;
                }
                else if (xhr.status === 401) {
                    alert("권한이 없습니다. 다시 로그인 해주세요");
                    jwt.destroyAll();
                    common.hrefFunction('/main/login');
                } else if (xhr.status === 403) {
                    //window.location.reload();
                }else{
                    alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                }

            }
           , complete: function () {
                $('#commonLoading').removeClass('active');
            }
        });
    },
    ajaxAsyncF: function (c_method, c_url, c_data, c_callback) {
        $.ajax({
            name: "form",
            type: c_method,
            url: prefixUrl + c_url,
            data: c_data,
            contentType : "application/json",
            async: false,
            success: function (response, status, req) {
                c_callback(response);
            },beforeSend : function(xhr) {
                var headerToken = jwt.getAllToken().getItem(ACCESS_TOKEN_NAME);
                if(!common.isNull(headerToken)){
                    xhr.setRequestHeader("Authorization", "Bearer "+headerToken);
                }
            },error: function (xhr, status, error) {
                $('.btn_formsubmit').removeClass("block");
                if(!common.isNull(xhr.responseJSON) && !common.isNull(xhr.responseJSON.code) && xhr.responseJSON.code == 'EXPIRED'){
                    alert("로그인 시간이 만료되었습니다. 재로그인 해주세요.");
                    jwt.destroyAll();
                    common.hrefFunction('/main/login');
                    return false;
                }
                if(!common.isNull(xhr.responseJSON) && !common.isNull(xhr.responseJSON.message) && xhr.responseJSON.message != null){
                    alert(xhr.responseJSON.message);
                    return false;
                }
                else if (xhr.status === 401) {
                    alert("권한이 없습니다. 다시 로그인 해주세요");
                    jwt.destroyAll();
                    common.hrefFunction('/main/login');
                } else if (xhr.status === 403) {
                    //window.location.reload();
                }else{
                    alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                }

            }
           , complete: function () {
                $('#commonLoading').removeClass('active');
            }
        });
    }
    , ajax_json: function (c_method, c_url, c_data, c_callback) {
        $.ajax({
            name: "form",
            type: c_method,
            url: prefixUrl + c_url,
            data: c_data,
            contentType: "application/json;charset=UTF-8",
            success: function (response, status, req) {
                c_callback(response);
            },beforeSend : function(xhr) {
                var headerToken = jwt.getAllToken().getItem(ACCESS_TOKEN_NAME);
                if(!common.isNull(headerToken)){
                    xhr.setRequestHeader("Authorization", "Bearer "+headerToken);
                }
            }, error: function (request, xhr, error) {
                console.log(request.responseText);
                if (xhr.status === 403) {
                    //window.location.reload();
                }
            }, complete: function () {
                $('#commonLoading').removeClass('active');

            }
        });
    }, ajaxFile: function (c_method, c_url, c_data, c_callback) {
        $.ajax({
            name: "form",
            type: c_method,
            url:  prefixUrl + c_url,
            data: c_data,
            contentType: false,
            processData: false,
            enctype : 'multipart/form-data',  // * 중요
            success: function (response, status, req) {
                c_callback(response);
            },beforeSend : function(xhr) {
                var headerToken = jwt.getAllToken().getItem(ACCESS_TOKEN_NAME);
                if(!common.isNull(headerToken)){
                    xhr.setRequestHeader("Authorization", "Bearer "+headerToken);
                }
            }, error: function (request, xhr, error) {
                if(!common.isNull(JSON.parse(request.responseText).message) ){
                    alert(JSON.parse(request.responseText).message);
                    return false;
                }else{
                    alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                }
                console.log(request.responseText);
                if (xhr.status === 403) {
                    //window.location.reload();
                }
            }, complete: function () {
                $('#commonLoading').removeClass('active');

            }
        });
    }
};
const common = {
    // 숫자 콤마
    comma: function (e) {
        return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }, dashForPhone: function (e) {
        return e.replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3").replace("--", "-");
    }, emailcheck: function (obj) {
        //let regExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        let regExp = /^([\w\.\_\-])*[a-zA-Z0-9]+([\w\.\_\-])*([a-zA-Z0-9])+([\w\.\_\-])+@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/i;

        /* let regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+")){3,}@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;*/

        if (obj === "" && obj == null) {
            return false;
        } else if (!regExp.test(obj)) {
            return false
        }
        return true;
    }, phonecheck: function (obj) {
        let regExp = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})?[0-9]{3,4}?[0-9]{4}$/;

        if (obj === "" && obj == null) {
            return false;
        } else if (!regExp.test(obj)) {
            return false
        }
        return true;
    },numberReplace(number) {
        number.value = number.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    },isNull(str){
        if (str === null) return true;
        if (typeof str === 'string' && str === '') return true;
        if (typeof str === 'undefined') return true;

        return false;
    },pwCheck : function (str){
        var regExp = /^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?:[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]{8,18}$/;
        if (str.match(regExp) == null) {
            return false;
        }else {
            return true;
        }
    },hrefFunction : function (nextUrl){
        const urlParams = new URL(location.href).searchParams;
        const name = urlParams.get('recommendCd');

        //쿠키값 Set
        if(nextUrl.indexOf("?") != -1){
            if(!common.isNull(name)){
                sessionStorage.setItem("recommendCd", name);
                var cookieValue = escape(name) + "; path=/;";
                document.cookie = "recommendCd" + "=" + cookieValue;

                nextUrl = nextUrl+"&recommendCd="+name;
            }else if(!common.isNull(sessionStorage.getItem("recommendCd"))){
                nextUrl = nextUrl+"&recommendCd="+sessionStorage.getItem("recommendCd");
            }else{
                nextUrl = nextUrl;
            }
        }else{
            if(!common.isNull(name)){
                sessionStorage.setItem("recommendCd", name);
                var cookieValue = escape(name) + "; path=/;";
                document.cookie = "recommendCd" + "=" + cookieValue;

                nextUrl = nextUrl+"?recommendCd="+name;
            }else if(!common.isNull(sessionStorage.getItem("recommendCd"))){
                nextUrl = nextUrl+"?recommendCd="+sessionStorage.getItem("recommendCd");
            }else{
                nextUrl = nextUrl;
            }
        }
        const name2 = urlParams.get('salesRecommCd');
        if(nextUrl.indexOf("?") != -1){
            if(!common.isNull(name2)){
                sessionStorage.setItem("salesRecommCd", name2);
                var cookieValue = escape(name2) + "; path=/;";
                document.cookie = "salesRecommCd" + "=" + cookieValue;

                nextUrl = nextUrl+"&salesRecommCd="+name2;
            }else if(!common.isNull(sessionStorage.getItem("salesRecommCd"))){
                nextUrl = nextUrl+"&salesRecommCd="+sessionStorage.getItem("salesRecommCd");
            }else{
                nextUrl = nextUrl;
            }
        }else{
            if(!common.isNull(name2)){
                sessionStorage.setItem("salesRecommCd", name2);
                var cookieValue = escape(name2) + "; path=/;";
                document.cookie = "salesRecommCd" + "=" + cookieValue;
                
                nextUrl = nextUrl+"?salesRecommCd="+name2;
            }else if(!common.isNull(sessionStorage.getItem("salesRecommCd"))){
                nextUrl = nextUrl+"?salesRecommCd="+sessionStorage.getItem("salesRecommCd");
            }else{
                nextUrl = nextUrl;
            }
        }


        /*2023.12.18 카울리 관련 추가.*/
        const cauly = urlParams.get("cauly_egmt_sec");
        const cauly2 = urlParams.get("cauly_rt_code");
        if(!common.isNull(cauly) && !common.isNull(cauly2)){
            if(nextUrl.indexOf("?") != -1){
                nextUrl = nextUrl+"&cauly_egmt_sec="+cauly+"&cauly_rt_code="+cauly2;
            }else{
                nextUrl = nextUrl+"?cauly_egmt_sec="+cauly+"&cauly_rt_code="+cauly2;
            }
        }



        const popTrigger = urlParams.get('popTrigger');
        if(!common.isNull(popTrigger)){
            sessionStorage.setItem("popTrigger", popTrigger);
        }


        location.href = nextUrl;

    },nameCheck(thisName){
        var curVal = thisName;
        var pattern = /[\u3131-\u314e|\u314f-\u3163|\uac00-\ud7a3]/g;
        var koreanLangCnt = !!curVal.match(pattern) ? curVal.match(pattern).length : 0;
        var etcLangCnt = curVal.length - koreanLangCnt;
        var koreanLangByte = koreanLangCnt * 2;
        var etcLangByte = etcLangCnt;
        var totalCnt = koreanLangByte + etcLangByte;
        var regex = /^[ㄱ-ㅎㅏ-ㅣ가-힣|ᆞ|ᆢ|ㆍ|ᆢ|ᄀᆞ|ᄂᆞ|ᄃᆞ|ᄅᆞ|ᄆᆞ|ᄇᆞ|ᄉᆞ|ᄋᆞ|ᄌᆞ|ᄎᆞ|ᄏᆞ|ᄐᆞ|ᄑᆞ|ᄒᆞㅣ\u318Dㅣ\u119Eㅣ\u11A2ㅣ\u2022ㅣ\u2025ㅣ\u00B7ㅣ\uFE55|a-z|A-Z]+$/;
        /*한글/영문만 입력가능*/
        if(!regex.test(curVal)){
            curVal = curVal.slice(0, curVal.length-1)
        }
        var reg2 = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
        curVal = curVal.replace(reg2,'');
        /*20Byte 체크*/
        if(totalCnt > 20){
            while(totalCnt > 20){
                curVal = curVal.substring(0, curVal.length-1);
                totalCnt = getByte(curVal);
            }
        }
        return curVal;
    },decodeHTMLEntities(str) {
        if(!this.isNull(str)) {
            str = String(str);
            str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
            str = str.replace(/alert\([^]*>([\S\s]*?)\)/gmi, '');
            str = str.replace(/alert/gmi, '');
            str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
            str = str.replace(/\{\}\(|\)|<|>|\#|&|\'|\"|\=/gmi, '');
            var reg2 = /[\{\}\(|\)|<|>|\#|&|\'|\"|\=]/gi;
            str = str.replace(reg2,'');
            var element = document.createElement('div');
            element.innerHTML = str;
            str = element.textContent;
            element.textContent = '';
        }
        return str;
    },inputLengthCheck(thisVal){
        /*oninput 으로 사용*/
        /*oninput="common.inputLengthCheck(this);"*/
        if (thisVal.value.length > thisVal.maxLength) thisVal.value = thisVal.value.slice(0, thisVal.maxLength);
        if(!common.isNull($("#currentTextLength")) && thisVal.name == 'currentTextLength'){
            $("#currentTextLength").html(thisVal.value.length);
        }
    }
};

// 모바일 기기 체크
function isMobile(){
    var UserAgent = navigator.userAgent;

    if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
        return true;
    } else {
        return false;
    }
}
/*

$(window).on("beforeunload", function(){
    jwt.destroyAll();
    fnLoginCheck();
    sessionStorage.removeItem("recommendCd");
    sessionStorage.removeItem("salesRecommCd");

});
$(window).bind("beforeunload", function (e){
    jwt.destroyAll();
    fnLoginCheck();
    sessionStorage.removeItem("recommendCd");
    sessionStorage.removeItem("salesRecommCd");
});
*/

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);


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

function replaceTag(thisName){
    thisName = '#'+thisName;
    if(!common.isNull($(thisName).val())) {
        let str = $(thisName).val();
        str = common.decodeHTMLEntities(str);
        $(thisName).val(str);
    }
}
const comRecommendUrlParams = new URL(location.href).searchParams;
const comRecommendCd = comRecommendUrlParams.get('recommendCd');
if(!common.isNull(comRecommendCd)){
    sessionStorage.setItem("recommendCd", comRecommendCd);
}else{
    sessionStorage.removeItem("recommendCd");
}
const comSalesCode = comRecommendUrlParams.get('salesRecommCd');
if(!common.isNull(comSalesCode)){
    sessionStorage.setItem("salesRecommCd", comSalesCode);
}

function fnLoginCheck(){
    /*23.11.17 쿠키로 로그인 확인*/
    let thisCookieCheck = 0;
    let thisCookieVal = null;
    var x, y;
    var val = document.cookie.split(';');
    for (var i = 0; i < val.length; i++) {
        x = val[i].substr(0, val[i].indexOf('='));
        y = val[i].substr(val[i].indexOf('=') + 1);
        x = x.replace(/^\s+|\s+$/g, '');
        if (x == "SuperVAKey") {
            if (!common.isNull(y)) {
                thisCookieCheck++;
                thisCookieVal = y;
            }
        }
    }

    var jwtTokcen = jwt.getAllToken();
    var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));

    /*쿠키값 존재시*/
    if(!common.isNull(thisCookieVal)){
        if(common.isNull(jwtTokcen.getItem(ACCESS_TOKEN_NAME)) || common.isNull(jwtTokcen.getItem(EXPIRED_TIME_NAME)) ){
            jwt.saveHeaderToken(thisCookieVal);
            const res = function(response) {
                let apiCheck = false;
                if(response.code == "200"){
                    if(response.data.code == 200){
                        sessionStorage.setItem("vuex",JSON.stringify(response.data.info));
                        jwt.saveExpiredTime(response.data.expiredTime);
                        apiCheck = true;

                        jwtTokcen = jwt.getAllToken();
                        userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
                        fnGetMemberShipApi(userInfo);
                        fnSetLoginInfo(userInfo);
                        fnGetCouponSamMemberApi(userInfo);
                    }
                }
                if(!apiCheck){
                    jwt.destroyAll();
                    return false;
                }else{
                    return true;
                }
            }
            let data = [];
            /*23.07.20*/
            com_ajax.ajaxAsyncF('post', '/clientsvc/hpg/v1/svr/member/reading/login',  data, res);
        }else{
            fnGetMemberShipApi(userInfo);
            fnSetLoginInfo(userInfo);
            fnGetCouponSamMemberApi(userInfo);
            return true;
        }
    }else{
        jwt.destroyAll();
        $("#mLogoutPart").removeClass("d-inline-block");
        $("#mMyPage").removeClass("d-block");

        $("[name='loginUserName']").html();
        $("[name='loginPart']").removeClass("d-flex");
        $("[name='loginPart']").addClass("d-done");
        $("[name='loginPart']").hide();

        $("[name='logoutPart']").removeClass("d-done");
        $("[name='logoutPart']").addClass("d-flex");
        $("[name='logoutPart']").show();
        $("[name='readingCart']").hide();

        return false;
    }
}

function fnGetMemberShipApi(userInfo){
    /*유료회원여부 확인*/
    const res2 = function(response) {
        if(response.code == "200"){
            if(!common.isNull(response.data)){
                if(response.data.membership == true ||response.data.membership == "true" ){
                    memberShipCheck = true;
                }
            }
            if(memberShipCheck){
                $("[name='memberShipSpan']").show();
            }else{
                $("[name='memberShipSpan']").hide();
            }
        }else{
            return false;
        }
    }
    let data2 =
        {
            "parentId" : userInfo.parentId,
        };
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/hpg/v1/svr/member/reading/order/check', JSON.stringify(data2), res2);
    /*카트에 독서상품 확인*/
    const res = function(response) {
        if(response.code == "200"){
            if(!common.isNull(response.data)){
                if(parseInt(response.data) > 0){
                    $("[name='readingCart']").show();
                }else{
                    $("[name='readingCart']").hide();
                }
            }
        }else{
            return false;
        }
    }
    let subscribeData =
        {
            "parentId" : userInfo.parentId,
            "supervreadKorSubscribeYn" : "Y",
            "supervreadEngSubscribeYn" : "Y"
        };
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/hpg/v1/svr/order/cart', JSON.stringify(subscribeData), res);
}

function fnGetCouponSamMemberApi(userInfo){
        /*유료회원여부 확인*/
        const res2 = function(response) {
            if(response.code == "200"){
                if(!common.isNull(response.data)){
                    if(response.data.samCheck == true ||response.data.samCheck == "true" ){
                        couponSamCheck = true;
                    }
                }
                if(couponSamCheck){
                    $("[name='couponSamSpan']").addClass("d-flex");
                    $("[name='couponSamSpan']").removeClass("d-done");
                    $("[name='couponSamSpan']").show();
                }else{
                    $("[name='couponSamSpan']").removeClass("d-flex");
                    $("[name='couponSamSpan']").addClass("d-done");
                    $("[name='couponSamSpan']").hide();
                }
            }else{
                return false;
            }
        }
        let data2 =
            {
                "parentId" : userInfo.parentId,
            };
        /*23.07.20*/
        com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/mypage/coupon/sam/check', JSON.stringify(data2), res2);
}

function fnSetLoginInfo(userInfo){
    $("[name='loginPart']").addClass("d-flex");
    $("[name='loginPart']").removeClass("d-done");
    $("[name='loginPart']").show();

    $("[name='logoutPart']").removeClass("d-flex");
    $("[name='logoutPart']").addClass("d-done");
    $("[name='logoutPart']").hide();
    $("#mLogoutPart").addClass("d-inline-block");
    $("#mMyPage").addClass("d-block");


    var thisUserName = $("[name='loginUserName']").html();
    if(common.isNull(thisUserName)){
        $("[name='loginUserName']").html("<em class='txt-name'>" + userInfo.parentName + "</em>님");
    }
}

// 로그아웃
function fnLogoutBtn(){
    jwt.destroyAll();
    alert("정상적으로 로그아웃 되었습니다.");
    fnLoginCheck();
    common.hrefFunction("/main/logout");
}
function fnGetThisPop(thisId){
    $("#"+thisId).addClass("active");
    $("body").css("overflow","hidden");
    $("body").addClass("disabled");

    /* popup-scroll-area 객체 있는 경우 해당 영역 스크롤탑 0 - nature */
    if($("#"+thisId).find('.popup-scroll-area').length >= 1) {
        $("#"+thisId).find('.popup-scroll-area').scrollTop(0);
    }
}

function fnCloseThisPop(thisId){
    $("body").removeClass("disabled");
    $("#"+thisId).removeClass("active show");
    $("body").css("overflow","auto");

}