/*팝업관련*/
/*등록팝업 띄우기*/
function fnGetRegistPop(){
    if(!fnLoginCheck()){
        if(confirm("로그인이 필요한 서비스 입니다.\n지금 로그인 하시겠습니까??")) {
            common.hrefFunction('/main/login');
            return;
        }
    }else{
        $('.pop-regist').addClass('show');
        document.querySelector('body').style.overflow = 'hidden';
    }
}
/*등록팝업닫기*/
function fnCloseRegistPop(){
    fnInitThisForm();
    $('.pop-regist').removeClass('show');
    document.querySelector('body').style.overflow = 'auto';
}
/*상세팝업열기*/
function fnGetReviewDetail(reviewId){
    const res = function(response) {
        if(response.code == "200"){
            if(!common.isNull(response.data)){
                let fileBodyHtml = '';
                if(!common.isNull(response.data.fileList)){
                    $.each(response.data.fileList, function (index, item) {
                        fileBodyHtml +=  '<div class="swiper-slide"><img src="'+thisCdnUrl+'/'+item+'"></div>';
                    })
                    $("#nmBody").html(response.data.parentNm+"("+response.data.mdnNo+")님");
                    $("#fileBody").html(fileBodyHtml);
                    $("#ctBody").html(response.data.reviewCt);

                }
                swiperControl.createSwiper($("#popReviewDetail").find('.swiper-content'));
                document.querySelector('body').style.overflow = 'hidden';
                $("#popReviewDetail").addClass("show");
            }
        }
    }
    let data = {
        "reviewEventId" : reviewId,
    };
    com_ajax.ajax('post', '/clientsvc/hpg/v1/svr/review/info',  JSON.stringify(data), res);
}
/*상세팝업닫기*/
function fnCloseReviewDetailPop(){
    $('#popReviewDetail').removeClass('show');
    $("#nmBody").html('');
    $("#fileBody").html('');
    swiperControl.destroySwiper($("#popReviewDetail").find('.swiper-content'));
    document.querySelector('body').style.overflow = 'auto';
}

/*전체리스트*/
let totalData; //총 데이터 수
let totalCount;
let dataPerPage = 6; //한 페이지에 나타낼 글 수

let pageCount = 10; //페이징에 나타낼 페이지 수
let globalCurrentPage = 1; //현재 페이지
let totalPage;
let selectedPage;
if (isMobile()) {
    dataPerPage = 4;
}
var promotionUrl = window.location.href
let thisCdnUrl = "";
if(promotionUrl.indexOf("dev") > -1  || promotionUrl.indexOf("localhost") > -1) {
    thisCdnUrl = "https://dev-cdnfiles.superv.com";
}else{
    thisCdnUrl = "https://cdnfiles.superv.com";
}
let myReviewHtml = "";
$(document).ready(function () {
    fnLoginCheck();
    var jwtTokcen = jwt.getAllToken();
    if(!common.isNull(jwtTokcen.getItem(ACCESS_TOKEN_NAME)) && !common.isNull(jwtTokcen.getItem(EXPIRED_TIME_NAME)) ) {
        if(!common.isNull(jwtTokcen.getItem("vuex"))){
            var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
            if(!common.isNull(userInfo) && !common.isNull(userInfo.parentId)){
                fnGetMyReview(userInfo.parentId);
            }
        }
    }
    /*후기 리스트 가져오기*/
    fnGetReviewEventList();

});
function fnGetReviewEventList(){
    displayReviewData(1);
}

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
    if($("#listBodyDiv").hasClass('sta-my-review')){
        $("#listBodyDiv").removeClass('sta-my-review');
    }
    if( !$("#allReview").hasClass("d-none") && myReviewHtml != "" && myReviewHtml.length >1){
        $("#allReview").addClass("d-none");
        $("#myReview").removeClass("d-none");
    }

    var currentPage2 = Number(currentPage) - 1;

    const res = function(response) {
        let listHtml = "";
        if(response.data.content.length == 0){
            $("#listBody").addClass("d-none");
            $(".no-result").removeClass("d-none");
            //$("#pagingul").hide();
            return;
        }
        for (var i=0; i<response.data.content.length;i++) {
            /*<!-- TODO : 썸네일(.btn-thumb-more), 더보기(.btn-more) 버튼 클릭 시 상세보기 팝업 노출 -->
            <!--
              (클래스) btn-pop : 팝업 노출 기능을 갖고 있는 버튼 클래스
              (버튼속성) popup-target : 노출 타겟 팝업 설정
            -->*/
            listHtml+= '<li class="list-item">\n' +
                '            <div class="item-inner">\n' +
                '              <button type="button" class="btn-pop btn-thumb-more" popup-target="pop-review-detail" onclick="fnGetReviewDetail(\''+response.data.content[i].reviewId+'\');">' +
                '                   <div class="item-thumb"><img src="'+thisCdnUrl+'/'+response.data.content[i].file+'"></div>' +
                '              </button>\n' +
                '              <div class="review-items">\n' +
                '                <div class="item-text line-clap-2">\n' +
                '                  '+response.data.content[i].reviewCt+'\n' +
                '                </div>\n' +
                '                <div class="item-writer"><span class="writer-name">'+response.data.content[i].parentNm+'</span>(<span class="writer-num">'+response.data.content[i].mdnNo+'</span>)님</div>\n' +
                '                <div class="btns-wrap">\n' +
                '                  <button type="button" class="btn-more btn-pop" popup-target="pop-review-detail" onclick="fnGetReviewDetail(\''+response.data.content[i].reviewId+'\');">더보기</button>\n';
                if(response.data.content[i].myReview == "200"){
                    listHtml +='<button type="button" class="btn-edit btn-pop" onclick="fnGetModifyPop(\''+response.data.content[i].reviewId+'\');">수정하기</button>\n';
                }
            listHtml +='         </div>\n' +
                '              </div>\n' +
                '            </div>\n' +
                '          </li>\n';
        }
        $("#listBody").html(listHtml);
        totalData = response.data.totalElements;
        //$("[name='totalCount']").html(totalData);
        paging(totalData, dataPerPage, pageCount, currentPage);
    }
    let data = {
        "page" : currentPage2,
        "pageSize": dataPerPage,
    };
    var jwtTokcen = jwt.getAllToken();
    if(!common.isNull(jwtTokcen.getItem(ACCESS_TOKEN_NAME)) && !common.isNull(jwtTokcen.getItem(EXPIRED_TIME_NAME)) ) {
        if(!common.isNull(jwtTokcen.getItem("vuex"))){
            var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
            if(!common.isNull(userInfo) && !common.isNull(userInfo.parentId)){
                data.parentId=userInfo.parentId;
            }
        }
    }
    com_ajax.ajax('post', '/clientsvc/hpg/v1/svr/review/list',  JSON.stringify(data), res);
}
/*나의 리뷰 내가쓴글  가져오기*/
function fnGetMyReview(thisParentId){
    myReviewHtml = "";
    //var currentPage2 = 0;
    /*myReview allReview*/
    const res = function(response) {
        if(response.data.submitCheck > 0){
            /*이미 있는겨우 참여완료로 변경.*/
            $("#completeBtn").show();
            $("#registBtn").remove();

        }
        if(response.data.content.length == 0){
            return;
        }
        $("#myReview").removeClass("d-none");
        $("#completeBtn").show();
        $("#registBtn").remove();
        for (var i=0; i<response.data.content.length;i++) {
            myReviewHtml+= '<li class="list-item">\n' +
                '            <div class="item-inner">\n' +
                '              <button type="button" class="btn-pop btn-thumb-more" popup-target="pop-review-detail" onclick="fnGetReviewDetail(\''+response.data.content[i].reviewId+'\');">' +
                '                   <div class="item-thumb"><img src="'+thisCdnUrl+'/'+response.data.content[i].file+'"></div>' +
                '              </button>\n' +
                '              <div class="review-items">\n' +
                '                <div class="item-text line-clap-2">\n' +
                '                  '+response.data.content[i].reviewCt+'\n' +
                '                </div>\n' +
                '                <div class="item-writer"><span class="writer-name">'+response.data.content[i].parentNm+'</span>(<span class="writer-num">'+response.data.content[i].mdnNo+'</span>)님</div>\n' +
                '                <div class="btns-wrap">\n' +
                '                  <button type="button" class="btn-more btn-pop" popup-target="pop-review-detail" onclick="fnGetReviewDetail(\''+response.data.content[i].reviewId+'\');">더보기</button>\n' +
                '                  <button type="button" class="btn-edit btn-pop" popup-target="pop-regist" onclick="fnGetModifyPop(\''+response.data.content[i].reviewId+'\');">수정하기</button>\n'+
                '                </div>\n' +
                '              </div>\n' +
                '            </div>\n' +
                '          </li>\n';
        }
    }
    let data = {
        "parentId" : thisParentId,
    };
    com_ajax.ajax('post', '/clientsvc/hpg/v1/svr/review/my/list',  JSON.stringify(data), res);

}
/*나의 후기 보여주기*/
function fnGetMyReviewList(){
    $("#allReview").removeClass("d-none");
    $("#myReview").addClass("d-none");
    $("#listBodyDiv").addClass('sta-my-review');
    if(common.isNull(myReviewHtml)){
        if(response.data.content.length == 0){
            $("#listBody").addClass("d-none");
            $(".no-result").removeClass("d-none");
            //$("#pagingul").hide();
            return;
        }
    }else{
        $("#listBody").html(myReviewHtml);
    }
}

let onSubmitCheck = 0;
let form = new FormData();

function fnSetFileNm(thisValue){
   
    if(!common.isNull($(thisValue)[0].files[0])){
        if($(thisValue)[0].files[0].name.length > 60){
            alert("파일명을 확인해주세요. 파일명이 60자 미만이어야 등록가능합니다.");
            $(thisValue).val('');
            return;
        }
        /*파일 확장자 체크*/
        var ext =  $(thisValue)[0].files[0].name.substring( $(thisValue)[0].files[0].name.lastIndexOf('.') + 1);
        if(!ext){
            alert("이미지 파일을 등록해 주세요.");
            $(thisValue).val('');
            return false;
        }
        let imgCheck = 0;
        var imgs = ['jpg', 'jpeg', 'png'];
        ext = ext.toLocaleLowerCase();
        imgs.forEach( function(element) {
            if(ext == element){
                imgCheck++;
            }
        });
        if(imgCheck == 0){
            alert("이미지 파일을 등록해 주세요.");
            $(thisValue).val('');
            return false;
        }
        /*파일사이즈 확인*/
        var maxSize = 4 * 1024 * 1024;
        var fileSize = $(thisValue)[0].files[0].size;

        if(fileSize > maxSize){
            alert("첨부파일 사이즈는 4MB 이내로 등록 가능합니다.");
            $(thisValue).val('');
            return false;
        }
        if(fileSize >( 1.5 * 1024 * 1024)){
            let resize = new window.resize();
            resize.init();
            resize.photo($(thisValue)[0].files[0], 500, 'file', function (resizedFile) {
                resizedFile.lastModifiedDate = new Date();
                resizedFile.name = $(thisValue)[0].files[0].name;
                const myFile = new File([resizedFile], $(thisValue)[0].files[0].name, {
                    type: $(thisValue)[0].files[0].type,
                });
                if(fileSize < myFile.size ){
                    form.append($(thisValue).attr("id"), $(thisValue)[0].files[0]);
                    $(thisValue).siblings("[name='fileNm']").val($(thisValue)[0].files[0].name);
                }else{
                    form.append($(thisValue).attr("id"), myFile);
                    $(thisValue).siblings("[name='fileNm']").val($(thisValue)[0].files[0].name);
                }
            });
        }else{
            form.append($(thisValue).attr("id"), $(thisValue)[0].files[0]);
            $(thisValue).siblings("[name='fileNm']").val($(thisValue)[0].files[0].name);
        }
     /*   let resize = new window.resize();
        resize.init();
        resize.photo($(thisValue)[0].files[0], 500, 'file', function (resizedFile) {
            resizedFile.lastModifiedDate = new Date();
            resizedFile.name = $(thisValue)[0].files[0].name;
            const myFile = new File([resizedFile], $(thisValue)[0].files[0].name, {
                type: resizedFile.type,
            });
            form.append($(thisValue).attr("id"), myFile);
            $(thisValue).siblings("[name='fileNm']").val($(thisValue)[0].files[0].name);
        });*/
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

function fnAllFormCheck(){
    let eventPId = null;
    var jwtTokcen = jwt.getAllToken();
    if(!common.isNull(jwtTokcen.getItem(ACCESS_TOKEN_NAME)) && !common.isNull(jwtTokcen.getItem(EXPIRED_TIME_NAME)) ) {
        if(!common.isNull(jwtTokcen.getItem("vuex"))){
            var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
            if(!common.isNull(userInfo) && !common.isNull(userInfo.parentId)){
                eventPId = userInfo.parentId;
            }
        }
    }
    if(common.isNull(eventPId)){
        if(confirm("로그인이 필요한 서비스 입니다.\n지금 로그인 하시겠습니까??")) {
            common.hrefFunction('/main/login');
        }
    }

    if($("#reviewCt").val().length <100){
        alert("체험 후기를 100자 이상 입력해주세요.");
        eventPId = null;
        return eventPId;
    }
    if(common.isNull($("#eventUid").val())){
/*        if(common.isNull(document.querySelector('#file1').files[0])
            &&common.isNull(document.querySelector('#file2').files[0])
            &&common.isNull(document.querySelector('#file3').files[0])){*/
        if(common.isNull(form.get("file1"))
            &&common.isNull(form.get("file2"))
            &&common.isNull(form.get("file3"))){
            alert("대표 이미지를 1개 이상 등록해주세요");
            eventPId = null;
            return eventPId;
        }
    }
    if(common.isNull($("#reviewUrl1").val()) && common.isNull($("#reviewUrl2").val()) && common.isNull($("#reviewUrl3").val())){
        alert("URL을 1개 이상 등록해주세요.");
        eventPId = null;
        return eventPId;
    }
    let personalAgree = $("#privacyAgreeYn").is(":checked");
    let personalAgree2 = $("#provideRcvYn").is(":checked");
    if(!personalAgree){
        alert("개인 정보 수집 및 이용 동의를 체크해 주세요.");
        eventPId = null;
        return eventPId;
    }
    if(!personalAgree2){
        alert("개인 정보 위탁 제공 동의를 체크해 주세요.");
        eventPId = null;
        return eventPId;
    }
    return eventPId;
}
function fnSubmitThis(){
    if(onSubmitCheck > 0){
        return;
    }
    let eventPId = null;
    eventPId = fnAllFormCheck();
    if(common.isNull(eventPId)){
        return;
    }else{
        let browserDiv = 'P';
        if (isMobile()) {
            browserDiv = 'M';
        } else {
            browserDiv = 'P';
        }
        let eventData =
            {
                "browserDiv" : browserDiv,
                "eventNm" : "슈퍼리딩후기이벤트",
                "parentId" :  eventPId,
                //"reviewNm" : "review1",
                "reviewCt" : common.decodeHTMLEntities($("#reviewCt").val()),
                "reviewUrl1" : $("#reviewUrl1").val(),
                "reviewUrl2" : $("#reviewUrl2").val(),
                "reviewUrl3" : $("#reviewUrl3").val(),
                "privacyAgreeYn" : $("#privacyAgreeYn:checked").val(),
                "provideRcvYn" : $("#provideRcvYn:checked").val(),
            };
        /*이미지 저장*/
        if(!common.isNull(document.querySelector('#file1').files[0])){

        }else{
            $("#file1").attr("disabled",true);
        }
        if(!common.isNull(document.querySelector('#file2').files[0])){
            //form.append("file2", Array.from(document.querySelector('#file2').files)[0]);
        }else{
            $("#file2").attr("disabled",true);
        }
        if(!common.isNull(document.querySelector('#file3').files[0])){
            //form.append("file3", Array.from(document.querySelector('#file3').files)[0]);
        }else{
            $("#file3").attr("disabled",true);
        }
        /*수정*/
        if(!common.isNull($("#eventUid").val())){
            if( confirm("이벤트 참여내용을 수정하시겠습니까?")){
                const res = function(response) {
                    onSubmitCheck = 0;
                    if(response.code == "200"){
                        if(!common.isNull(response.data.code)){
                            if(response.data.code == 200){
                                $("#myReview").addClass("d-none");
                                $("#allReview").addClass("d-none");
                                fnCloseRegistPop();
                                fnGetMyReview(eventPId);
                                displayReviewData(1);
                                alert("수정이 완료되었습니다.");
                                return;
                            }else{
                                fnCloseRegistPop();
                                alert("시스템 오류가 발생했습니다. 고객센터에 문의하시기 바랍니다.");
                                return;
                            }
                        }else{
                            fnCloseRegistPop();
                            alert("시스템 오류가 발생했습니다. 고객센터에 문의하시기 바랍니다.");
                            return;
                        }
                    }else{
                        fnCloseRegistPop();
                        alert("시스템 오류가 발생했습니다. 고객센터에 문의하시기 바랍니다.");
                        return;
                    }
                }
                eventData.reviewEventUid = $("#eventUid").val();
                const json = JSON.stringify(eventData);
                const blob = new Blob([json], { type: "application/json" });
                form.append("req", blob);
                onSubmitCheck++;
                com_ajax.ajaxFile('post', '/clientsvc/hpg/v1/svr/event/info', form, res);
            }
        }else{
            const res = function(response) {
                onSubmitCheck = 0;
                if(response.code == "200"){
                    if(!common.isNull(response.data.code)){
                        if(response.data.code == 200){
                            fnCloseRegistPop();
                            /*이미 있는겨우 참여완료로 변경.*/
                            $("#completeBtn").show();
                            $("#registBtn").remove();
                            alert("등록이 완료되었습니다.");
                            return;
                        }else{
                            fnCloseRegistPop();
                            alert("시스템 오류가 발생했습니다. 고객센터에 문의하시기 바랍니다.");
                            return;
                        }
                    }else{
                        fnCloseRegistPop();
                        alert("시스템 오류가 발생했습니다. 고객센터에 문의하시기 바랍니다.");
                        return;
                    }
                }else{
                    fnCloseRegistPop();
                    alert("시스템 오류가 발생했습니다. 고객센터에 문의하시기 바랍니다.");
                    return;
                }
            }

            const json = JSON.stringify(eventData);
            const blob = new Blob([json], { type: "application/json" });
            form.append("req", blob);
            onSubmitCheck++;
            com_ajax.ajaxFile('post', '/clientsvc/hpg/v1/svr/event/info', form, res);
        }


    }

}

function fnInitThisForm(){
    form = new FormData();
    $("#eventUid").val('');
    $("#reviewCt").val('');
    $("#file1").val('');
    $("#file2").val('');
    $("#file3").val('');
    $("[name='fileNm']").val('');
    $("#reviewUrl1").val('');
    $("#reviewUrl2").val('');
    $("#reviewUrl3").val('');
    $("#allAgree").prop('checked', false);
    $("#privacyAgreeYn").prop('checked', false);
    $("#provideRcvYn").prop('checked', false);
}

/*수정팝업열기*/
function fnGetModifyPop(thisValue){
    let thisPId = null;
    var jwtTokcen = jwt.getAllToken();
    if(!common.isNull(jwtTokcen.getItem(ACCESS_TOKEN_NAME)) && !common.isNull(jwtTokcen.getItem(EXPIRED_TIME_NAME)) ) {
        if(!common.isNull(jwtTokcen.getItem("vuex"))){
            var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
            if(!common.isNull(userInfo) && !common.isNull(userInfo.parentId)){
                thisPId = userInfo.parentId;
            }
        }
    }
    if(thisPId == null){
        if(confirm("로그인이 필요한 서비스 입니다.\n지금 로그인 하시겠습니까??")) {
            common.hrefFunction('/main/login');
            return;
        }
    }else{
        const res = function(response) {
            if(response.code == "200"){
                if(!common.isNull(response.data)){
                    $("#currentTextLength").html(response.data.reviewCt.length);
                    $("#reviewCt").val(response.data.reviewCt);
                    $("#eventUid").val(response.data.reviewEventId);
                    $("#file1Nm").val(response.data.reviewFileNm1);
                    $("#file2Nm").val(response.data.reviewFileNm2);
                    $("#file3Nm").val(response.data.reviewFileNm3);
                    $("#reviewUrl1").val(response.data.reviewUrl1);
                    $("#reviewUrl2").val(response.data.reviewUrl2);
                    $("#reviewUrl3").val(response.data.reviewUrl3);
                    $('.pop-regist').addClass('show');
                    document.querySelector('body').style.overflow = 'hidden';
                }
            }
        }
        let data = {
            "reviewEventId" : thisValue,
            "parentId" : thisPId
        };
        com_ajax.ajax('post', '/clientsvc/hpg/v1/svr/review/my/info',  JSON.stringify(data), res);
    }
}

window.resize = (function () {
    function Resize(){
    }
    Resize.prototype = {
        init: function(outputQuality) {
            this.outputQuality = (outputQuality === 'undefined' ? 1 : outputQuality);
        },
        photo: function(file, maxSize, outputType, callback) {
            var _this = this;
            var reader = new FileReader();
            reader.onload = function (readerEvent) {
                _this.resize(readerEvent.target.result, maxSize, outputType, callback);
            };
            reader.readAsDataURL(file);
        },
        resize: function(dataURL, maxSize, outputType, callback) {
            var _this = this;
            var image = new Image();
            image.onload = function () {
                // Resize image
                var canvas = document.createElement('canvas'),
                    width = image.width,
                    height = image.height;
                if (width > height) {//가로모드
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {//세로모드
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                var scaleFactor = 192/96;
                canvas.width = Math.ceil(canvas.width * scaleFactor);
                canvas.height = Math.ceil(canvas.height * scaleFactor);

                //canvas.getContext('2d');
                let ctx =  canvas.getContext('2d');
                ctx.scale(scaleFactor, scaleFactor);
                ctx.drawImage(image, 0, 0, width, height);
                _this.output(canvas, outputType, callback);
            };
            image.onerror=function(){
                return;
            };
            image.src = dataURL;
        },
        output: function(canvas, outputType, callback) {
            switch (outputType) {
                case 'file':
                    canvas.toBlob(function (blob) {
                        callback(blob);
                    }, 'image/png', 0.8);
                    break;
                case 'dataURL':
                    callback(canvas.toDataURL('image/png', 0.8));
                    break;
            }
        }
    };//prototype end
    return Resize;

}());

/*태그복사하기*/
function fnGetTagCody(){
    let textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.value = "#책육아 #독서육아 #슈퍼리딩 #슈퍼리딩후기";  // textarea 값에 url를 넣어줌
    textarea.select();  //textarea를 설정
    document.execCommand("copy");   // 복사
    document.body.removeChild(textarea); //extarea 요소를 없애줌
    alert("복사가 완료되었습니다.")  // 알림창
}