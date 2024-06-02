const today = new Date();
var parentId = null;
// 84개월전
var studentStartDate = new Date(today.getFullYear()-6, today.getMonth(), today.getDate());
// 34개월전
var studentEndDate = new Date(today.getFullYear(), today.getMonth() - 34, today.getDate());

let minYear = studentStartDate.getFullYear();
let maxYear = studentEndDate.getFullYear();
let minMonth = 1;
let maxMonth = 12;
let minDay = 1;
let maxDay = 31;
var sendMsgCheck = false;
var timerInterval = null;
let dataPerPage = 20;
let pageCount = 10; //페이징에 나타낼 페이지 수
let totalData;
let totalData2;
var stuId = null;
var certCheck = false;

let stuCnt = 0;
/*자녀세명 선택 관련*/
var allStuDisabled = false;

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'UA-241422429-1');
$(document).ready(function (){

    const res = function(response) {
        var html = "";

        for (var i=0; i<response.data.content.length;i++) {
            var nm = response.data.content[i].requestNm;
           /* var nm1 = nm.substr(0,1);
            var nm2 = nm.substr(-1);
            var star = '*';
            if (nm.length >= 3) {
                star = '*'.repeat(nm.length-2);
            }*/

            var no = response.data.content[i].requestPhoneNo;
            /*var no1 = no.substr(7,1);
            var no2 = no.substr(-1);
*/
            html += '<li>';
            html += '<span class="chathum_item">';
            html += '<div class="chathum_img">';
            html += '<span class="thum">';

            html += '<img src="./images/svicon_';
            let titleCheck = response.data.content[i].requestTitle;
            if(titleCheck =="위즈"){
                html += '05';
            }else if(titleCheck =="슈키"){
                html += '01';
            }else if(titleCheck =="듀이"){
                html += '03';
            }else if(titleCheck =="네오"){
                html += '04';
            }else{
                html += '02';
            }

            html += '.png" alt=""></span></div>';
            html += '<div class="chathum_main">';
            html += '<div class="clamp_data">';
            html +=  response.data.content[i].requestCt;
            html += '</div>';
            html += '</div>';
            html += '<div class="chathum_else">';
            html += '<span class="chat_men">';
            /*if (nm.length == 1) {
                html += nm+'('+no1+'**'+no2+')님';
            } else if (nm.length == 2) {
                html += nm1+star+'('+no1+'**'+no2+')님';
            } else if (nm.length >= 3) {
                html += nm1+star+nm2+'('+no1+'**'+no2+')님';
            }*/
            html += nm+'('+no+')님';
            html += '</span>';
            html += '</div>';
            html += '</span>';
            html += '</li>';

        }

        $("#replaceHtml").html(html);

        totalData = response.data.totalElements;
        totalData2 = response.data.numberOfElements;
        $("[name='totalCount']").html(totalData);
        paging(totalData, dataPerPage, pageCount, 1);
    }
    let data = {
        "page" : 0,
        "pageSize": dataPerPage,
        "eventDiv" : "H",
        /*"eventNm" : "기대평"*/
    };
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/teaser/list',  JSON.stringify(data), res);
})

// 페이징 그리기
function paging(totalData, dataPerPage, pageCount, currentPage) {
    totalPage = Math.ceil(totalData / dataPerPage); //총 페이지 수

    if(totalPage<pageCount){
        pageCount=totalPage;
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

    pageHtml += "<button><a href='#none' id='prev' class='arrow prev' style='display:flex;'></a></button>";
    pageHtml += "<p><span>" + currentPage + "</span>" + " / " + totalPage + "</p>";
    pageHtml += "<button><a href='#none' id='next' class='arrow next' style='display:flex;'></a></button>";
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
        var html = "";

        for (var i=0; i<response.data.content.length;i++) {
            var nm = response.data.content[i].requestNm;
            var nm1 = nm.substr(0,1);
            var nm2 = nm.substr(-1);
            var star = '';
            if (nm.length >= 3) {
                star = '*'.repeat(nm.length-2);
            }

            var no = response.data.content[i].requestPhoneNo;
            var no1 = no.substr(7,1);
            var no2 = no.substr(-1);
            html += '<li>';
            html += '<span class="chathum_item">';
            html += '<div class="chathum_img">';
            html += '<span class="thum">';

            html += '<img src="./images/svicon_';
            let titleCheck = response.data.content[i].requestTitle;
            if(titleCheck =="위즈"){
                html += '05';
            }else if(titleCheck =="슈키"){
                html += '01';
            }else if(titleCheck =="듀이"){
                html += '03';
            }else if(titleCheck =="네오"){
                html += '04';
            }else{
                html += '02';
            }
            html += '.png" alt=""></span></div>';
            html += '<div class="chathum_main">';
            html += '<div class="clamp_data">';
            html +=  response.data.content[i].requestCt;
            html += '</div>';
            html += '</div>';
            html += '<div class="chathum_else">';
            html += '<span class="chat_men">';
            // if (nm.length == 1) {
            //     html += nm+'('+no1+'**'+no2+')님';
            // } else if (nm.length == 2) {
            //     html += nm1+star+'('+no1+'**'+no2+')님';
            // } else if (nm.length >= 3) {
            //     html += nm1+star+nm2+'('+no1+'**'+no2+')님';
            // }
            html += nm+'('+no+')님';
            html += '</span>';
            html += '</div>';
            html += '</span>';
            html += '</li>';

        }

        $("#replaceHtml").html(html);
        totalData = response.data.totalElements;
        totalData2 = response.data.numberOfElements;
        $("[name='totalCount']").html(totalData);
        paging(totalData, dataPerPage, pageCount, currentPage);
    }
    let data = {
        "page" : currentPage2,
        "pageSize": dataPerPage,
        "eventDiv" : "H",
        /*"eventNm" : "기대평"*/
    };
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/teaser/list',  JSON.stringify(data), res);
}
/*휴대전화번호 확인.*/
$(document).on('keydown keyup click', '#requestPhoneNo, [name="inviteRecommMdnNo"]', function (){
    /*숫자 입력가능*/
    var curVal = $(this).val().replaceAll("-", "");
    /*10글자 확인*/
    var totalCnt = curVal.length;
    if(totalCnt > 11){
        while(totalCnt > 11){
            curVal = curVal.substring(0, curVal.length-1);
            totalCnt = getByte(curVal);
        }
    }
    $(this).val(curVal);

})
/*학부모 이름 20byte, 영문, 한글 확인.*/
$(document).on('keyup click keydown', '#requestNm', function (){
    var curVal = $(this).val();
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
    $(this).val(curVal);
});

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
        "eventDiv" : "H",
        "eventNm" : "기대평11차",
    };
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/teaser/joinPre',  JSON.stringify(data), res);
}

function fnSubmitReplyEvent(){

    const res = function(response) {
        if(response.data == 1){
            alert("등록이 완료되었습니다.");
            $("#requestCt").html("");
            $("#requestCt").val("");
            $("#requestNm").val("");
            $("#requestPhoneNo").val("");
            $("[name='requestTitle']").prop("checked", false);
            $("[name='requestTitle']").eq(1).prop("checked", true);
            $('#total_check').prop("checked", false);
            $("[name='agreeCheckBox']").prop("checked", false);
            displayData(1);
            if($(".btn_layerclose")!= undefined){
                $(".btn_layerclose").trigger('click');
            }
            $("#sample_popup").removeClass("active");
            document.querySelector('body').style.overflow = 'auto';
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
        "eventDiv" : "H",
        "eventNm" : "기대평11차",
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



/*2022.11.25 기존 script*/


$(function() {
    /*무료체험 신청하기 팝업 open*/
    $(".main-signup, .btn-req, .event .bottom_long_banner").on(
        "click",
        function(e) {
            e.preventDefault();
            /* 2023.06.26 회원의 무료체험 신청을 위한 추가.
            var jwtTokcen = jwt.getAllToken();
            if(!common.isNull(jwtTokcen.getItem("accessToken")) && !common.isNull(jwtTokcen.getItem("expiredTime")) && !common.isNull(jwtTokcen.getItem("refreshToken"))){
                alert("회원이 아닐경우에만 신청가능합니다.");
                return false;

            }
            */
            dimLayerShow({
                target: "#app_popup",
                openCallback: function() {
                    fnSetCalendar(minYear, maxYear, minMonth, maxMonth, minDay, maxDay);
                    const urlParams = new URL(location.href).searchParams;
                    $('body').css('overflow','hidden');
                    let name = urlParams.get('recommendCd');
                    if(!common.isNull(name)){
                        if(name.indexOf('supervp') != -1){
                            $("[name='recommendDiv']").show();
                            $("[name='inviteRecommMdnNoPart']").hide();
                        }else{
                            $("[name='recommendDiv']").hide();
                            $("[name='inviteRecommMdnNoPart']").show();
                        }
                    }else if(!common.isNull(sessionStorage.getItem("recommendCd"))){
                        name = sessionStorage.getItem("recommendCd");
                        if(name.indexOf('supervp') != -1){
                            $("[name='recommendDiv']").show();
                            $("[name='inviteRecommMdnNoPart']").hide();
                        }else{
                            $("[name='recommendDiv']").hide();
                            $("[name='inviteRecommMdnNoPart']").show();
                        }
                    }else{
                        $("[name='recommendDiv']").hide();
                    }
                    $(".pop_contents").removeClass("member");
                    var jwtTokcen = jwt.getAllToken();
                    if(!common.isNull(jwtTokcen.getItem("accessToken")) && !common.isNull(jwtTokcen.getItem("expiredTime")) && !common.isNull(jwtTokcen.getItem("refreshToken"))){
                        /*2023.06.12 로그인 회원의 무료체험 신청.*/
                        fnGetMemInfoForexpRequest();
                        sessionStorage.removeItem("popTrigger");
                        return false;
                    }
                    $(".choice_product_item .checkbox_item").on(
                        "click",
                        function() {
                            $(".choice_product_item").removeClass("active");
                            if ($(this).prop("checked")) {
                                $(this)
                                    .parents(".choice_product_item")
                                    .addClass("active");
                            }
                        }
                    );
                },
            });
        }
    );
    /*답글 팝업 오픈*/
    $(".btn_reply,.btn_reply_mb").on("click", function(e) {
        e.preventDefault();
        dimLayerShow({
            target: "#sample_popup",
            openCallback: function() {
                $("#total_check").on("click", function() {
                    $(".agree_tail_form_zone .stand_element").prop(
                        "checked",
                        $(this).prop("checked")
                    );
                });
                // $(".choice_product_item .checkbox_item").on(
                //   "click",
                //   function () {
                //     $(".choice_product_item").removeClass("active");
                //     if ($(this).prop("checked")) {
                //       $(this)
                //         .parents(".choice_product_item")
                //         .addClass("active");
                //     }
                //   }
                // );
            document.querySelector('body').style.overflow = 'hidden';
            },
        });
    });
    $(".btn_mobile_popup_back, .btn_mobile_popup_close").on("click", function(e) {
        e.preventDefault();
        //$("#app_popup").removeClass("active");
        dimLayerHide({
            target: "#app_popup",
            openCallback: function() {

            },
        });
    });
});
$(function(){
    $("body").on("click", ".event-mpic ul li a", function(){
        //var gdtop = $(".gd-menu-wrap").offset().top - 80;
        var page01top = $("#page01").offset().top-80;
        var page02top = $("#page02").offset().top-80;
        var page03top = $("#page03").offset().top-80;
        var gdId = $(this).attr("data-page");
        if(gdId=="page01"){
            $("html, body").stop().animate({scrollTop: page01top+"px"},500);
        }
        if(gdId=="page02"){
            $("html, body").stop().animate({scrollTop: page02top+"px"},500);
        }
        if(gdId=="page03"){
            $("html, body").stop().animate({scrollTop: page03top+"px"},500);
        }
    });
    $("body").on("click", ".event-mo-pic ul li a", function(){
        //var gdtop = $(".gd-menu-wrap").offset().top - 80;
        var page01top = $("#mo-page01").offset().top-80;
        var page02top = $("#mo-page02").offset().top-30;
        var page03top = $("#mo-page03").offset().top+180;
        var gdId = $(this).attr("data-page");
        if(gdId=="mo-page01"){
            $("html, body").stop().animate({scrollTop: page01top+"px"},500);
        }
        if(gdId=="mo-page02"){
            $("html, body").stop().animate({scrollTop: page02top+"px"},500);
        }
        if(gdId=="mo-page03"){
            $("html, body").stop().animate({scrollTop: page03top+"px"},500);
        }
    });
})

function fnDuplicateCheckParentByMdnNo(){
    $('[name="checkMdnNo"]').hide();
    var mdnNo = $('#mdnNo').val();
    if(mdnNo == null || mdnNo == ""){
        $('[name="checkMdnNo"]').find(".warn_para").html("휴대폰 번호를 입력해주세요.");
        $('[name="checkMdnNo"]').show();
        return false;
    }
    $('[name="checkMdnNo"]').hide();
    const res = function(response) {
        if(response.message == "OK"){
            if(response.data.result == "N"){
                alert(response.data.message);
                $("#mdnNo").focus();
                fnInitPhoneForm();
                return false;
            }else{
                fnGetCert(mdnNo);
            }
        }else{
            fnInitPhoneForm();
            alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            return false;
        }
    }
    let data = [];
    /*23.07.20*/
    com_ajax.ajax('get', '/clientsvc/hpg/v1/svh/parent/mdn/dup?mdnNo='+mdnNo,data, res);
}

function fnGetCert(mdnNo){
    if(mdnNo == null || mdnNo == ""){
        $('[name="checkMdnNo"]').find(".warn_para").html("휴대폰 번호를 입력해주세요.");
        $('[name="checkMdnNo"]').show();
        return false;
    }
    $('[name="checkMdnNo"]').hide();

    const res = function(response) {
        if(response.code == "200"){
            certCheck = false;
            fnGetTime(180);
        }else{
            alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            fnInitPhoneForm();
            return false;
        }
    }
    let data = {"mdnNo" : mdnNo};
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/account/v1/web/sms/cert/send', JSON.stringify(data), res);
}

function fnGetTime(restTime){
    $("[name='getMdnBtn']").addClass('disabled');
    $('[name="checkMdnNo"]').hide();
    $('[name="phoneResetBtn"]').attr('disabled', false);
    $('[name="certMsg"]').show();
    $('#mdnNo').addClass('disabled');
    $('.form_inline_box.phone').removeClass('disabled');
    $('.form_inline_control_group').show();
    $('[name="getCertBtn"]').attr('disabled', true);
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
    sendMsgCheck = false;
    clearInterval(timerInterval);
    $('[name="phoneResetBtn"]').attr('disabled', true);
    $('[name="getCertBtn"]').attr('disabled', false);
    $('[name="getMdnBtn"]').removeClass('disabled');
    $('#mdnNo').removeClass('disabled');
    $('[name="certMsg"]').hide();
    $('[name="certBtn"]').addClass('disabled');
    $('.form_inline_box.phone').addClass('disabled');
    $('#certNo').val('');
    $('[name="restTime"]').html("03:00");
}


/*인증번호 확인*/
$(document).on('click', '[name="certBtn"]', function(){
    var mdnNo= $("#mdnNo").val();
    var certNo = $("#certNo").val();
    if(mdnNo == null || mdnNo == ""){
        $('[name="checkMdnNo"]').find(".warn_para").html("휴대폰 번호를 입력해주세요.");
        $('[name="checkMdnNo"]').show();
        return false;
    }
    if(certNo == null || certNo == ""){
        $('[name="checkMdnNo"]').find(".warn_para").html("인증번호를 입력해주세요.");
        $('[name="checkMdnNo"]').show();
        $("#certNo").focus();
        return false;
    }

    $('[name="checkMdnNo"]').hide();

    const res = function(response) {
        if(response.code == "200"){
            if(response.message == "OK"){
                /*2023.06.12 휴대폰 인증 후 중복확인으로 변경.*/
                $('[name="checkMdnNo"]').hide();
                clearInterval(timerInterval);
                $('[name="phoneResetBtn"]').attr('disabled', true);
                $('[name="getCertBtn"]').attr('disabled', true);
                $('#mdnNo').addClass('disabled');
                // $('#certNo').attr('disabled', true);
                $('[name="certMsg"]').html("인증되었습니다.");
                $('[name="certBtn"]').addClass('disabled');
                $('.form_inline_box.phone').addClass('disabled');
                certCheck = true;
                /*fnCheckParentStateByMdnNo();*/
            }else{
                $('[name="checkMdnNo"]').find(".warn_para").html("인증번호가 일치하지 않습니다. 다시 인증해주세요.");
                certCheck = false;
                $('[name="checkMdnNo"]').show();
                return false;
            }
        }else{
            alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            return false;
        }
    }
    let data = {"mdnNo" : mdnNo, "certNo" : certNo};
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/account/v1/web/sms/cert/check',  JSON.stringify(data), res);

});


function checkMndNo(){
    /*숫자 입력가능*/
    var curVal = $("#mdnNo").val();

    /*10글자 확인*/
    if(curVal.length > 11){
        $('[name="checkMdnNo"]').find(".warn_para").html("휴대폰 번호를 올바르게 입력해 주세요.");
        $('[name="checkMdnNo"]').show();
        return false;
    }
    $('[name="checkMdnNo"]').hide();
}
/*휴대전화번호 확인.*/
$(document).on('keyup click keydown', '#mdnNo', function (){
    var curVal = $(this).val().replaceAll("-", "");

    $('#mdnNo').val(curVal);
    $('[name="certBtn"]').addClass('disabled');

    var totalCnt = curVal.length;
    if(totalCnt > 11){
        while(totalCnt > 11){
            curVal = curVal.substring(0, curVal.length-1);
            totalCnt = getByte(curVal);
        }
    }
    $(this).val(curVal);

    if(totalCnt == 11){
        $('[name="getMdnBtn"]').removeClass('disabled');
    }else{
        $('[name="getMdnBtn"]').addClass('disabled');
    }

})

/*학부모 이름 20byte, 영문, 한글 확인.*/
$(document).on('keyup click keydown', '#parentName', function (){
    var curVal = $(this).val();
    var pattern = /[\u3131-\u314e|\u314f-\u3163|\uac00-\ud7a3]/g;
    var koreanLangCnt = !!curVal.match(pattern) ? curVal.match(pattern).length : 0;
    var etcLangCnt = curVal.length - koreanLangCnt;
    var koreanLangByte = koreanLangCnt * 2;
    var etcLangByte = etcLangCnt;
    var totalCnt = koreanLangByte + etcLangByte;
    var regex =  /^[ㄱ-ㅎㅏ-ㅣ가-힣|ᆞ|ᆢ|ㆍ|ᆢ|ᄀᆞ|ᄂᆞ|ᄃᆞ|ᄅᆞ|ᄆᆞ|ᄇᆞ|ᄉᆞ|ᄋᆞ|ᄌᆞ|ᄎᆞ|ᄏᆞ|ᄐᆞ|ᄑᆞ|ᄒᆞㅣ\u318Dㅣ\u119Eㅣ\u11A2ㅣ\u2022ㅣ\u2025ㅣ\u00B7ㅣ\uFE55|a-z|A-Z]+$/;
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
    $(this).val(curVal);
});
/*
2023.06.23 공통으로변경
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

*/

/*자녀 이름 20byte, 영문, 한글 확인.*/
$(document).on('keyup click keydown', '#stuName', function (){
    var curVal = $(this).val();
    var pattern = /[\u3131-\u314e|\u314f-\u3163|\uac00-\ud7a3]/g;
    var koreanLangCnt = !!curVal.match(pattern) ? curVal.match(pattern).length : 0;
    var etcLangCnt = curVal.length - koreanLangCnt;
    var koreanLangByte = koreanLangCnt * 2;
    var etcLangByte = etcLangCnt;
    var totalCnt = koreanLangByte + etcLangByte;
    var regex =  /^[ㄱ-ㅎㅏ-ㅣ가-힣|ᆞ|ᆢ|ㆍ|ᆢ|ᄀᆞ|ᄂᆞ|ᄃᆞ|ᄅᆞ|ᄆᆞ|ᄇᆞ|ᄉᆞ|ᄋᆞ|ᄌᆞ|ᄎᆞ|ᄏᆞ|ᄐᆞ|ᄑᆞ|ᄒᆞㅣ\u318Dㅣ\u119Eㅣ\u11A2ㅣ\u2022ㅣ\u2025ㅣ\u00B7ㅣ\uFE55|a-z|A-Z]+$/;
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
    $(this).val(curVal);
});

/*인증번호 한글 확인.*/
$(document).on('keyup click keydown', '#certNo', function (){
    var curVal = $(this).val();
    var regex = /^[0-9]+$/;
    /*한글/영문만 입력가능*/
    if(!regex.test(curVal)){
        $('[name="checkMdnNo"]').find(".warn_para").html("인증번호를 올바르게 입력해 주세요.");
        $("#certNo").val(curVal.slice(0, curVal.length-1));
    }

    curVal = $("#certNo").val();
    if(curVal.length == 4){
        $('[name="certBtn"]').removeClass('disabled');
    }else if(curVal.length > 4){
        $("#certNo").val(curVal.slice(0, curVal.length-1));
        $('[name="checkMdnNo"]').find(".warn_para").html("인증번호를 올바르게 입력해 주세요.");
        $('[name="checkMdnNo"]').show();
        return false;
        $('[name="certBtn"]').addClass('disabled');
    }else{
        $('[name="certBtn"]').addClass('disabled');
    }
    $('[name="checkMdnNo"]').hide();
});

function fnGetDaumZipCode(){
    new daum.Postcode({
        oncomplete: (data) => {
            var fullAddr = '';
            var extraAddr = '';
            $("#zipcode").val(data.zonecode);
            if(data.userSelectedType === 'R') {
                fullAddr = data.roadAddress;
                if(data.bname !== '') {
                    extraAddr  += data.bname;
                }
                if(data.buildingName !== '') {
                    extraAddr += (extraAddr !=='' ?', '+data.buildingName:data.buildingName);
                }

                fullAddr += (extraAddr !=='' ? '('+extraAddr+')':'');
            }else{
                fullAddr = data.jibunAddress;
            }
            $("#address1").val(fullAddr);
            $("#address2").val('');
            $("#address2").focus();
        }
    }).open();
}


function fnSubmitTrialForm(){
    if(!$('#app_popup').hasClass("block")) {
        /*2023.05.24 더블클릭 허용 관련 위치 변경*/
        $('#app_popup').addClass("block");
        let checkCtn = 0;
        /*유효성 검증*/
        let parentName = $("#parentName").val();
        if (parentName == null || parentName == "") {
            $('[name="checkParentName"]').find(".warn_para").html("학부모 이름을 입력해 주세요.");
            $('[name="checkParentName"]').show();
            checkCtn++;
        } else {
            $('[name="checkParentName"]').hide();
        }

        let mdnCheckCnt = 0;
        let mdnNo = $("#mdnNo").val();
        if (mdnNo == null || mdnNo == "") {
            $('[name="checkMdnNo"]').find(".warn_para").html("휴대폰 번호를 입력해주세요.");
            $('[name="checkMdnNo"]').show();
            checkCtn++;
            mdnCheckCnt++;
        }
        checkMndNo();

        let certNo = $("#certNo").val();
        if (certNo == null || certNo == "" || !certCheck) {
            $('[name="checkMdnNo"]').find(".warn_para").html("인증번호를 입력해 주세요.");
            $('[name="checkMdnNo"]').show();
            checkCtn++;
            mdnCheckCnt++;
        }
        if (mdnCheckCnt == 0) {
            $('[name="checkMdnNo"]').hide();
        }

        let stuCheckCnt = 0;
        let stuName = $("#stuName").val();
        if (stuName == null || stuName == "") {
            $('[name="checkStuName"]').find(".warn_para").html("자녀 이름을 입력해 주세요.");
            $('[name="checkStuName"]').show();
            checkCtn++;
            stuCheckCnt++;
        }

        let yearSel = $('[name="yearSel"]').val();
        if (yearSel == null || yearSel == "" || yearSel == "0") {
            $('[name="checkStuName"]').find(".warn_para").html("자녀정보를 입력해 주세요.");
            $('[name="checkStuName"]').show();
            checkCtn++;
            stuCheckCnt++;
        }

        let monthSel = $('[name="monthSel"]').val();
        if (monthSel == null || monthSel == "" || monthSel == "0") {
            $('[name="checkStuName"]').find(".warn_para").html("자녀정보를 입력해 주세요.");
            $('[name="checkStuName"]').show();
            checkCtn++;
            stuCheckCnt++;
        }

        let daySel = $('[name="daySel"]').val();
        if (daySel == null || daySel == "" || daySel == "0") {
            $('[name="checkStuName"]').find(".warn_para").html("자녀정보를 입력해 주세요.");
            $('[name="checkStuName"]').show();
            checkCtn++;
            stuCheckCnt++;
        }

        if (stuCheckCnt == 0) {
            $('[name="checkStuName"]').hide();
        }

        if (parseInt(monthSel) < 10) {
            monthSel = "0" + monthSel;
        }
        if (parseInt(daySel) < 10) {
            daySel = "0" + daySel;
        }

        let brotherYn = $("[name='brotherYn']:checked").val();
        if (brotherYn == null || brotherYn == "") {
            $('[name="checkBrotherYn"]').find(".warn_para").html("형제 유무를 선택해 주세요.");
            $('[name="checkBrotherYn"]').show();
            checkCtn++;
        } else {
            $('[name="checkBrotherYn"]').hide();
        }

        let deviceCaseDiv = $("[name='deviceCaseDiv']:checked").val();
        if (deviceCaseDiv == null || deviceCaseDiv == "") {
            $('[name="checkDeviceCaseDiv"]').show();
            checkCtn++;
        } else {
            $('[name="checkDeviceCaseDiv"]').hide();
        }

        let addrCheckCnt = 0;
        let address2 = $("#address2").val();
        if (address2 == null || address2 == "") {
            $('[name="checkAddress"]').find(".warn_para").html("상세 주소를 입력해 주세요.");
            $('[name="checkAddress"]').show();
            checkCtn++;
            addrCheckCnt++;
        }

        let zipcode = $("#zipcode").val();
        let address1 = $("#address1").val();
        if (zipcode == null || zipcode == "" || address1 == null || address1 == "") {
            $('[name="checkAddress"]').find(".warn_para").html("배송 주소를 입력해 주세요.");
            $('[name="checkAddress"]').show();
            checkCtn++;
            addrCheckCnt++;
        }

        if (addrCheckCnt == 0) {
            $('[name="checkAddress"]').hide();
        }

        let isServiceUseAgreed = $("[name='isServiceUseAgreed']:checked").val();
        if (isServiceUseAgreed == null || isServiceUseAgreed == "") {
            $('[name="checkIsServiceUseAgreed"]').show();
            checkCtn++;
        } else {
            $('[name="checkIsServiceUseAgreed"]').hide();
        }
        let inviteRecommMdnNo = $("[name='inviteRecommMdnNo']").val();
        if(inviteRecommMdnNo == mdnNo){
            alert("추천인 휴대폰 번호를 확인해 주세요.")
            checkCtn++;
        }
        if (checkCtn > 0) {
            /*2023.05.24 더블클릭 허용 관련 위치 변경*/
            $('#app_popup').removeClass("block");
            return false;

        }
        /*2023.05.24 더블클릭 허용 관련 위치 변경
        $('.btn_formsubmit').addClass("block");*/
        /*2022.11.13 heemok*/
        gtag('event', 'click', {
            'event_category':'신청하기버튼클릭',
            'event_label':'사전예약이벤트step1'
        });
        <!-- Taboola Pixel Code -->
        _tfa.push({notify: 'event', name: 'complete_registration', id: 1507255});
        <!-- End of Taboola Pixel Code -->
        const res = function (response) {
            /*2023.07.06 마케팅 당근관련 태그 추가.*/
            try {
                <!-- Danggeun Market Code -->
                    window.karrotPixel.track('SubmitApplication');
                <!-- End Danggeun Market Code -->
                $("#marketingIframe").attr("src",  "/include/marketingBodyFrame.html");

                <!--2023.12.11 카울리 키워드광고 매체 전환값-->
                var param = {
                    track_code : "bd1dbbf0-7f6d-4f36-b1d9-f9c3f2b0a475",
                    event_name : "CA_CONVERSION",
                    event_param : $("#mdnNo").val()
                };
                cauly_send(param);
            }catch (e){
                console.log(e);
            }
            if (response.data.code == "200") {
                var parentId = response.data.info.data.parentLoginId;
                $("#tempParentLoginId").html(parentId);
                var parentIdPw = parentId.substring(parentId.length - 4, parentId.length);
                $("#tempParentLogPw").html(parentIdPw);
                var myRecommCd = response.data.myRecommCd;
                $("#myRecommCd").html(myRecommCd);
                /*학생*/
                stuId = response.data.info.data.stuId;
                sessionStorage.setItem("stuId", stuId);
                /*나이*/
                $("[name='calAgeInput']").attr("disabled", false);
                let thisStuAge = $("[name='calAgeInput']").val();
                if(thisStuAge.indexOf("세") > -1){
                    thisStuAge = thisStuAge.substring(0,thisStuAge.indexOf("세"))
                }
                $("[name='korCourseId']").prop("checked", false);
                $("[name='mathCourseId']").prop("checked", false);
                if(!common.isNull(stuId)){
                    if(!common.isNull(thisStuAge)){
                        thisStuAge = parseInt(thisStuAge);
                        $("[name='engCourseId']").eq(0).attr("checked", "checked");
                        $("[name='engCourseId']").eq(0).prop("checked", true);
                        if(thisStuAge <= 5){
                            $("[name='korCourseId']").eq(0).attr("checked", "checked");
                            $("[name='mathCourseId']").eq(0).attr("checked", "checked");
                            $("[name='korCourseId']").eq(0).prop("checked", true);
                            $("[name='mathCourseId']").eq(0).prop("checked", true);
                        }else if(thisStuAge == 6 ){
                            $("[name='korCourseId']").eq(1).attr("checked", "checked");
                            $("[name='mathCourseId']").eq(1).attr("checked", "checked");
                            $("[name='korCourseId']").eq(1).prop("checked", true);
                            $("[name='mathCourseId']").eq(1).prop("checked", true);
                        }else if(thisStuAge == 7){
                            $("[name='korCourseId']").eq(2).attr("checked", "checked");
                            $("[name='mathCourseId']").eq(2).attr("checked", "checked");
                            $("[name='korCourseId']").eq(2).prop("checked", true);
                            $("[name='mathCourseId']").eq(2).prop("checked", true);
                        }else if(thisStuAge >= 8){
                            $("[name='korCourseId']").eq(3).attr("checked", "checked");
                            $("[name='mathCourseId']").eq(3).attr("checked", "checked");
                            $("[name='korCourseId']").eq(3).prop("checked", true);
                            $("[name='mathCourseId']").eq(3).prop("checked", true);
                            $("[name='korCourseId']").eq(3).parents('li').removeClass("disabled");
                            $("[name='mathCourseId']").eq(3).parents('li').removeClass("disabled");
                            if(isMobile()){
                                $("[name='korCourseId']").eq(3).parents('li').show();
                                $("[name='mathCourseId']").eq(3).parents('li').show();
                            }
                        }
                        if(thisStuAge < 8){
                            $("[name='korCourseId']").eq(3).parents('li').addClass("disabled");
                            $("[name='mathCourseId']").eq(3).parents('li').addClass("disabled");
                            if(isMobile()){
                                $("[name='korCourseId']").eq(3).parents('li').hide();
                                $("[name='mathCourseId']").eq(3).parents('li').hide();
                            }
                        }
                    }else{
                        $('.select_step').remove();
                    }
                }else{
                    $('.select_step').remove();
                }

                $("#app_popup").removeClass("active");
                document.querySelector('body').style.overflow = 'hidden';
                $("#pop-complete").addClass("active");
                /*2023.05.24 더블클릭 허용 관련 위치 변경*/
                $('#app_popup').removeClass("block");
                $('.btn_formsubmit').removeClass("block");
                $("#pop-complete").show();

            } else {
                alert(response.data.message);
                $('.btn_formsubmit').removeClass("block");
                $('#app_popup').removeClass("block");
                return false;
            }
            $('#app_popup').removeClass("block");
            $('.btn_formsubmit').removeClass("block");
        }

        var joinUrlCd = 1;
        var inviteRecommCd = null;
        const urlParams = new URL(location.href).searchParams;
        const name = urlParams.get('recommendCd');
        if(!common.isNull(name)){
            inviteRecommCd = name;
            if(name.indexOf('supervp') != -1){
                joinUrlCd = 6;
            }else{
                joinUrlCd = 7;
            }
        }else if(!common.isNull(sessionStorage.getItem("recommendCd"))){
            inviteRecommCd = sessionStorage.getItem("recommendCd");
            if(sessionStorage.getItem("recommendCd").indexOf('supervp') != -1){
                joinUrlCd = 6;
            }else{
                joinUrlCd = 7;
            }
        }
        let data = {
            "name": parentName,
            "mdnNo": mdnNo,
            "zipcode": zipcode,
            "address1": address1,
            "address2": common.decodeHTMLEntities(address2),
            "stuName": stuName,
            "birthdate": yearSel + '-' + monthSel + '-' + daySel,
            "deviceCaseDiv": deviceCaseDiv,
            "joinUrlCd": joinUrlCd,
            "brotherYn": brotherYn,
            "isServiceUseAgreed": isServiceUseAgreed,
            "inviteRecommCd" : inviteRecommCd,
            "inviteRecommMdnNo" : inviteRecommMdnNo,
            "certNo" :  $("#certNo").val()
        };
        let salesRecommCd = urlParams.get('salesRecommCd');
        if(!common.isNull(sessionStorage.getItem("salesRecommCd"))) {
            salesRecommCd = sessionStorage.getItem("salesRecommCd");
        }
        if(!common.isNull(salesRecommCd)){
            try{
                data.salesManagerId = parseInt(salesRecommCd);
            }catch (err){
                console.log(err);
            }
        }
        let consultTime = "";
        $("[name='consultTime']").each(function(i){
            if($(this).is(":checked") == true) {
                let thisVal = $(this).val();
                if(thisVal == "consultMorning"){
                    data.consultMorningYn = "Y";
                    consultTime = "10,11,12"
                }
                if(thisVal == "consultAfter"){
                    data.consultAfterYn = "Y";
                    if(!common.isNull(consultTime)){
                        consultTime +=",13,14,15,16,17"
                    }else{
                        consultTime ="13,14,15,16,17";
                    }
                }
                if(thisVal == "consultEven"){
                    data.consultEvenYn = "Y";
                    if(!common.isNull(consultTime)){
                        consultTime +=",18,19,20"
                    }else{
                        consultTime ="18,19,20";
                    }
                }
            }
        });
        if(!common.isNull(consultTime)){
            data.consultTime = consultTime
        }
        /*2023.05.15 체험신청 후, 문자메세지 내용 전달*/
        let msgBody = "[광고] 슈퍼브이 추천하면 100% 선물!\n" +
            "\n" +
            "안녕하세요 #myName님\n" +
            "\n" +
            "슈퍼브이를 친구에게 소개하고\n" +
            "100% 상품권 받으세요.\n" +
            "무료체험만 추천해도 1만원 증정!\n" +
            "구매하면 추가 5만원 증정!\n" +
            "\n" +
            "[참여방법]\n" +
            "아래의 회원님만의 추천링크를 \n" +
            "친구에게 전달해 주세요.\n" +
            "\n" +
            "◆회원님만의 추천링크◆\n" +
            " #myRecommCd\n" +
            "\n" +
            "★[무료체험 추천시] 1만원X추천수만큼 \n" +
            "회원님의 추천링크를 통해\n" +
            "친구가 무료체험하면 \n" +
            "친구도 나도 '신세계상품권 1만원'\n" +
            "(월 최대 10만원 한정)\n" +
            "\n" +
            "★[추천받고 구매시] 5만원X추천수만큼\n" +
            "추천받은 친구가 구매하면\n" +
            "친구도 나도 '신세계상품권 5만원'\n" +
            "(월 최대 50만원 한정)\n" +
            "\n" +
            "기간 : ~24.01.31까지\n" +
            "\n" +
            "무료수신거부 0805331777";
        data.msgBody = msgBody;
        /*23.07.20*/
        com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/exp/member/alluser', JSON.stringify(data), res);
    }
}


function fnSetCalendar(thisMinYear, thisMaxYear, thisMinMonth, thisMaxMonth, thisMinDay, thisMaxDay){
    let yearSel = $('[name="yearSel"]').val();
    let monthSel = $('[name="monthSel"]').val();
    let daySel = $('[name="daySel"]').val();


    let fullHtml = "";
    let yearHtml = '<select name="yearSel" class="form_select wid_full" required>';
    yearHtml += '<option value="">년</option>';
    for(let y = thisMinYear; y<=thisMaxYear; y++){
        yearHtml += '<option value="'+y+'"';
        if(yearSel == y){
            yearHtml += 'selected';
        }
        yearHtml +='>'+y+'년</option>';
    }
    yearHtml += '</select>';

    let monthHtml = '<select name="monthSel" class="form_select wid_30" required>';
    if(yearSel == null || yearSel == undefined || yearSel == ""){
        //monthHtml += 'disabled'
    }
    monthHtml += '"> '
    monthHtml += '<option value="">월</option>';
    for(let m = thisMinMonth; m<=thisMaxMonth; m++){
        monthHtml += '<option value="'+m+'"';
        if(monthSel == m){
            monthHtml += 'selected';
        }
        monthHtml += '>'+m+'월</option>';
    }
    monthHtml += '</select>';

    let dayHtml = '<select name="daySel" class="form_select wid_30" required>';
    dayHtml += '<option value="">일</option>';
    for(let d = thisMinDay; d<=thisMaxDay; d++){
        dayHtml += '<option value="'+d+'"';
        if(daySel == d){
            dayHtml += 'selected';
        }
        dayHtml += '>'+d+'일</option>';
    }
    dayHtml += '</select>';
    fullHtml = yearHtml+monthHtml+dayHtml;
    $('[name="calHtmlPart"]').html(fullHtml);
}

$(document).on('change', '[name="yearSel"], [name="monthSel"], [name="daySel"]', function (){
    let yearSel = $('[name="yearSel"]').val();
    var thisMaxDay = maxDay;
    var thisMonSelVal = $('[name="monthSel"]').val();
    if(thisMonSelVal != "0" && !common.isNull(thisMonSelVal) && parseInt(thisMonSelVal) >0){
        var montharray=new Array(31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
        thisMaxDay = montharray[parseInt(thisMonSelVal)-1];
        //윤달 구하기
        if (thisMonSelVal=="2"){
            if ((parseInt(yearSel)/4)!=parseInt(parseInt(yearSel)/4))
            {
                thisMaxDay=28;
            }
            else
            {
                thisMaxDay=29;
            }
        }
    }
    if(yearSel == minYear){
        var thisMinMM = studentStartDate.getMonth();
        fnSetCalendar(minYear, maxYear, 1, 12, minDay, thisMaxDay);
    }else if(yearSel == maxYear){
        var thisMaxMM = studentEndDate.getMonth();
        if(String(thisMaxMM+1) == $('[name="monthSel"]').val()){
            thisMaxDay = studentEndDate.getDate();
            fnSetCalendar(minYear, maxYear, 1, thisMaxMM+1, minDay, thisMaxDay);
        }else{
            fnSetCalendar(minYear, maxYear, 1, thisMaxMM+1, minDay, thisMaxDay);
        }
    }else {
        fnSetCalendar(minYear, maxYear, minMonth, maxMonth, minDay, thisMaxDay);
    }
    let monthSel = $('[name="monthSel"]').val();
    let daySel = $('[name="daySel"]').val();
    if(yearSel != null && yearSel != ""  && yearSel != "0" && monthSel != null && monthSel != "" && monthSel != "0" && daySel != null && daySel != "" && daySel != "0"){
        fncalcAge(yearSel+'-'+monthSel+'-'+daySel);
    }else{
        $("[name='calAgeInput']").val('');
    }
});

function fncalcAge(birthDate) {
    let age = '';

    const birthYear = String(birthDate).substring(0,4);
    const todayYear = new Date().getFullYear();

    age = todayYear - birthYear + 1;
    age += "세";
    $("[name='calAgeInput']").val(age);
}


function closeCompletePop(){

    gtag('event', 'click', {
        'event_category':'신청완료',
        'event_label':'사전예약이벤트step2'
    });
    var _nasa={};
    if(window.wcs) _nasa["cnv"] = wcs.cnv("1","10"); // 전환유형, 전환가치 설정해야함. 설치매뉴얼 참고
    wcs_do(_nasa);
    fbq('track', 'CompleteRegistration');

    $("#compelte_popup").removeClass('active');
    fnInitSumiForm();
}


function fnInitSumiForm(){
    fnInitPhoneForm();
    $("#parentName").val('');
    $("[name='checkParentName']").hide();
    $("#mdnNo").val('');
    $('[name="getMdnBtn"]').addClass('disabled');
    $("#certNo").val('');
    $('.form_inline_box.phone').addClass('disabled');
    $('[name="certBtn"]').addClass('disabled');
    $('.form_inline_control_group').hide();
    $('[name="restTime"]').html('3:00');
    $("[name='checkMdnNo']").hide();
    $("#stuName").val('');
    fnSetCalendar(minYear, maxYear, minMonth, maxMonth, minDay, maxDay);
    $("[name='calAgeInput']").val('');
    $("[name='checkStuName']").hide('');
    $("[name='brotherYn']").prop("checked", false);
    $("[name='checkBrotherYn']").hide('');
    $("[name='deviceCaseDiv']").prop("checked", false);
    $("[name='checkDeviceCaseDiv']").hide('');
    $("#zipcode").val('');
    $("#address1").val('');
    $("#address2").val('');
    $("[name='checkAddress']").hide('');
    $("[name='isServiceUseAgreed']").prop("checked", false);
    $("[name='checkIsServiceUseAgreed']").hide('');
    $(".d_red").hide('');
    $("#tempParentLoginId").html('');
    $("#tempParentLogPw").html('');
}

// 공유하기
function sharePage() {
    var jwtTokcen = jwt.getAllToken();
    if(!common.isNull(jwtTokcen.getItem(ACCESS_TOKEN_NAME)) && !common.isNull(jwtTokcen.getItem(EXPIRED_TIME_NAME)) && !common.isNull(jwtTokcen.getItem(REFRESH_TOKEN_NAME))) {
        $("[name='loginPart']").show();
        $("[name='loginOutPart']").hide();
        var myRecommCd = null;
        if(!common.isNull(jwtTokcen.getItem("vuex"))){
            var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
            if(!common.isNull(userInfo.myRecommCd)){
                myRecommCd = "?recommendCd="+userInfo.myRecommCd;
            }
        }


        let url = '';    // <a>태그에서 호출한 함수인 clip 생성
        let textarea = document.createElement("textarea");
        //url 변수 생성 후, textarea라는 변수에 textarea의 요소를 생성

        document.body.appendChild(textarea); //</body> 바로 위에 textarea를 추가(임시 공간이라 위치는 상관 없음)
        url = "https://www.superv.com";  //url에는 현재 주소값을 넣어줌
        if(myRecommCd != null){
            url= url+"/event.html"+myRecommCd;
            textarea.value = url;  // textarea 값에 url를 넣어줌
            textarea.select();  //textarea를 설정
            document.execCommand("copy");   // 복사
            document.body.removeChild(textarea); //extarea 요소를 없애줌
            alert("URL이 복사되었습니다.")  // 알림창
        }else{
            alert("무료체험을 신청하시면 추천링크를 받으실 수 있습니다.");
            return false;
        }
    }else {
        if(confirm("로그인이 필요합니다. 로그인 하시겠습니까?" )){
            common.hrefFunction("/member/login.html");
        }else{
            return false;
        }
    }

}
function fnSetCourse(){
    var thisUrl = new URL(location.href).host;
    if(thisUrl.indexOf('dev') != -1){
        prefixUrl = "https://dev-event.superv.com";
    }else if(thisUrl.indexOf('superv.com') != -1){
        prefixUrl = "https://www.superv.com";
    }else{
        prefixUrl = "http://localhost:8080";
    }
    if(!common.isNull(stuId)){
        fnSetCourseAjax(stuId);
    }else{
        stuId = sessionStorage.getItem("stuId");
        fnSetCourseAjax(stuId);

    }
}
function fnSetCourseAjax(thisStuId){
    if(!common.isNull(thisStuId)){
        sessionStorage.removeItem("stuId");
        stuId = null;
        const res = function(response) {
            if(response.data.result == "N"){
            }else{
            }
            $("[name='closePopComplete']").trigger("click");
        }
        var korCourseId = $("[name='korCourseId']:checked").val();
        var engCourseId = $("[name='engCourseId']:checked").val();
        var mathCourseId = $("[name='mathCourseId']:checked").val();
        let data = {
            "memId": thisStuId,
            "korCourseId": korCourseId,
            "engCourseId": engCourseId,
            "mathCourseId": mathCourseId
        };
        /*23.07.20*/
        com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/member/course', JSON.stringify(data), res);
    }else{
        $("[name='closePopComplete']").trigger("click");
    }
}
$(document).on('click', '[name="agreeCheckBox"]', function(){
    let privacyAgreeYn = $("#privacyAgreeYn").is(':checked');
    let provideRcvYn = $("#provideRcvYn").is(':checked');
    if(privacyAgreeYn && provideRcvYn){
        $("#total_check").prop("checked", true);
    }else{
        $("#total_check").prop("checked", false);
    }
});

/*2023.06.12 회원가입한 회원 확인.*/
function fnCheckParentStateByMdnNo(){
    var mdnNo = $('#mdnNo').val();
    $('[name="checkMdnNo"]').hide();
    const res = function(response) {
        if(response.message == "OK"){
            if(response.data.code == "201"){
                /*휴대폰번모 미기입*/
                alert(response.data.msg);
                $("#mdnNo").focus();
                fnInitPhoneForm();
                return false;

            }else if(response.data.code == "202"){
                /*회원가입 회뭥*/
                if(confirm(response.data.msg)){
                    sessionStorage.setItem("popTrigger", "on");
                    common.hrefFunction("/member/login.html");
                }else{
                    fnInitPhoneForm();
                    return false;
                }
            }else if(response.data.code == "203"){
                /*이미 무료체험 가입 신청한 회원*/
                if(confirm(response.data.msg)){
                    common.hrefFunction("/member/signup.html?signupType=temp");
                }else{
                    fnInitPhoneForm();
                    return false;
                }
            }else{
                fnGetCert(mdnNo);
            }
        }else{
            fnInitPhoneForm();
            alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            return false;
        }
    }
    let data = {
        "mdnNo" :mdnNo
    }
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/exp/member/check', JSON.stringify(data), res);
}

$(window).on("load",function (){
    if(!common.isNull(sessionStorage.getItem("popTrigger"))){
        if(sessionStorage.getItem("popTrigger") == "on"){
            $(".bottom_long_banner").trigger("click");
        }
    }
});
function fnGetMemInfoForexpRequest(){
    $("[name='recommendDiv']").hide();
    $("[name='inviteRecommMdnNoPart']").hide();
    $(".pop_contents").addClass("member");
    var jwtTokcen = jwt.getAllToken();
    var checkLogin = 0;
    if(!common.isNull(jwtTokcen.getItem("vuex"))) {
        var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
        var thisParentId = userInfo.parentId;
        if(!common.isNull(thisParentId)){
            checkLogin++;
            const res = function(response) {
                if(response.message == "OK"){
                    var thisData = response.data;
                    if(thisData.code == "200"){
                        $("#getParentName").val(thisData.data.parentNm);
                        $("#getParentMdnNo").val(thisData.data.mdnNo);
                        $("#zipcode").val(thisData.data.zipcode);
                        $("#address1").val(thisData.data.adr1);
                        $("#address2").val(thisData.data.adr2);
                        var childGroup = "";
                        var stuList = thisData.data.stuInfos;
                        stuCnt = stuList.length;
                        if(stuCnt >=3){
                            $("#addChildBtn").remove();
                        }
                        var disabledCheck = 0;
                        $.each(stuList, function (i, item) {
                            var childId = "child0"+i;
                            childGroup += '<label For="'+childId+'" class="radiobox_label'
                            if(item.expRequestCheck || item.stateCd == "2" || item.stateCd == "1"){
                                childGroup += ' disabled';
                                disabledCheck ++;
                            }
                            childGroup += '">';
                            childGroup += '<input type="radio" name="child" class="radiobox_item" id="'+childId+'" value="'+item.studentId+'">';
                            childGroup += item.studentNm;
                            childGroup += '</label>';
                        })
                        if(stuCnt < 3) {
                            childGroup += " <button class=\"child_plus\" onclick=\"fnOpenAddChildPop();\" id=\"addChildBtn\"><img src=\"../images/icon/experi_2-plus@2x.webp\" alt=\"\"></button>"
                        }
                        if(disabledCheck == 3){
                            allStuDisabled = true;
                        }
                        $(".child_group").html(childGroup);
                    }else{
                        checkLogin = 0;
                        if(!common.isNull(thisData.msg)){
                            alert(thisData.msg);
                        }else{
                            alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                        }
                    }
                }else{
                    alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                    return false;
                }
            }
            let data = {
                "parentId" :thisParentId
            }
            /*23.07.20*/
            com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/exp/member/student', JSON.stringify(data), res);
        }

    }
    if(checkLogin == 0){
        fnInitPhoneForm();
        return false;
    }


}

function fnReLoadChildInfo(){
    fnGetMemInfoForexpRequest();
}

function fnCheckBeforeSubmit(){
    var jwtTokcen = jwt.getAllToken();
    if(!common.isNull(jwtTokcen.getItem("accessToken")) && !common.isNull(jwtTokcen.getItem("expiredTime")) && !common.isNull(jwtTokcen.getItem("refreshToken"))){
        fnSubmitTrialFormForMember();
    }else{
        fnSubmitTrialForm();
    }
}

/*2023.06.26 로그인 회원의 무체신청.*/
function fnSubmitTrialFormForMember(){
    if(!$('#app_popup').hasClass("block")) {
        /*2023.05.24 더블클릭 허용 관련 위치 변경*/
        $('#app_popup').addClass("block");
        let checkCtn = 0;

        let deviceCaseDiv = $("[name='deviceCaseDiv']:checked").val();
        if (deviceCaseDiv == null || deviceCaseDiv == "") {
            $('[name="checkDeviceCaseDiv"]').show();
            checkCtn++;
        } else {
            $('[name="checkDeviceCaseDiv"]').hide();
        }
        let thisStudentId = $("[name='child']:checked").val();
        if (thisStudentId == null || thisStudentId == "") {
           if(allStuDisabled){
               alert( "체험 가능한 자녀가 없습니다. 도움이 필요하시면 고객센터로 문의해주세요.");
               checkCtn++;
               $('#app_popup').removeClass("block");
               return false;
           }else{
               alert("자녀를 선택해 주세요.");
               checkCtn++;
           }
        }
        let addrCheckCnt = 0;
        let address2 = $("#address2").val();
        if (address2 == null || address2 == "") {
            $('[name="checkAddress"]').find(".warn_para").html("상세 주소를 입력해 주세요.");
            $('[name="checkAddress"]').show();
            checkCtn++;
            addrCheckCnt++;
        }
        let zipcode = $("#zipcode").val();
        let address1 = $("#address1").val();
        if (zipcode == null || zipcode == "" || address1 == null || address1 == "") {
            $('[name="checkAddress"]').find(".warn_para").html("배송 주소를 입력해 주세요.");
            $('[name="checkAddress"]').show();
            checkCtn++;
            addrCheckCnt++;
        }
        if (addrCheckCnt == 0) {
            $('[name="checkAddress"]').hide();
        }
        if (checkCtn > 0) {
            /*2023.05.24 더블클릭 허용 관련 위치 변경*/
            $('#app_popup').removeClass("block");
            return false;
        }
        /*2023.05.24 더블클릭 허용 관련 위치 변경
        $('.btn_formsubmit').addClass("block");*/
        /*2022.11.13 heemok*/
        gtag('event', 'click', {
            'event_category':'신청하기버튼클릭',
            'event_label':'사전예약이벤트step1'
        });
        <!-- Taboola Pixel Code -->
        _tfa.push({notify: 'event', name: 'complete_registration', id: 1507255});
        <!-- End of Taboola Pixel Code -->
        const res = function (response) {
            try {
                <!-- Danggeun Market Code -->
                window.karrotPixel.track('SubmitApplication');
                <!-- End Danggeun Market Code -->
                $("#marketingIframe").attr("src",  "/include/marketingBodyFrame.html");
            }catch (e){
                console.log(e);
            }
            if (response.data.code == "200") {
                $("#tempParentLoginIdNm").html("회원 아이디");
                $("#tempParentLoginId").html(response.data.parentLoginId);
                $("#tempParentLogPwNm").html("자녀명");
                $("#tempParentLogPw").html(response.data.studentNm);
                /*학생*/
                stuId = response.data.studentId;
                sessionStorage.setItem("stuId", stuId);
                /*나이*/
                let thisStuAge = null;
                if(!common.isNull(response.data.birthdate)){
                    const birthYear = String(response.data.birthdate).substring(0,4);
                    const todayYear = new Date().getFullYear();
                    thisStuAge = todayYear - birthYear + 1;
                }

                $("[name='korCourseId']").prop("checked", false);
                $("[name='mathCourseId']").prop("checked", false);
                if(!common.isNull(stuId)){
                    if(!common.isNull(thisStuAge)){
                        thisStuAge = parseInt(thisStuAge);
                        $("[name='engCourseId']").eq(0).attr("checked", "checked");
                        $("[name='engCourseId']").eq(0).prop("checked", true);
                        if(thisStuAge <= 5){
                            $("[name='korCourseId']").eq(0).attr("checked", "checked");
                            $("[name='mathCourseId']").eq(0).attr("checked", "checked");
                            $("[name='korCourseId']").eq(0).prop("checked", true);
                            $("[name='mathCourseId']").eq(0).prop("checked", true);
                        }else if(thisStuAge == 6 ){
                            $("[name='korCourseId']").eq(1).attr("checked", "checked");
                            $("[name='mathCourseId']").eq(1).attr("checked", "checked");
                            $("[name='korCourseId']").eq(1).prop("checked", true);
                            $("[name='mathCourseId']").eq(1).prop("checked", true);
                        }else if(thisStuAge == 7){
                            $("[name='korCourseId']").eq(2).attr("checked", "checked");
                            $("[name='mathCourseId']").eq(2).attr("checked", "checked");
                            $("[name='korCourseId']").eq(2).prop("checked", true);
                            $("[name='mathCourseId']").eq(2).prop("checked", true);
                        }else if(thisStuAge >= 8){
                            $("[name='korCourseId']").eq(3).attr("checked", "checked");
                            $("[name='mathCourseId']").eq(3).attr("checked", "checked");
                            $("[name='korCourseId']").eq(3).prop("checked", true);
                            $("[name='mathCourseId']").eq(3).prop("checked", true);
                            $("[name='korCourseId']").eq(3).parents('li').removeClass("disabled");
                            $("[name='mathCourseId']").eq(3).parents('li').removeClass("disabled");
                            if(isMobile()){
                                $("[name='korCourseId']").eq(3).parents('li').show();
                                $("[name='mathCourseId']").eq(3).parents('li').show();
                            }
                        }
                        if(thisStuAge < 8){
                            $("[name='korCourseId']").eq(3).parents('li').addClass("disabled");
                            $("[name='mathCourseId']").eq(3).parents('li').addClass("disabled");
                            if(isMobile()){
                                $("[name='korCourseId']").eq(3).parents('li').hide();
                                $("[name='mathCourseId']").eq(3).parents('li').hide();
                            }
                        }
                    }else{
                        $('.select_step').remove();
                    }
                }else{
                    $('.select_step').remove();
                }

                $("#app_popup").removeClass("active");
                document.querySelector('body').style.overflow = 'hidden';
                $("#pop-complete").addClass("active");
                /*2023.05.24 더블클릭 허용 관련 위치 변경*/
                $('#app_popup').removeClass("block");
                $("#pop-complete").show();
            } else {
                alert(response.data.message);
                $('#app_popup').removeClass("block");
                return false;
            }
            $('#app_popup').removeClass("block");
        }
        var jwtTokcen = jwt.getAllToken();
        var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
        var thisParentId = userInfo.parentId;

        let data = {
            "parentId": thisParentId,
            "studentId": thisStudentId,
            "expRequestDiv": "1",
            "deviceCaseDiv": deviceCaseDiv,
            "zipcode": zipcode,
            "address1": address1,
            "address2":  common.decodeHTMLEntities(address2),
            "joinUrlCd" : 1,
        };
        let consultTime = "";
        $("[name='consultTime']").each(function(i){
            if($(this).is(":checked") == true) {
                let thisVal = $(this).val();
                if(thisVal == "consultMorning"){
                    data.consultMorningYn = "Y";
                    consultTime = "10,11,12"
                }
                if(thisVal == "consultAfter"){
                    data.consultAfterYn = "Y";
                    if(!common.isNull(consultTime)){
                        consultTime +=",13,14,15,16,17"
                    }else{
                        consultTime ="13,14,15,16,17";
                    }
                }
                if(thisVal == "consultEven"){
                    data.consultEvenYn = "Y";
                    if(!common.isNull(consultTime)){
                        consultTime +=",18,19,20"
                    }else{
                        consultTime ="18,19,20";
                    }
                }
            }
        });
        if(!common.isNull(consultTime)){
            data.consultTime = consultTime
        }
        /*2023.05.15 체험신청 후, 문자메세지 내용 전달*/
        let msgBody = "[광고] 슈퍼브이 추천하면 100% 선물!\n" +
            "\n" +
            "안녕하세요 #myName님\n" +
            "\n" +
            "슈퍼브이를 친구에게 소개하고\n" +
            "100% 상품권 받으세요.\n" +
            "무료체험만 추천해도 1만원 증정!\n" +
            "구매하면 추가 5만원 증정!\n" +
            "\n" +
            "[참여방법]\n" +
            "아래의 회원님만의 추천링크를 \n" +
            "친구에게 전달해 주세요.\n" +
            "\n" +
            "◆회원님만의 추천링크◆\n" +
            " #myRecommCd\n" +
            "\n" +
            "★[무료체험 추천시] 1만원X추천수만큼 \n" +
            "회원님의 추천링크를 통해\n" +
            "친구가 무료체험하면 \n" +
            "친구도 나도 '신세계상품권 1만원'\n" +
            "(월 최대 10만원 한정)\n" +
            "\n" +
            "★[추천받고 구매시] 5만원X추천수만큼\n" +
            "추천받은 친구가 구매하면\n" +
            "친구도 나도 '신세계상품권 5만원'\n" +
            "(월 최대 50만원 한정)\n" +
            "\n" +
            "기간 : ~23.12.31까지\n" +
            "\n" +
            "무료수신거부 0805331777";
        data.msgBody = msgBody;
        com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/exp/info', JSON.stringify(data), res);
    }
}