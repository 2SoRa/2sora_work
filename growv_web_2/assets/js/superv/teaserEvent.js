let totalData; //총 데이터 수
let totalCount;
let dataPerPage = 7; //한 페이지에 나타낼 글 수
let pageCount = 10; //페이징에 나타낼 페이지 수
let globalCurrentPage = 1; //현재 페이지
let totalPage;
let selectedPage;

let submitCheck = 0;
// 리스트 불러오고 페이지 세팅한다.
$(document).ready(function () {
    fnSetEventList();
});

function fnSetEventList(){
    displayData(1);
}
// 페이징 그리기
function paging(totalData, dataPerPage, pageCount, currentPage) {
    totalPage = Math.ceil(totalData / dataPerPage); //총 페이지 수

    if (totalPage < pageCount) {
        pageCount = totalPage;
    }

    let pageGroup = Math.ceil(currentPage / pageCount); // 페이지 그룹
    let last = pageGroup * pageCount; //화면에 보여질 마지막 페이지 번호

    if (last > totalPage) {
        last = totalPage;
    }

    let first = last - (pageCount - 1); //화면에 보여질 첫번째 페이지 번호
    let next = last + 1;
    let prev = first - 1;

    let pageHtml = "";

    pageHtml += "<button><a href='javascript:void(0);' id='prev' class='arrow prev' style='display:flex;'></a></button>";
    pageHtml += "<p><span>" + currentPage + "</span>" + " / " + totalPage + "</p>";
    pageHtml += "<button><a href='javascript:void(0);' id='next' class='arrow next' style='display:flex;'></a></button>";

    $("#pagingul").html(pageHtml);
    let displayCount = "";
    displayCount = "현재 1 - " + totalPage + " 페이지 / " + totalData + "건";
    $("#displayCount").text(displayCount);


    //페이징 번호 클릭 이벤트
    $("#pagingul .arrow").click(function () {
        let $id = $(this).attr("id");
        selectedPage = currentPage;

        if ($id == "next") selectedPage = selectedPage + 1;
        if ($id == "prev") selectedPage = selectedPage - 1;

        //전역변수에 선택한 페이지 번호를 담는다...
        globalCurrentPage = selectedPage;

        if (selectedPage < 1 || selectedPage > totalPage) {
            return;
        }

        //글 목록 표시 재호출
        displayData(selectedPage);
        //페이징 표시 재호출
        paging(totalData, dataPerPage, pageCount, selectedPage);
    });
}

// 페이지별 리스트 호출
function displayData(currentPage) {
    var currentPage2 = Number(currentPage) - 1;

    const res = function(response) {
        let listHtml = "";
        for (var i=0; i<response.data.content.length;i++) {
            var nm = response.data.content[i].requestNm;
            var ct = response.data.content[i].requestCt;
            var no = response.data.content[i].requestPhoneNo;
            listHtml += "<li>" +
                "<div class='cha " +response.data.content[i].etc1+ "' ></div>"+
                "<div class='list-data' >"+
                "<p>"+ct+"</p>" +
                "<p class='user'>"+ nm + "(" + no +")님</p>" +
                "</div>" +
                "</li>";
        }
        $("#listBody").html(listHtml);
        totalData = response.data.totalElements;
        $("[name='totalCount']").html(totalData);
        paging(totalData, dataPerPage, pageCount, currentPage);
    }
    let data = {
        "page" : currentPage2,
        "pageSize": dataPerPage,
        "eventDiv" : "T",
        "eventNm" : "슈퍼리딩2차"
    };
    com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/teaser/list',  JSON.stringify(data), res);
}

// 이름체크
// PC
function typedName() {
    const regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;
    const numPattern = /[0-9]/g;

    if (regExp.test($('.requestNm').val())) {
        alert('한글 또는 영문만 입력해 주세요.');
        $('.requestNm').val($('.requestNm').val().replace(regExp, ''));
    }

    if (numPattern.test($('.requestNm').val())) {
        alert('한글 또는 영문만 입력해 주세요.');
        $('.requestNm').val($('.requestNm').val().replace(numPattern, ''));
    }

    if ($('.requestNm').val().length > 6) {
        alert('이름은 최대 6글자로 입력해 주세요.')
        $('.requestNm').val($('.requestNm').val().slice(0, -1));
    }
}
// 번호체크
// PC
function typedPhoneNum() {
    const numPattern = /^[0-9]+$/;

    if (!numPattern.test($('.requestPhoneNo').val())) {
        alert('숫자만 입력해 주세요.');
        $('.requestPhoneNo').val($('.requestPhoneNo').val().replace(/[^0-9]/g, ''));
    }
}
// 동의하기 각각 클릭
function clickEachAgree(device) {
    if (device == 'P') {
        const inputAllAgree = document.querySelector('.allAgree');
        const inputAgree = document.querySelectorAll('.p-agree');

        inputAgree.forEach((el) => {
            if (checkAgreePCCount() == 1) {
                inputAllAgree.checked = false;
            } else {
                if (checkAgreePCCount() == 2) {
                    inputAllAgree.checked = true;
                } else if (checkAgreePCCount() == 0) {
                    inputAllAgree.checked = false;
                }
            }
        });
    } else if (device == 'M') {
        const inputAllAgree = document.querySelector('.m-allAgree');
        const inputAgree = document.querySelectorAll('.m-agree');

        inputAgree.forEach((el) => {
            if (checkAgreeMoCount() == 1) {
                inputAllAgree.checked = false;
            } else {
                if (checkAgreeMoCount() == 2) {
                    inputAllAgree.checked = true;
                } else if (checkAgreeMoCount() == 0) {
                    inputAllAgree.checked = false;
                }
            }
        });
    }
}
// 모두 동의하기 체크
function clickAllAgree(device) {
    let inputAllAgree = '';
    let inputAgree = '';

    if (device == 'P') {
        inputAllAgree = document.querySelector('.allAgree');
        inputAgree = document.querySelectorAll('.p-agree');
    } else if (device == 'M') {
        inputAllAgree = document.querySelector('.m-allAgree');
        inputAgree = document.querySelectorAll('.m-agree');
    }

    if (inputAllAgree.checked) {
        inputAgree.forEach((el) => {
            el.checked = true;
        });
    } else {
        inputAgree.forEach((el) => {
            el.checked = false;
        });
    }
}

// 필수동의 카운트
// PC
function checkAgreePCCount() {
    const inputAgree = document.querySelectorAll('.p-agree');
    let count = 0;
    inputAgree.forEach((el) => {
        if (el.checked == true) {
            count++;
        }
    });
    return count;
}

// Mobile
function checkAgreeMoCount() {
    const inputAgree = document.querySelectorAll('.m-agree');
    let count = 0;
    inputAgree.forEach((el) => {
        if (el.checked == true) {
            count++;
        }
    });
    return count;
}
// 공유하기
function sharePage() {
    let url = '';    // <a>태그에서 호출한 함수인 clip 생성
    let textarea = document.createElement("textarea");
    //url 변수 생성 후, textarea라는 변수에 textarea의 요소를 생성

    document.body.appendChild(textarea); //</body> 바로 위에 textarea를 추가(임시 공간이라 위치는 상관 없음)
    url = window.document.location.href;  //url에는 현재 주소값을 넣어줌
    //textarea.value = url;  // textarea 값에 url를 넣어줌
    textarea.value = "https://reading.superv.com";  // textarea 값에 url를 넣어줌
    textarea.select();  //textarea를 설정
    document.execCommand("copy");   // 복사
    document.body.removeChild(textarea); //extarea 요소를 없애줌

    alert("URL이 복사가 완료되었습니다.")  // 알림창
}

// 모바일 기기 체크
function isMobile() {
    var UserAgent = navigator.userAgent;

    if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
        return true;
    } else {
        return false;
    }
}

// 중복체크
function fnCmdWritePre() {

    let requestNm = $(".requestNm").val();
    let phoneNum = $('.requestPhoneNo').val();
    let checkedAge = $('input[name=childAge]:checked').attr('value');
    let personalAgree = $("#personalAgree").is(":checked");
    let personalAgree2 = $("#personalAgree2").is(":checked");
    let requestCt = $("#formRequestCt").val();
    let etc1 = $("input[name='characterChoice']:checked").val();

    if(requestCt == null || requestCt == "" || requestCt ==" "){
        alert("내용을 입력해주세요.");
        $("#formRequestCt").focus();
        return;
    }
    if (requestNm == null || requestNm == "") {
        alert('이름을 입력해 주세요.');
        return;
    }
    if (phoneNum == null || phoneNum == "") {
        alert('핸드폰 번호를 입력해 주세요.');
        return;
    }
    if (phoneNum.length < 10 || phoneNum.length > 11) {
        alert('휴대폰 번호의 길이를 확인해 주세요.');
        return;
    }
    if (checkedAge == null || checkedAge == "") {
        alert('자녀 나이를 선택해 주세요.');
        return;
    }
    if(common.isNull(etc1)){
        alert("캐릭터를 선택해주세요.");
        return ;
    }
    if(!personalAgree){
        alert("개인 정보 수집 및 이용 동의를\n체크해 주세요.");
        return false;
    }
    if(!personalAgree2){
        alert("개인 정보 위탁 제공 동의를\n체크해 주세요.");
        return false;
    }
    const res = function(response) {
        if (response.data.result == "Y") {
            fnCmdWrite();
        } else {
            $(".requestNm").val("");
            $('.requestPhoneNo').val("");
            $('input[name=childAge]:checked').prop('checked',false);
            $("#personalAgree").prop('checked',false);
            $("#personalAgree2").prop('checked',false);
            $("#allAgree").prop('checked',false);
            $("#formRequestCt").val('');
            $("input[name='characterChoice']").prop("checked",false);
            alert('이미 이벤트 등록이 완료된 정보입니다.');
            closePopup();
        }
    }
    let data = {
        "eventDiv" : "T",
        "eventNm" : "슈퍼리딩2차",
        "requestPhoneNo" : phoneNum
    };
    com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/teaser/joinPre',  JSON.stringify(data), res);

}

// 글등록
function fnCmdWrite() {
    let requestNm = $(".requestNm").val();
    let phoneNum = $('.requestPhoneNo').val();
    let checkedAge = $('input[name=childAge]:checked').attr('value');
    let deviceMode = '';
    let requestCt = $("#formRequestCt").val();
    let urlParams = new URL(location.href).searchParams;
    let recommendCd = urlParams.get('recommendCd');
    let etc1 = $("input[name='characterChoice']:checked").val();
    if (isMobile()) {
        deviceMode = 'M';
    } else {
        deviceMode = 'P';
    }
    if(recommendCd == null || recommendCd == '' || recommendCd == undefined){
        recommendCd = "";
    }
    submitCheck++;
    if(submitCheck == 1){
        const res = function(response) {

            $(".requestNm").val("");
            $('.requestPhoneNo').val("");
            $('input[name=childAge]:checked').prop('checked',false);
            $("#personalAgree").prop('checked',false);
            $("#personalAgree2").prop('checked',false);
            $("#allAgree").prop('checked',false);
            $("#formRequestCt").val('');
            $("input[name='characterChoice']").prop("checked",false);
            fnSetEventList();
            alert('이벤트 등록이 완료되었습니다.');
            closePopup();
            submitCheck = 0;
        }

        let data = {
            "broswerDiv" : deviceMode,
            "eventDiv" : "T",
            "eventNm" : "슈퍼리딩2차",
            "requestNm" : requestNm,
            "requestPhoneNo" : phoneNum,
            "requestTitle" : recommendCd,
            "requestCt" : common.decodeHTMLEntities(requestCt),
            "childAge" : checkedAge,
            "openYn" : "Y",
            "etc1" : etc1,
        };
        com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/teaser/join',  JSON.stringify(data), res);
    }

}
/*2023.09.05 슈퍼리딩 티져 댓글내용 확인*/
function fnCheckRequestCt(){
    let requestCt = $("#formRequestCt").val();
    if(requestCt == null || requestCt == "" || requestCt ==" "){
        return false;
    }else{
        return true;
    }
}