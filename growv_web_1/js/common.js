/*도메인 설정*/
let prefixUrl = "http://localhost:8080";

var thisUrl = new URL(location.href).host;
    if(thisUrl.indexOf('dev') != -1){
        prefixUrl = "https://dev-www.superv.com";
    }else if(thisUrl.indexOf('www.superv.com') != -1){
        prefixUrl = "https://www.superv.com";
    }else if(thisUrl.indexOf('superv.com') != -1){
        prefixUrl = "https://www.superv.com";
    }
const ACCESS_TOKEN_NAME = "accessToken";
const EXPIRED_TIME_NAME = "expiredTime";
const REFRESH_TOKEN_NAME = "refreshToken";
let myHeaders;

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
                    common.hrefFunction('/member/login.html')
                    return false;
                }
                if(!common.isNull(xhr.responseJSON) && !common.isNull(xhr.responseJSON.message) && xhr.responseJSON.message != null){
                    alert(xhr.responseJSON.message);
                    return false;
                }
                else if (xhr.status === 401) {
                    alert("권한이 없습니다. 다시 로그인 해주세요");
                    jwt.destroyAll();
                    common.hrefFunction('/member/login.html')
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
            url: c_url,
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
        if(nextUrl.indexOf("?") != -1){
            if(!common.isNull(name)){
                sessionStorage.setItem("recommendCd", name);
                nextUrl = nextUrl+"&recommendCd="+name;
            }else if(!common.isNull(sessionStorage.getItem("recommendCd"))){
                nextUrl = nextUrl+"&recommendCd="+sessionStorage.getItem("recommendCd");
            }else{
                nextUrl = nextUrl;
            }
        }else{
            if(!common.isNull(name)){
                sessionStorage.setItem("recommendCd", name);
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
                nextUrl = nextUrl+"&salesRecommCd="+name2;
            }else if(!common.isNull(sessionStorage.getItem("salesRecommCd"))){
                nextUrl = nextUrl+"&salesRecommCd="+sessionStorage.getItem("salesRecommCd");
            }else{
                nextUrl = nextUrl;
            }
        }else{
            if(!common.isNull(name2)){
                sessionStorage.setItem("salesRecommCd", name2);
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
$(window).on("beforeunload", function(){
    sessionStorage.removeItem("recommendCd");
    sessionStorage.removeItem("salesRecommCd");
});

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

function fnGetThisPop(thisId){
    $("#"+thisId).addClass("active");
    $("body").css("overflow","hidden");
    $("body").addClass("disabled");
}

function fnCloseThisPop(thisId){
    $("body").removeClass("disabled");
    $("#"+thisId).removeClass("active");
    $("body").css("overflow","auto");

}