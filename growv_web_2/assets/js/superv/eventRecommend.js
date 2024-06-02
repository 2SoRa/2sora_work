$(document).ready(function () {
    fnLoginCheck();
    Kakao.init('3aab5acc1818ba93539b4571c7130624'); // 사용하려는 앱의 JavaScript 키 입력
});

// 공유하기
function shareEventPage() {
    if (!thisEventLoginCheck()) {
        if (confirm("로그인이 필요합니다. 로그인 하시겠습니까?")) {
            common.hrefFunction('/main/login');
            return false;
        } else {
            return false;
        }
    }
    let textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    var myRecommCd = null;
    var eventJwtToken = jwt.getAllToken();
    if (!common.isNull(eventJwtToken.getItem("vuex"))) {
        var userInfo = JSON.parse(eventJwtToken.getItem("vuex"));
        if (!common.isNull(userInfo.myRecommCd)) {
            myRecommCd = "?recommendCd=" + userInfo.myRecommCd;
        }
    }
    let url = '';
    var thisUrl = new URL(location.href).host;
    if(thisUrl.indexOf('dev') != -1) {
        url = "https://dev-reading.superv.com";
    }else if(thisUrl.indexOf('superv.com') != -1){
        url = "https://reading.superv.com";
    }else if(thisUrl.indexOf('reading.superv.com') != -1) {
        url = "https://reading.superv.com";
    }
    textarea.value = url+"/"+myRecommCd;  // textarea 값에 url를 넣어줌
    textarea.select();  //textarea를 설정
    document.execCommand("copy");   // 복사
    document.body.removeChild(textarea); //extarea 요소를 없애줌

    alert("URL이 복사가 완료되었습니다.")  // 알림창
}

function shareEventKaKaoPage() {
    if (!thisEventLoginCheck()) {
        if (confirm("로그인이 필요합니다. 로그인 하시겠습니까?")) {
            common.hrefFunction('/main/login');
            return false;
        } else {
            return false;
        }
    }
    var eventJwtToken = jwt.getAllToken();
    var myRecommCd = null;
    if (!common.isNull(eventJwtToken.getItem("vuex"))) {
        var userInfo = JSON.parse(eventJwtToken.getItem("vuex"));
        if (!common.isNull(userInfo.myRecommCd)) {
            myRecommCd = "?recommendCd=" + userInfo.myRecommCd;
        }
    }
    let textarea = document.createElement("textarea");
    //url 변수 생성 후, textarea라는 변수에 textarea의 요소를 생성
    document.body.appendChild(textarea); //</body> 바로 위에 textarea를 추가(임시 공간이라 위치는 상관 없음)
    let url = '';    // <a>태그에서 호출한 함수인 clip 생성
    var thisUrl = new URL(location.href).host;
    if(thisUrl.indexOf('dev') != -1) {
        url = "https://dev-reading.superv.com";
    }else if(thisUrl.indexOf('superv.com') != -1){
        url = "https://reading.superv.com";
    }else if(thisUrl.indexOf('reading.superv.com') != -1) {
        url = "https://reading.superv.com";
    }
    if (!common.isNull(myRecommCd)) {
        url = url + "/" + myRecommCd;
    } else {
        alert("무료체험을 신청하시면 추천링크를 받으실 수 있습니다.");
        return false;
    }
    if (!common.isNull(myRecommCd)) {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            buttonTitle: "무료체험 신청하기",
            content: {
                title: '슈퍼리딩 친구추천 이벤트',
                description: url,
                imageUrl:
                    'https://reading.superv.com/assets/img/etc/kakao_thumb.png',
                link: {
                    mobileWebUrl: url,
                    webUrl: url,
                },
            },
        });
    }
}

function thisEventLoginCheck() {
    var eventJwtToken = jwt.getAllToken();
    if (!common.isNull(eventJwtToken.getItem(ACCESS_TOKEN_NAME)) && !common.isNull(eventJwtToken.getItem(EXPIRED_TIME_NAME)) && !common.isNull(eventJwtToken.getItem(REFRESH_TOKEN_NAME))) {
        var userInfo = JSON.parse(eventJwtToken.getItem("vuex"));
        if (!common.isNull(userInfo)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}