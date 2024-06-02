let dataPerPage = 10;
let pageCount = 10; //페이징에 나타낼 페이지 수
let totalData;
let selectedPage;
$(document).ready(function () {
    displayData(1);
});
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
    pageHtml += "<p><span class='current'>" + currentPage + "</span><i>/</i><span class='total'>" + totalPage + "</span></p>";
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
        var html = "";

        for (var i=0; i<response.data.content.length;i++) {
            var nm = response.data.content[i].requestNm;

            var no = response.data.content[i].requestPhoneNo;
            let titleCheck = response.data.content[i].requestTitle;
            html += '<li class="list-item">';
            html += '<div class="item-thumb ';
            if(titleCheck =="위즈"){
                html += 'char-wiz';
            }else if(titleCheck =="슈키"){
                html += 'char-sukey';
            }else if(titleCheck =="듀이"){
                html += 'char-dewy';
            }else if(titleCheck =="네오"){
                html += 'char-neo';
            }else{
                html += 'char-evie';
            }
            html += '">';
            html += '</div>';
            html += '<div class="item-text">';
            html +=  response.data.content[i].requestCt;
            html += '</div>';
            html += '<div class="item-writer">';
            html += '<span class="writer-name">';
            html += nm+'</span>(<span class="writer-num">'+no+'</span>)님';
            html += '</div>';
            html += '</li>'
        }

        $("#replaceHtml").html(html);
        totalData = response.data.totalElements;
        $("[name='totalCount']").html(totalData);
        paging(totalData, dataPerPage, pageCount, currentPage);
    }
    let data = {
        "page" : currentPage2,
        "pageSize": dataPerPage,
        "eventDiv" : "K",
        "eventNm" : "kyobo"
    };
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/teaser/list',  JSON.stringify(data), res);
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


function fnBeforeSubmitReplyEvent(){
    let requestTitle = $("[name='requestTitle']").is(':checked');
    if(!requestTitle){
        alert("캐릭터를 선택해 주세요.");
        return false;
    }
    let requestCt =  $("#requestCt").val();
    if(requestCt == null || requestCt == "" || requestCt.replaceAll(" ","") == ""){
        alert("기대평을 입력해 주세요.");
        return false;
    }
    let parentNm = $('#requestNm').val();
    if(parentNm == null || parentNm == ""){
        alert("이름을 입력해 주세요.");
        $('#parentNmCheck').show();
        return false;
    }
    let requestPhoneNo = $('#requestPhoneNo').val();
    if(requestPhoneNo == null || requestPhoneNo == ""){
        alert("휴대폰 번호를 입력해 주세요.");
        return false;
    }
    /*10글자 확인*/
    if(requestPhoneNo.length != 11){
        alert("휴대폰번호를 올바르게 입력해 주세요.");
        $("#requestPhoneNo").focus();
        return false;
    }

    let privacyAgreeYn = $("#privacyAgreeYn").is(':checked');
    let provideRcvYn = $("#provideRcvYn").is(':checked');
    if(!privacyAgreeYn){
        alert("개인 정보 수집 및 이용 동의에 동의해주세요.");
        return false;
    }
    if(!provideRcvYn){
        alert("개인 정보 위탁 제공에 동의해주세요.");
        return false;
    }
    const res = function(response) {
        if(response.data.result == "N"){
            alert("이미 이벤트에 참여하셨습니다.");
            return false;
        }else if(response.data.result="Y"){
            fnSubmitReplyEvent();
        }
    }
    let data = {
        "requestPhoneNo" : $("#requestPhoneNo").val(),
        "eventDiv" : "K",
        "eventNm" : "kyobo",
    };
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/teaser/joinPre',  JSON.stringify(data), res);
}

function fnSubmitReplyEvent(){

    const res = function(response) {
        if(response.data == 1){
            alert("등록이 완료되었습니다.");
            fnInitThisForm();
            fnCloseThisPop('popComment')
        }
    }

    let broswerDiv = null;
    if(isMobile()){
        broswerDiv = "M";
    }else{
        broswerDiv = "P";
    }
    let data = {
        "broswerDiv" : broswerDiv,
        "eventDiv" : "K",
        "eventNm" : "kyobo",
        "requestNm" : $("#requestNm").val(),
        "requestPhoneNo" : $("#requestPhoneNo").val(),
        "childAge" : 0,
        "requestTitle" : $("[name='requestTitle']:checked").val(),
        "requestCt" : common.decodeHTMLEntities($("#requestCt").val())
    };
    data = JSON.stringify(data);
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/teaser/join',  data, res);
}

function fnInitThisForm(){
    $("#requestCt").html("");
    $("#requestCt").val("");
    $("#requestNm").val("");
    $("#requestPhoneNo").val("");
    $("#currentTextLength").html("0");
    $("[name='requestTitle']").prop("checked", false);
    $("[name='requestTitle']").eq(0).prop("checked", true);
    $("[name='personal']").prop("checked", false);
    displayData(1);
}