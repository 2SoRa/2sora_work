let eventPId = null;

/*전체리스트*/
let totalData; //총 데이터 수
let dataPerPage = 5; //한 페이지에 나타낼 글 수

let pageCount = 10; //페이징에 나타낼 페이지 수
let globalCurrentPage = 1; //현재 페이지
let totalPage;
let selectedPage;

$(document).ready(function () {
    var jwtTokcen = jwt.getAllToken();
    if (!common.isNull(jwtTokcen.getItem(ACCESS_TOKEN_NAME)) && !common.isNull(jwtTokcen.getItem(EXPIRED_TIME_NAME))) {
        if (!common.isNull(jwtTokcen.getItem("vuex"))) {
            var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
            if (!common.isNull(userInfo) && !common.isNull(userInfo.parentId)) {
                eventPId = userInfo.parentId;
                /*이벤트 참여여부 확인.*/
                const res = function (response) {
                    if (response.code == "200") {
                        if (!common.isNull(response.data.privacyCnt) && response.data.privacyCnt > 0) {
                            $("[name='agreePart']").hide();
                            $("#agreeAll").prop("checked","checked");
                            $("#privacyAgreeYn").prop("checked","checked");
                            $("#provideRcvYn").prop("checked","checked");
                        } else {
                        }
                    } else {
                        return;
                    }
                }
                let eventData =
                    {
                        "parentId": eventPId,
                        "eventNm": "supervP",

                    };
                com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/review/sns/count', JSON.stringify(eventData), res);
            }
        }
    }
    /*리스트 가져오기*/
    displayReviewData(1);
});

/*// 페이징 그리기*/
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
    pageHtml += "<p><span class='current'>" + currentPage + "</span><i> / </i> " + totalPage + "</p>";
    pageHtml += "<button><a href='javascript:void(0);' id='next' class='arrow next' style='display:flex;'></a></button>";
    $("#pagingul").html(pageHtml);
    let displayCount = "";
    displayCount = "현재 1 - " + totalPage + " 페이지 / " + totalData + "건";
    $("#displayCount").text(totalData);


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
        displayReviewData(selectedPage);
        //페이징 표시 재호출
        paging(totalData, dataPerPage, pageCount, selectedPage);
    });
}

// 페이지별 리스트 호출
function displayReviewData(currentPage) {
    var currentPage2 = Number(currentPage) - 1;

    const res = function (response) {
        let listHtml = "";

        let returnData = response.data.content;
        if (returnData.length > 0) {
            $.each(returnData, function (index, item) {
                listHtml += '<li>';
                listHtml += '<div class="reply-info">';
                listHtml += '<p>'+item.parentNm+'</p>';
                listHtml += '<p>('+item.mdnNo+')</p>';
                listHtml += '<p class="date">'+item.regDtm+'</p>';
                listHtml += '</div>';
                listHtml += '<a href="javascript:void(0);" onclick="fnOpenNewPop(\''+item.reviewUrl+'\')"; class="reply-url">'+item.reviewUrl+'</a>';
                listHtml += '</li>';
            })
        }
        $("#listBody").html(listHtml);
        totalData = response.data.totalElements;
        $("[name='totalCount']").html(totalData);
        paging(totalData, dataPerPage, pageCount, currentPage);
    }
    let data = {
        "page": currentPage2,
        "pageSize": dataPerPage,
        "eventNm": "supervP"
    };
    com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/review/sns/list', JSON.stringify(data), res);
}
function  fnOpenNewPop(thisUrl){
    if(thisUrl.indexOf("://") == -1){
        window.open("//"+thisUrl,  '_blank', 'width=900,height=1000');
    }else{
        window.open(thisUrl, '_blank', 'width=900,height=1000');
    }
}

/*이벤트 참여용 로그인 체크*/
function fnEventLoginCheck(){
    let thisEventPid = null;
    var jwtTokcen = jwt.getAllToken();
    if (!common.isNull(jwtTokcen.getItem(ACCESS_TOKEN_NAME)) && !common.isNull(jwtTokcen.getItem(EXPIRED_TIME_NAME))) {
        if (!common.isNull(jwtTokcen.getItem("vuex"))) {
            var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
            if (!common.isNull(userInfo) && !common.isNull(userInfo.parentId)) {
                thisEventPid = userInfo.parentId;
                eventPId = userInfo.parentId;
            }
        }
    }
    return thisEventPid;
}
let onSubmitCheck = 0;

let checkCount = 0;
// 모두 동의하기 체크
function clickAllAgree() {
    if(common.isNull(fnEventLoginCheck())){
        if (confirm("로그인이 필요한 서비스 입니다.\n지금 로그인 하시겠습니까??")) {
            common.hrefFunction('/member/login.html');
        }
        $("#privacyAgreeYn").prop("checked",false);
        $("#provideRcvYn").prop("checked",false);
        $("#agreeAll").prop("checked",false);
        return false;
    }
    if (checkCount == 0) {
        checkCount = 2;
        $("#agreeAll").prop("checked","checked");
        $("#privacyAgreeYn").prop("checked","checked");
        $("#provideRcvYn").prop("checked","checked");
        if(!$(".agree-list").hasClass('active')){
            $(".agree-list").addClass('active');
        }
    } else {
        checkCount = 0;
        $("#privacyAgreeYn").prop("checked",false);
        $("#provideRcvYn").prop("checked",false);
    }
}
/*개별동의하기*/
function clickAgree() {
    if(common.isNull(fnEventLoginCheck())){
        if (confirm("로그인이 필요한 서비스 입니다.\n지금 로그인 하시겠습니까??")) {
            common.hrefFunction('/member/login.html');
        }
        return false;
    }
    let thisCheckCount = 0;
    let personalAgree = $("#privacyAgreeYn").is(":checked");
    let personalAgree2 = $("#provideRcvYn").is(":checked");
    if(personalAgree){
        thisCheckCount++;
    }
    if(personalAgree2){
        thisCheckCount++;
    }
    if(thisCheckCount == 2){
        $("#agreeAll").prop("checked","checked");
        $("#privacyAgreeYn").prop("checked","checked");
        $("#provideRcvYn").prop("checked","checked");
        if(!$(".agree-list").hasClass('active')){
            $(".agree-list").addClass('active');
        }
    }else{
        $("#agreeAll").prop("checked",false);
    }
}
function clickInputUrl(){
    if(common.isNull(fnEventLoginCheck())){
        if (confirm("로그인이 필요한 서비스 입니다.\n지금 로그인 하시겠습니까??")) {
            common.hrefFunction('/member/login.html');
        }
        return false;
    }
}
function fnSubmitThis() {
    if(common.isNull(fnEventLoginCheck())){
        if (confirm("로그인이 필요한 서비스 입니다.\n지금 로그인 하시겠습니까??")) {
            common.hrefFunction('/member/login.html');
        }
        return false;
    }
    if(common.isNull(eventPId)){
        if (confirm("로그인이 필요한 서비스 입니다.\n지금 로그인 하시겠습니까??")) {
            common.hrefFunction('/member/login.html');
        }
        return false;
    }
    if (common.isNull($("#reviewUrl1").val())) {
        alert("URL을 등록해주세요.");
        return false;
    }else if ($("#reviewUrl1").val().toLowerCase().indexOf("instagram.com") == -1) {
        alert("정확한 URL을 등록해주세요.");
        return false;
    }

    let personalAgree = $("#privacyAgreeYn").is(":checked");
    let personalAgree2 = $("#provideRcvYn").is(":checked");
    if (!personalAgree) {
        alert("개인 정보 수집 및 이용에 동의해주세요.");
        return false;
    }
    if (!personalAgree2) {
        alert("개인 정보 처리 위탁에 동의해주세요.");
        return false;
    }
    if (onSubmitCheck > 0) {
        return;
    }
    let browserDiv = 'P';
    if (isMobile()) {
        browserDiv = 'M';
    }
    const res = function (response) {
        onSubmitCheck = 0;
        if (response.code == "200") {
            if (!common.isNull(response.data.code)) {
                if (response.data.code == 200) {
                    fnInitThisForm();
                    alert("참여가 완료되었습니다.\n" +
                        "관리자 검토 후 등록됩니다.");
                    window.location.reload();
                    return;
                } else {
                    fnInitThisForm();
                    alert("시스템 오류가 발생했습니다. 고객센터에 문의하시기 바랍니다.");
                    return;
                }
            } else {
                fnInitThisForm();
                alert("시스템 오류가 발생했습니다. 고객센터에 문의하시기 바랍니다.");
                return;
            }
        } else {
            fnInitThisForm();
            alert("시스템 오류가 발생했습니다. 고객센터에 문의하시기 바랍니다.");
            return;
        }
    }
    let eventData =
        {
            "browserDiv": browserDiv,
            "eventNm": "supervP",
            "parentId": eventPId,
            "reviewUrl1": $("#reviewUrl1").val(),
            "privacyAgreeYn": $("#privacyAgreeYn:checked").val(),
            "provideRcvYn": $("#provideRcvYn:checked").val(),
        };
    onSubmitCheck++;
    com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/event/sns/info', JSON.stringify(eventData), res);
}

function fnInitThisForm() {
    $("#reviewCt").val('');
    $("#reviewUrl1").val('');
    $("#allAgree").prop('checked', false);
    $("#privacyAgreeYn").prop('checked', false);
    $("#provideRcvYn").prop('checked', false);
    $("#privacyAgreeYn").prop("checked",false);
    $("#provideRcvYn").prop("checked",false);
    $("#agreeAll").prop("checked",false);
}

/*태그복사하기*/
function fnGetTagCody() {
    let textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.value = "#슈퍼브이 #슈퍼브이후기 #슈퍼브이인생한컷";
    textarea.select();  //textarea를 설정
    document.execCommand("copy");   // 복사
    document.body.removeChild(textarea); //extarea 요소를 없애줌
    alert("복사가 완료되었습니다.")  // 알림창
}