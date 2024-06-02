var parentId = null;
var zipcode = null;
var adr1 = null;
var adr2 = null;
var adrClickCheck  = 0;
var nowMdnNo  = null;
var certCheck  = false;

const today = new Date();
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

let stuCnt = 0;
/*도메인 설정*/
var paymentUrl = 'http://localhost:4000';
var thisUrlCheck = new URL(location.href).host;
if(thisUrlCheck.indexOf('dev') != -1){
    paymentUrl = 'https://dev-admin.superv.com';
}else if(thisUrlCheck.indexOf('www.superv.com') != -1){
    paymentUrl = 'https://admin.superv.com';
}


$(document).ready(function (){
    fnLoginCheck();
    parentId = null;
    fnGetThisFullInfo();
})


function fnGetThisFullInfo(){
    var jwtTokcen = jwt.getAllToken();
    if(!common.isNull(jwtTokcen.getItem(ACCESS_TOKEN_NAME)) && !common.isNull(jwtTokcen.getItem(EXPIRED_TIME_NAME)) ) {
        $("[name='loginPart']").show();
        $("[name='loginOutPart']").hide();
        if(!common.isNull(jwtTokcen.getItem("vuex"))){
            var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
            if(!common.isNull(userInfo) && !common.isNull(userInfo.parentId)){
                parentId = userInfo.parentId;
            }
        }
    }else{
        jwt.destroyAll();
        $("[name='loginUserName']").html();
        $("[name='loginPart']").hide();
        $("[name='loginOutPart']").show();
        alert("로그인 후 진행해주세요.");
        common.hrefFunction('/main/login');
    }

    const res = function(response) {
        if(response.code == "200"){
            if(response.data.code == "200") {
                var returnData = response.data.data;
                var parentNm = returnData.parentNm;
                var mdnNo = returnData.mdnNo;
                var parentLoginId = returnData.parentLoginId;
                var regDtm = returnData.regDtm;
                var mkiRcvYn = returnData.mkiRcvYn;
                var mkiRcvYnDtm = returnData.mkiRcvYnDtm;
                var mkiRcvYnRegDtm = returnData.mkiRcvYnRegDtm;
                $('[name="parentNm"]').html(parentNm);
                nowMdnNo = mdnNo;
                $('[name="mdnNo"]').html(common.dashForPhone(mdnNo));
                $('[name="parentLoginId"]').html(parentLoginId);
                zipcode = returnData.zipcode;
                adr1 = returnData.adr1;
                adr2 = returnData.adr2;

                /*회원정보 수정 페이지에 값 넣기*/
                $("#zipcode").val(zipcode);
                $("#address1").val(adr1);
                $("#address2").val(adr2);
                $('[name="fullAdr"]').html(adr1 + " " + adr2);
                $('[name="regDtm"]').html(regDtm.substring(0,10));
                if(mkiRcvYn == true || mkiRcvYn == 'true' || mkiRcvYn =='Y'){
                    $('[name="mkiRcvYn"]').html('동의');
                    if(!common.isNull(mkiRcvYnDtm)){
                        $('[name="mkiRcvYnDtm"]').html(mkiRcvYnDtm.substring(0,10));
                        $('[name="mkiRcvYnDtm"]').show();
                    }
                    $('[name="mkCheckBox"]').attr('checked', 'checked');
                }else{
                    $('[name="mkiRcvYn"]').html('미동의');
                    $('[name="mkiRcvYnDtm"]').html('');
                    $('[name="mkCheckBox"]').attr('checked',false );
                }

                var studentList = new Array();
                studentList = returnData.myStudentList;
                stuCnt = studentList.length;
                if(stuCnt >=3){
                    $("#addChildBtn").remove();
                }
                if (studentList.length > 0) {
                    var html = "";
                    $.each(studentList, function (index, item) {
                        var orderNo = item.orderNo;
                        var birthdate = item.birthdate;
                        var cardCd = item.cardCd;
                        var cardNm = item.cardNm;
                        var genderDiv = item.genderDiv;
                        var prodId = item.prodId;
                        var prodNm = item.prodNm;
                        var studentId = item.studentId;
                        var studentNm = item.studentNm;
                        var studyEndDt = item.studyEndDt;
                        var studyStartDt = item.studyStartDt;
                        var invoiceDt = item.invoiceDt;
                        var invoiceMonth = item.invoiceMonth;
                        var invoiceDay = item.invoiceDay;
                        var realInvoiceDt = null;
                        /*임시 다음결제일 추가*/
                        if(!common.isNull(invoiceDt)){
                            realInvoiceDt = invoiceDt;
                        }else if(!common.isNull(invoiceMonth)){
                            realInvoiceDt = invoiceMonth;
                        }else{
                            realInvoiceDt = invoiceDay;
                        }
                        var studyStateCd = item.studyStateCd;
                        var studyStateNm = item.cdVlNm;
                        let thisDate = birthdate.substring(0,10);
                        let age = '';
                        const birthYear = String(thisDate).substring(0,4);
                        const todayYear = new Date().getFullYear();
                        age = todayYear - birthYear + 1;

                        html += '<div class="child-add-wrap">';
                        html += '<div class="child-info-wrap">';
                        html += '<div class="child-header-wrap">';

                        var openPayInfo = true;

                        var studyingCheck = false;
                        if(!common.isNull(studyEndDt)) {
                            var date2 = new Date();
                            var year2 = date2.getFullYear();
                            var month2 = date2.getMonth() + 1;
                            var day2 = date2.getDate();
                            if ((day2 + "").length < 2) {
                                day2 = "0" + day2;
                            }
                            var getDate2 = String(year2) + String(month2) + day2;
                            var newEndDt = studyEndDt.replace(/[^0-9]/g, "");
                            if (parseInt(getDate2) <= parseInt(newEndDt)) {
                                studyingCheck = true;
                            }
                        }else{
                            studyingCheck = true;
                        }


                        if(studyingCheck == false){
                            /*체험만료*/
                            html += '<div class="cpic" style="background:url(../images/icon/ico-study-status04.svg);"></div>';
                            openPayInfo = false;
                        }
                        else if(studyStateCd == '1'){
                            /*체험대기*/
                            html += '<div class="cpic" style="background:url(../images/icon/ico-study-status03.svg);"></div>';
                        }else if(studyStateCd == '2'){
                            /*체험만료*/
                            html += '<div class="cpic" style="background:url(../images/icon/ico-study-status04.svg);"></div>';
                            openPayInfo = false;
                        }else if(studyStateCd == '3'){
                            /*체험취소*/
                            html += '<div class="cpic" style="background:url(../images/icon/ico-study-status04.svg);"></div>';
                            openPayInfo = false;
                        }else if(studyStateCd == '4'){
                            /*체험진행*/
                            html += '<div class="cpic" style="background:url(../images/icon/ico-study-status02.svg);"></div>';
                        }else if(studyStateCd == '5'){
                            /*학습대기*/
                            html += '<div class="cpic" style="background:url(../images/icon/ico-study-status04.svg);"></div>';
                        }else if(studyStateCd == '6'){
                            /*학습만료*/
                            html += '<div class="cpic" style="background:url(../images/icon/ico-study-status04.svg);"></div>';
                            openPayInfo = false;
                        }else if(studyStateCd == '7'){
                            /*학습취소*/
                            html += '<div class="cpic" style="background:url(../images/icon/ico-study-status04.svg);"></div>';
                            openPayInfo = false;
                        }else if(studyStateCd == '8'){
                            /*학습진행*/
                            html += '<div class="cpic" style="background:url(../images/icon/ico-study-status01.svg);"></div>';
                        }else if(studyStateCd == '9'){
                            /*학습중지휴지*/
                            html += '<div class="cpic" style="background:url(../images/icon/ico-study-status01.svg);"></div>';
                        }else if(studyStateCd == '10'){
                            /*학습중지환불*/
                            html += '<div class="cpic" style="background:url(../images/icon/ico-study-status04.svg);"></div>';
                            openPayInfo = false;
                        }else if(studyStateCd == '11'){
                            /*학습중지미납*/
                            html += '<div class="cpic" style="background:url(../images/icon/ico-study-status01.svg);"></div>';
                        }else{
                            html += '<div class="cpic" style="background:url(../images/icon/ico-study-status04.svg);"></div>';
                            openPayInfo = false;
                        }

                        html += '<div class="ccont">';
                        html += '<div class="cname">' + studentNm + '</div>';
                        html += '<div class="cage"> ' + age + '세</div>';
                        if(!common.isNull(genderDiv)){
                            var genderNm = '남아';
                            if(genderDiv == 'F'){
                                genderNm = '여아';
                            }
                            html += '<div class="csex">' + genderNm + '</div>';
                        }
                        html += '</div>';
                        // html += '<button type="button" class="child-modify-btn" onclick="fnGetThisStuInfo(\''+studentId+'\',\''+studentNm+'\',\''+birthdate+'\',\''+genderDiv+'\',\''+openPayInfo+'\');">자녀 정보 수정</button>';
                        html += '</div>';
                        html += '<div class="child-cont-wrap">';
                        html += '<ul>';
                        var cnt = 0;
                        if(!common.isNull(prodNm) && openPayInfo){
                            cnt++;
                            html += '<li>';
                            html += '<div class="key">학습상품</div>';
                            html += '<div class="value str">' + prodNm + '</div>';
                            html += '</li>';
                        }
                        if(!common.isNull(studyStartDt) && openPayInfo){
                            cnt++;
                            html += '<li>';
                            html += '<div class="key">학습 시작일</div>';
                            html += '<div class="value">' + studyStartDt + '</div>';
                            html += '</li>';
                            html += '<li>';
                            html += '<div class="key">학습 종료일</div>';
                            html += '<div class="value">' + studyEndDt + '</div>';
                            html += '</li>';
                        }
                        if(!common.isNull(realInvoiceDt) && openPayInfo){
                            cnt++;
                            html += '<li>';
                            html += '<div class="key">다음 결제일</div>';
                            html += '<div class="value purple">' + realInvoiceDt + '</div>';
                            html += '</li>';
                        }
                        if(!common.isNull(cardNm) && openPayInfo && !common.isNull(realInvoiceDt)){
                            cnt++;
                            html += '<li>';
                            html += '<div class="key">결제 카드</div>';
                            html += '<div class="value">' + cardNm + '</div>';
                            // if(!common.isNull(cardNm)){
                            //     html += '<button type="button" onclick="fnChangeCard(\''+orderNo+'\',\''+parentId+'\',\''+studentId+'\',\''+prodId+'\',\''+prodNm+'\')">카드 결제 변경</button>';
                            // }
                            html += '</li>';
                        }
                        if (cnt == 0){
                            html += '<li class="no-product">';
                            html += '슈퍼브이와 함께 즐거운 공부를 시작하세요!';
                            html += '</li>';
                        }
                        html += '</ul>';
                        html += '</div>';
                        html += '</div>';
                        html +='<div class="btn-item-wrap">';
                        if(!common.isNull(cardNm) && openPayInfo && !common.isNull(realInvoiceDt)) {
                            html += '<button type="button" onclick="fnChangeCard(\'' + orderNo + '\',\'' + parentId + '\',\'' + studentId + '\',\'' + prodId + '\',\'' + prodNm + '\')">결제 카드 변경</button>';
                        }
                        if(item.orderTypeCd == "2" && (item.orderStateCd == "3" || item.orderStateCd == "11" || item.orderStateCd == "5" || item.orderStateCd == "7")){
                           html +='<button onclick="common.hrefFunction(\'contract-info.html\')";>계약 정보</button>';
                        }
                        html +='<button type="button" onclick="fnGetThisStuInfo(\''+studentId+'\',\''+studentNm+'\',\''+birthdate+'\',\''+genderDiv+'\',\''+openPayInfo+'\');">자녀 정보 수정</button>';
                        html +='</div>';
                        html +='</div>';
                    });
                    $("[name='addStudentHtml']").html(html);


                }
            } else{
                if(response.data.message != null){
                    alert(response.data.message);
                }else{
                    alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                }
                return false;
            }

        }else{
            if(response.message != null){
                alert(response.message);
            }else{
                alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            }
            return false;
        }

    }
    let data = {
        "parentId" : parentId,
    };
    data = JSON.stringify(data);
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/mypage/parent/Info',  data, res);
}
/*마케팅 동의확인.*/
$(document).on('change', '[name="mkCheckBox"]', function (){
    var thisAgree = false;
    if(common.isNull(parentId)){
        var jwtTokcen = jwt.getAllToken();
        if(!common.isNull(jwtTokcen.getItem(ACCESS_TOKEN_NAME)) && !common.isNull(jwtTokcen.getItem(EXPIRED_TIME_NAME)) ) {
            if(!common.isNull(jwtTokcen.getItem("vuex"))){
                var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
                if(!common.isNull(userInfo) && !common.isNull(userInfo.parentId)){
                    parentId = userInfo.parentId;
                }
            }
        }else{
            jwt.destroyAll();
            $("[name='loginUserName']").html();
            $("[name='loginPart']").hide();
            $("[name='loginOutPart']").show();
            alert("로그인 시간이 만료되었습니다. 재로그인 해주세요.");
            common.hrefFunction('/login.html');
        }
    }
    if($(this).is(':checked')){
        thisAgree = true;
    }
    var updateCheck = 0;
    if(thisAgree == false){
        if(confirm("개인정보의 마케팅 및 광고 활용 동의를 철회하시겠습니까?")){
            updateCheck++;
        }else{
            return false;
        }
    }else{
        updateCheck++;
    }
    if(updateCheck > 0){
        const res = function(response) {
            if (response.code == "200") {
                var returnMap = response.data;
                if(returnMap.mkiRcvYn == true || returnMap.mkiRcvYn == 'true' || returnMap.mkiRcvYn =='Y'){
                    $('[name="mkiRcvYn"]').html('동의');
                    if(!common.isNull(returnMap.mkiRcvYnDtm)){
                        $('[name="mkiRcvYnDtm"]').html(returnMap.mkiRcvYnDtm.substring(0,10));
                        $('[name="mkiRcvYnDtm"]').css('display','block');
                    }
                    $('[name="mkCheckBox"]').attr('checked', 'checked');
                }else{
                    $('[name="mkiRcvYn"]').html('미동의');
                    $('[name="mkiRcvYnDtm"]').html('');
                    $('[name="mkCheckBox"]').attr('checked',false );
                }
            } else{
                if(response.data.message != null){
                    alert(response.data.message);
                }else{
                    alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                }
                return false;
            }
            if(thisAgree == true){
                alert("개인정보의 마케팅 및 광고 활용 동의 처리 되었습니다.");
            }
        }

        let data = {
            "id" :parentId,
            "isMkiRcvAgreed" : thisAgree,
        };
        data = JSON.stringify(data);
        /*23.07.20*/
        com_ajax.ajax('post', '/clientsvc/account/v1/web/user/mkiRcvAgree',  data, res);

    }
})


var parentEmail = null;
function fnUpdateParentPwCheck(){
    var jwtTokcen = jwt.getAllToken();
    if(!common.isNull(jwtTokcen.getItem(ACCESS_TOKEN_NAME)) && !common.isNull(jwtTokcen.getItem(EXPIRED_TIME_NAME)) ) {
        if(!common.isNull(jwtTokcen.getItem("vuex"))){
            var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
            if(!common.isNull(userInfo) && !common.isNull(userInfo.parentId) && common.isNull(parentId)){
                parentId = userInfo.parentId;
            }
            if(!common.isNull(userInfo) && !common.isNull(userInfo.parentId) && common.isNull(parentEmail)){
                parentEmail = userInfo.parentEmail;
            }

        }
    }else{
        jwt.destroyAll();
        $("[name='loginUserName']").html();
        $("[name='loginPart']").hide();
        $("[name='loginOutPart']").show();
        alert("로그인 후 진행해주세요.");
        common.hrefFunction('/main/login');
    }

    const res = function(response) {
        if (response.code == "200") {

            var result = response.data;
            if (result.checked) { // 비밀번호 맞을때
                fnUpdateParentPw();
            }else{
                alert("현재 비밀전호를 다시 확인해주세요.");
                return false;
            }
        } else{
            if(response.data.message != null){
                alert(response.data.message);
            }else{
                alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            }
            return false;
        }
    }

    var thisPassWord = $('[name="nowPassWord"]').val();
    if(common.isNull(parentEmail)){
        alert(".시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다");
        return false;
    }
    if(common.isNull(thisPassWord)){
        alert("현재 비밀번호를 입력해 주세요.");
        return false;
    }
    let data = {
        "loginId" :parentEmail,
        "password" : thisPassWord,
    };
    data = JSON.stringify(data);
    /*23.07.20
    * study 홈페이지용 따로 만들어야함
    *
    * */
    com_ajax.ajax('post', '/clientsvc/account/v1/web/user/mypage/login',  data, res);

}

function fnUpdateParentPw(){
    if(common.isNull($('[name="newPassWord1"]').val()) || common.isNull($('[name="newPassWord2"]').val()) || common.isNull($('[name="nowPassWord"]').val())){
        alert("비밀번호를 입력해주세요.");
        $("[name='pwBtn']").addClass("disabled");
        $("[name='pwBtn']").attr("disabled", true);
        return false;
    }
    var jwtTokcen = jwt.getAllToken();
    if (!common.isNull(jwtTokcen.getItem("vuex"))) {
        var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
        if (!common.isNull(userInfo) && !common.isNull(userInfo.parentId) && common.isNull(parentId)) {
            parentId = userInfo.parentId;
        }
        if (!common.isNull(userInfo) && !common.isNull(userInfo.parentId) && common.isNull(parentEmail)) {
            parentEmail = userInfo.parentEmail;
        }

    }else{
        jwt.destroyAll();
        $("[name='loginUserName']").html();
        $("[name='loginPart']").hide();
        $("[name='loginOutPart']").show();
        alert("로그인 후 진행해주세요.");
        common.hrefFunction('/main/login');
    }

    const res = function(response) {
        if (response.code == "200") {
            if(response.data.id = parentId){
                alert("비밀번호 재설정이 완료되었습니다.");
                $('.btn_layerclose').trigger('click');
                $('[name="newPassWord1"]').val('');
                $('[name="newPassWord2"]').val('');
                $('[name="nowPassWord"]').val('');
                return false;
            }else{
                alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                return false;
            }
        } else{
            if(response.data.message != null){
                alert(response.data.message);
            }else{
                alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            }
            return false;
        }
    }

    var newPassword = $('[name="newPassWord1"]').val();
    let data = {
        "id" :parentId,
        "loginId" : parentEmail,
        "password" : newPassword
    };
    data = JSON.stringify(data);
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/account/v1/web/user/pw',  data, res);

}
function fnUpdateParentAddr(){
    var thisZipcode = $("#zipcode").val();
    var thisAddress1 = $("#address1").val();
    var thisAddress2 = common.decodeHTMLEntities($("#address2").val());

    const res = function(response) {
        if(response.message == "OK"){
            zipcode = thisZipcode;
            adr1 = thisAddress1;
            adr2 = thisAddress2;
            alert("주소 수정이 완료되었습니다.");
            /*회원정보 수정 페이지에 값 넣기*/
            $("#zipcode").val(zipcode);
            $("#address1").val(adr1);
            $("#address2").val(adr2);
            $('[name="fullAdr"]').html(adr1 + " " + adr2);
            $('.btn_layerclose').trigger('click');
            return false;
        } else if( response.data.result == 'Y'){
            zipcode = thisZipcode;
            adr1 = thisAddress1;
            adr2 = thisAddress2;
            alert("주소 수정이 완료되었습니다.");
            /*회원정보 수정 페이지에 값 넣기*/
            $("#zipcode").val(zipcode);
            $("#address1").val(adr1);
            $("#address2").val(adr2);
            $('[name="fullAdr"]').html(adr1 + " " + adr2);
            $('.btn_layerclose').trigger('click');
            return false;
        }
        else{
            if(response.data.message != null){
                alert(response.data.message);
            }else{
                alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            }
            $('.btn_layerclose').trigger('click');
            return false;
        }
    }
    var data = {
        "parentId": parentId,
        "zipcode": thisZipcode,
        "adr1": thisAddress1,
        "adr2": thisAddress2,
    }
    data = JSON.stringify(data);
    /*23.07.20*/
    com_ajax.ajax('put', '/clientsvc/hpg/v1/svh/mypage/member/address',  data, res);


}
$(document).on('keyup', '[name="newPassWord1"], [name="newPassWord2"]', function (){
    var firstPw = $('[name="newPassWord1"]').val();
    var secondPw = $('[name="newPassWord2"]').val();
    $("[name='pwCheck']").hide();
    // 영문+숫자 8자 이상 체크
    const pw_reg1 = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,50}$/; //영문,숫자
    // 특수문자 포함 6자 이상
    const pw_reg2_check1 = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,50}$/; //영문,특수문자
    const pw_reg2_check2 = /^(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{6,50}$/; //특수문자, 숫자
    if (!pw_reg1.test(firstPw) && (!pw_reg2_check1.test(firstPw) || !pw_reg2_check2.test(firstPw)) && !common.isNull(firstPw)) {
        $("[name='pwBtn']").addClass("disabled");
        $("[name='pwBtn']").attr("disabled", true);
        $("[name='pwCheck']").eq(0).show();
        return false;
    }
    var koreanCheck = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    if(koreanCheck.test(firstPw)){
        $("[name='pwBtn']").addClass("disabled");
        $("[name='pwBtn']").attr("disabled", true);
        $("[name='pwCheck']").eq(0).show();
        return false;
    }

    if(firstPw !== secondPw && !common.isNull(secondPw)) {
        $("[name='pwBtn']").addClass("disabled");
        $("[name='pwBtn']").attr("disabled", true);
        $("[name='pwCheck']").eq(1).show();
        return false;
    }
    var nowPassword = $('[name="nowPassWord"]').val();
    if(!common.isNull(nowPassword)  && !common.isNull(firstPw) && !common.isNull(secondPw)){
        $("[name='pwBtn']").removeClass("disabled");
        $("[name='pwBtn']").attr("disabled", false);
        return false;
    }

})

$(document).on('keyup click keydown', '#address2', function (){
    var thisZipCheck = $("#zipcode").val();
    var thisAddress1Check = $("#address1").val();
    var adrChangeCheck = 0;
    if(!common.isNull(thisZipCheck) && thisZipCheck != zipcode){
        adrChangeCheck++;
    }
    if(!common.isNull(thisAddress1Check) && thisAddress1Check != adr1){
        adrChangeCheck++;
    }
    var thisValue = $(this).val();
    if(!common.isNull(thisValue) && adr2 != thisValue){
        adrChangeCheck++;
    }
    if(adrChangeCheck > 0 && !common.isNull(thisValue)){
        $("[name='addrBtn']").removeClass("disabled");
        $("[name='addrBtn']").attr("disabled", false);
    }else{
        $("[name='addrBtn']").addClass("disabled");
        $("[name='addrBtn']").attr("disabled", true);
    }
})


/*휴대전화번호 확인.*/
$(document).on('keyup click keydown', '[name="thisMdnNo"]', function (){
    $('[name="phoneFormCheck"]').html('휴대폰 번호를 올바르게 입력해 주세요.');
    var curVal = $(this).val().replaceAll("-", "");

    $('[name="thisMdnNo"]').val(curVal);
    $('[name="thisCertBtn"]').attr('disabled', true);
    $('[name="thisCertBtn"]').addClass('disabled');

    var totalCnt = curVal.length;
    if(totalCnt > 11){
        while(totalCnt > 11){
            curVal = curVal.substring(0, curVal.length-1);
            totalCnt = curVal.length;
        }
    }
    $(this).val(curVal);

    if(totalCnt == 11){
        if(common.phonecheck(curVal)){
            $('[name="thisGetCertBtn"]').attr('disabled', false);
            $('[name="thisGetCertBtn"]').removeClass('disabled');
            $('[name="phoneFormCheck"]').hide();
            if(nowMdnNo == curVal){
                $('[name="thisGetCertBtn"]').attr('disabled', true);
                $('[name="thisGetCertBtn"]').addClass('disabled');
                $('[name="phoneFormCheck"]').html('현재 휴대폰 번호와 동일합니다.');
                $('[name="phoneFormCheck"]').show();
            }else{
                $('[name="thisGetCertBtn"]').attr('disabled', false);
                $('[name="thisGetCertBtn"]').removeClass('disabled');
                $('[name="phoneFormCheck"]').hide();
            }
        }else{
            $('[name="thisGetCertBtn"]').attr('disabled', true);
            $('[name="thisGetCertBtn"]').addClass('disabled');
            $('[name="phoneFormCheck"]').show();
        }
    }else{
        if(curVal != null && curVal !== ""){
            $('[name="phoneFormCheck"]').show();
        }
        $('[name="thisGetCertBtn"]').attr('disabled', true);
        $('[name="thisGetCertBtn"]').addClass('disabled');
    }

})

function fnGetCert(){
    var mdnNo = $('[name="thisMdnNo"]').val();
    const res2 = function(response) {
        if(response.message == "OK"){
            if(response.data.result == "N"){
                alert(response.data.message);
                $('[name="thisMdnNo"]').val('');
                $('[name="thisMdnNo"]').focus();
                $("[name='thisGetCertBtn']").attr('disabled', true);
                $("[name='thisGetCertBtn']").addClass('disabled');
                return false;
            }else{

                const res = function(response) {
                    if(response.code == "200"){
                        certCheck = false;
                        fnGetTime(180);
                    }else{
                        alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                        return false;
                    }
                }
                let data = {"mdnNo" : mdnNo};
                /*23.07.20*/
                com_ajax.ajax('post', '/clientsvc/account/v1/web/sms/cert/send', JSON.stringify(data), res);

            }
        }else{
            alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            return false;
        }
    }
    let data2 = [];
    /*23.07.20*/
    com_ajax.ajax('get', '/clientsvc/hpg/v1/svh/parent/mdn/dup?mdnNo='+mdnNo,data2, res2);
}

function fnGetTime(restTime){

    $("[name='afterCertBtn']").show();
    $('[name="thisCertInput"]').attr("disabled", false);
    $('[name="thisCertInput"]').removeClass("disabled");

    $("[name='phoneFormCheck']").hide();
    $('[name="thisGetCertBtn"]').attr("disabled", true);
    $('[name="thisGetCertBtn"]').addClass("disabled");
    $('[name="thisMdnNo"]').attr("disabled", true);
    $('[name="thisMdnNo"]').addClass("disabled");


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

            $("[name='afterCertBtn']").hide();
            $('[name="restTime"]').html('03:00');
            $('[name="thisGetCertBtn"]').html("재전송");
            $('[name="thisCertInput"]').attr("disabled", true);
            $('[name="thisCertInput"]').addClass("disabled");
            $('[name="thisCertBtn"]').attr("disabled", true);

            $('[name="thisCertBtn"]').addClass("disabled");
            $("[name='phoneFormCheck']").hide();
            $('[name="thisGetCertBtn"]').attr("disabled", false);
            $('[name="thisGetCertBtn"]').removeClass("disabled");
            $('[name="thisMdnNo"]').attr("disabled", false);
            $('[name="thisCertInput"]').val('');

            $('[name="thisMdnNo"]').removeClass("disabled");
            clearInterval(timerInterval);
            certCheck = false;
            return false;
        }
    }, 1000);
}

$(document).on('keyup click keydown', '[name="thisCertInput"]', function (){
    $('[name="checkMdnNo"]').hide();
    var curVal = $(this).val().replaceAll("-", "");
    $('[name="thisCertInput"]').val(curVal);
    $('[name="thisCertBtn"]').attr('disabled', true);
    $('[name="thisCertBtn"]').addClass('disabled');

    var totalCnt = curVal.length;
    if(totalCnt > 4){
        while(totalCnt > 4){
            curVal = curVal.substring(0, curVal.length-1);
            totalCnt = curVal.length;
        }
    }
    $(this).val(curVal);

    if(totalCnt == 4){
        $('[name="thisCertBtn"]').attr("disabled", false);
        $('[name="thisCertBtn"]').removeClass("disabled");
    }else{
        $('[name="thisCertBtn"]').attr('disabled', true);
        $('[name="thisCertBtn"]').addClass('disabled', true);
    }


})

/*인증번호 확인*/
$(document).on('click', '[name="thisCertBtn"]', function(){
    var thisMdnNo= $("[name='thisMdnNo']").val();
    var thisCertInput = $("[name='thisCertInput']").val();
    if(thisMdnNo == null || thisMdnNo == ""){
        $('[name="phoneFormCheck"]').show();
        return false;
    }
    if(thisCertInput == null || thisCertInput == ""){
        $('[name="checkMdnNo"]').html("인증번호를 입력해주세요.");
        $('[name="checkMdnNo"]').show();
        $("[name='thisCertInput']").focus();
        return false;
    }
    $('[name="checkMdnNo"]').hide();

    const res = function(response) {
        if(response.code == "200"){
            if(response.message == "OK"){
                $('[name="checkMdnNo"]').hide();
                $('[name="certMsg"]').show();
                $('[name="thisCertBtn"]').attr('disabled', true);
                $('[name="thisCertBtn"]').addClass('disabled', true);
                $('[name="thisCertInput"]').attr('disabled', true);
                $('[name="thisCertInput"]').addClass('disabled', true);
                $('[name="updatePhoneBtn"]').attr("disabled", false);
                $('[name="updatePhoneBtn"]').removeClass("disabled");
                clearInterval(timerInterval);

                certCheck = true;
            }else{
                $('[name="checkMdnNo"]').html("인증번호가 일치하지 않습니다. 다시 인증해주세요.");
                $('[name="checkMdnNo"]').show();
                $('[name="certMsg"]').hide();
                certCheck = false;
                return false;
            }
        }else{
            alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            return false;
        }
    }
    let data = {"mdnNo" : thisMdnNo, "certNo" : thisCertInput};
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/account/v1/web/sms/cert/check',  JSON.stringify(data), res);

});

$(document).on('click', '[name="updatePhoneBtn"]', function(){
    var thisMdnNo= $("[name='thisMdnNo']").val();
    var thisCertInput = $("[name='thisCertInput']").val();
    if(thisMdnNo == null || thisMdnNo == ""){
        $('[name="phoneFormCheck"]').show();
        return false;
    }
    if(thisCertInput == null || thisCertInput == ""){
        $('[name="checkMdnNo"]').html("인증번호를 입력해주세요.");
        $('[name="checkMdnNo"]').show();
        $("[name='thisCertInput']").focus();
        return false;
    }
    if(!certCheck){
        $('[name="checkMdnNo"]').html("휴대폰 번호를 인증해 주세요.");
        $('[name="checkMdnNo"]').show();
        return false;
    }
    $('[name="checkMdnNo"]').hide();

    const res = function(response) {
        if(response.message == "OK"){
            var returnResult = response.data.result;
            if(returnResult == "Y"){
                nowMdnNo = thisMdnNo;
                $('[name="mdnNo"]').html(common.dashForPhone(thisMdnNo));
                alert("휴대폰 번호 수정이 완료되었습니다.");
                $('.btn_layerclose').trigger('click');
                return false;
            }
        }else{
            alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            return false;
        }
    }
    var jwtTokcen = jwt.getAllToken();
    if (!common.isNull(jwtTokcen.getItem("vuex"))) {
        var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
        if (!common.isNull(userInfo) && !common.isNull(userInfo.parentId) && common.isNull(parentId)) {
            parentId = userInfo.parentId;
        }
    }else{
        jwt.destroyAll();
        $("[name='loginUserName']").html();
        $("[name='loginPart']").hide();
        $("[name='loginOutPart']").show();
        alert("로그인 후 진행해주세요.");
        common.hrefFunction('/main/login');
    }
    let data = {"parentId" : parentId, "parentMdnNo" : thisMdnNo};
    data = JSON.stringify(data);
    /*23.07.20*/
    com_ajax.ajax('put', '/clientsvc/study/v1/stw/mypage/mdn', data, res);

});
function fnGetMyInfoPop(popId){
    $('.inputInit').val('');
    $(".dimlayer_z").removeClass('active');
    $('.d_red').hide();
    $('.warn_para_g').hide();
    $('.confirm').attr('disabled', true);
    $('.confirm').addClass('disabled');
    $('[name="thisCertBtn"]').attr('disabled', true);
    $('[name="thisCertBtn"]').addClass('disabled');
    $('[name="updatePhoneBtn"]').attr('disabled', true);
    $('[name="updatePhoneBtn"]').addClass('disabled');
    $("[name='thisGetCertBtn']").attr('disabled', true);
    $("[name='thisGetCertBtn']").addClass('disabled');
    document.querySelector('body').style.overflow = 'hidden';
    if(popId == "#address_modify") {
        /*회원정보 수정 페이지에 값 넣기*/
        $("#zipcode").val(zipcode);
        $("#address1").val(adr1);
        $("#address2").val(adr2);
    }else if(popId == "#add_child"){
        $("[name='thisStuId']").remove();
        $('#add_child').removeClass('modify');
    }

    $(popId).addClass("active");
}

function fnGetThisStuInfo(thisId, thisName, thisBirth, thisGender, openPayInfo){
    if(openPayInfo == 'true' || openPayInfo == true){
        alert("학습을 진행중인 자녀정보는 수정할 수 없습니다.");
        return false;
    }
    $("[name='thisStuId']").remove();
    $("[name='thisStudentNm']").val(thisName);
    fnSetCalendar(minYear, maxYear, minMonth, maxMonth, minDay, maxDay);
    if(!common.isNull(thisBirth)){
        var thisStuYear = thisBirth.substring(0,4);
        var thisStuMonth = thisBirth.substring(5,7);
        var thisStuDay = thisBirth.substring(8,10);


        var thisFull = String(thisStuYear) + String(thisStuMonth) + String(thisStuDay);
        thisFull = parseInt(thisFull);

        var realMinMonth =  studentStartDate.getMonth()+1;
        var realMinday =  studentStartDate.getDate();
        if(realMinMonth < 10){
            realMinMonth = "0"+realMinMonth;
        }
        if(realMinday < 10){
            realMinday = "0"+realMinday;
        }
        var minFUll = String(minYear)+"01"+"01";
        minFUll = parseInt(minFUll);

        var realMaxMonth =  studentEndDate.getMonth()+1;
        var realMaxday =  studentEndDate.getDate();
        if(realMaxMonth < 10){
            realMaxMonth = "0"+realMaxMonth;
        }
        if(realMaxday < 10){
            realMaxday = "0"+realMaxday;
        }
        var maxFUll = String(maxYear)+realMaxMonth+realMaxday;
        maxFUll = parseInt(maxFUll);

        if(thisFull <= minFUll){
            var thisMinMM = studentStartDate.getMonth();
            fnSetCalendar(minYear, maxYear, 1, 12, minDay, maxDay);
            $("[name='yearSel']").val(minYear);
            $("[name='monthSel']").val(1);
            $("[name='daySel']").val(1);
            fncalcAge(minYear+'-01-01');
        }else if(thisFull >= maxFUll){
            var thisMaxMM = studentEndDate.getMonth();
            fnSetCalendar(minYear, maxYear, 1, thisMaxMM+1, minDay, studentEndDate.getDate());
            $("[name='yearSel']").val(maxYear);
            $("[name='monthSel']").val(thisMaxMM+1);
            $("[name='daySel']").val( studentEndDate.getDate());
            fncalcAge(maxYear+'-'+thisMaxMM+1+'-'+ studentEndDate.getDate());
        }else{
            fncalcAge(thisStuYear+'-'+thisStuMonth+'-'+thisStuDay);
            thisStuYear = parseInt(thisStuYear);
            thisStuMonth = parseInt(thisStuMonth);
            if(thisStuMonth == 2){
                fnSetCalendar(minYear, maxYear, minMonth, maxMonth, minDay, 29);
            }
            thisStuDay = parseInt(thisStuDay);
            $("[name='yearSel']").val(thisStuYear);
            $("[name='monthSel']").val(thisStuMonth);
            $("[name='daySel']").val(thisStuDay);
        }

    }
    if(!common.isNull(thisGender)){
        $("input:radio[name='thisStudentGender']:radio[value='"+thisGender+"']").prop('checked', true); // 선택하기
    }
    var stuIdHtml = "<input type='hidden' name='thisStuId' value='"+thisId+"'/>";
    $('#add_child').addClass('modify');
    $('#add_child').append(stuIdHtml);
    $("#add_child").addClass("active");
    document.querySelector('body').style.overflow = 'hidden';

    fnCheckAllStudentInfo();
}


function fnSetCalendar(thisMinYear, thisMaxYear, thisMinMonth, thisMaxMonth, thisMinDay, thisMaxDay){
    let yearSel = $('[name="yearSel"]').val();
    let monthSel = $('[name="monthSel"]').val();
    let daySel = $('[name="daySel"]').val();


    let fullHtml = "";
    let yearHtml = '<select name="yearSel" class="form_select ready wid_full" required>';
    yearHtml += '<option value="">년</option>';
    for(let y = thisMinYear; y<=thisMaxYear; y++){
        yearHtml += '<option value="'+y+'"';
        if(yearSel == y){
            yearHtml += 'selected';
        }
        yearHtml +='>'+y+'년</option>';
    }
    yearHtml += '</select>';

    let monthHtml = '<select name="monthSel" class="form_select ready wid_30';
    if(yearSel == null || yearSel == undefined || yearSel == ""){
        //monthHtml += 'disabled'
    }
    monthHtml += '" required> '
    monthHtml += '<option value="">월</option>';
    for(let m = thisMinMonth; m<=thisMaxMonth; m++){
        monthHtml += '<option value="'+m+'"';
        if(monthSel == m){
            monthHtml += 'selected';
        }
        monthHtml += '>'+m+'월</option>';
    }
    monthHtml += '</select>';

    let dayHtml = '<select name="daySel" class="form_select ready wid_30" required>';
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

    if(yearSel == minYear){
        var thisMinMM = studentStartDate.getMonth();
        fnSetCalendar(minYear, maxYear, 1, 12, minDay, maxDay);
    }else if(yearSel == maxYear){
        var thisMaxMM = studentEndDate.getMonth();
        if($('[name="monthSel"]').val() == String(thisMaxMM+1)){
            fnSetCalendar(minYear, maxYear, 1, thisMaxMM+1, minDay, studentEndDate.getDate());
        }else{
            fnSetCalendar(minYear, maxYear, 1, thisMaxMM+1, minDay, maxDay);
        }
    }else {
        fnSetCalendar(minYear, maxYear, minMonth, maxMonth, minDay, maxDay);
    }
    let monthSel = $('[name="monthSel"]').val();
    let daySel = $('[name="daySel"]').val();
    if(yearSel != null && yearSel != ""  && yearSel != "0" && monthSel != null && monthSel != "" && monthSel != "0" && daySel != null && daySel != "" && daySel != "0"){
        fncalcAge(yearSel+'-'+monthSel+'-'+daySel);
    }else{
        $("[name='calAgeInput']").val('');
    }

    fnCheckAllStudentInfo();
});


function fncalcAge(birthDate) {
    let age = '';

    const birthYear = String(birthDate).substring(0,4);
    const todayYear = new Date().getFullYear();

    age = todayYear - birthYear + 1;
    age += "세";
    $("[name='calAgeInput']").val(age);
}


function fnCheckAllStudentInfo(){
    var studentNm = $("[name='thisStudentNm']").val();
    var stuBirthYear = $("[name='yearSel']").val();
    var stuBirthMonth = $("[name='monthSel']").val();
    var stuBirthDay = $("[name='daySel']").val();
    var stuGender = $("[name='thisStudentGender']:checked").val();
    if(!common.isNull(studentNm) && !common.isNull(stuBirthYear) && !common.isNull(stuBirthMonth) && !common.isNull(stuBirthDay)
        && !common.isNull(stuGender)
        && stuBirthYear != "0" && stuBirthMonth != "0"&& stuBirthDay != "0"){
        $("[name='updateMemberStu']").attr("disabled", false);
        $("[name='updateMemberStu']").removeClass("disabled");
    }else{
        $("[name='updateMemberStu']").attr("disabled", true);
        $("[name='updateMemberStu']").addClass("disabled");
    }
}
$(document).on('keyup click keydown', '[name="thisStudentNm"],#stuNamePop', function (){
    var curVal = $(this).val();
    var pattern = /[\u3131-\u314e|\u314f-\u3163|\uac00-\ud7a3]/g;
    var koreanLangCnt = !!curVal.match(pattern) ? curVal.match(pattern).length : 0;
    var etcLangCnt = curVal.length - koreanLangCnt;
    var koreanLangByte = koreanLangCnt * 2;
    var etcLangByte = etcLangCnt;
    var totalCnt = koreanLangByte + etcLangByte;
    var regex = /^[ㄱ-ㅎㅏ-ㅣ가-힣ㅣ\u318Dㅣ\u119Eㅣ\u11A2ㅣ\u2022ㅣ\u2025ㅣ\u00B7ㅣ\uFE55|a-z|A-Z]+$/;
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

    if(this.name == 'thisStudentNm'){
        fnCheckAllStudentInfo();
    }else{
        fnCheckAddStuInfo();

    }
});
$(document).on('keyup click keydown', '[name="thisStudentGender"]', function (){
    fnCheckAllStudentInfo();
});


$(document).on('click', '[name="updateMemberStu"]', function(){
    fnCheckAllStudentInfo();
    if(!$("[name='updateMemberStu']").hasClass('disabled')){

        var studentNm = $("[name='thisStudentNm']").val();
        var studentId = $("[name='thisStuId']").val();
        var stuBirthYear = $("[name='yearSel']").val();
        var stuBirthMonth = $("[name='monthSel']").val();
        var stuBirthDay = $("[name='daySel']").val();
        var stuGender = $("[name='thisStudentGender']:checked").val();
        const res = function(response) {
            if(response.data.result == "Y"){
                fnGetThisFullInfo();
                alert("자녀 정보가 수정되었습니다.");
                childModifyClosePop();
                $('.btn_layerclose').trigger('click');
            }else{
                if(!common.isNull(response.data.message)){
                    alert(response.data.message);
                }else{
                    alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                    childModifyClosePop();
                }
            }
        }
        var jwtTokcen = jwt.getAllToken();
        if (!common.isNull(jwtTokcen.getItem("vuex"))) {
            var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
            if (!common.isNull(userInfo) && !common.isNull(userInfo.parentId) && common.isNull(parentId)) {
                parentId = userInfo.parentId;
            }
        }else{
            jwt.destroyAll();
            $("[name='loginUserName']").html();
            $("[name='loginPart']").hide();
            $("[name='loginOutPart']").show();
            alert("로그인 후 진행해주세요.");
            common.hrefFunction('/main/login');
        }
        if (parseInt(stuBirthMonth) < 10) {
            stuBirthMonth = "0" + stuBirthMonth;
        }
        if (parseInt(stuBirthDay) < 10) {
            stuBirthDay = "0" + stuBirthDay;
        }
        let data = {"parentId" : parentId,"studentId":studentId, "studentNm" : studentNm, "genderDiv" : stuGender,"birthdate" : stuBirthYear+"-"+stuBirthMonth+"-"+ stuBirthDay};
        data = JSON.stringify(data);
        /*23.07.20*/
        com_ajax.ajax('put', '/clientsvc/hpg/v1/svh/mypage/member/student', data, res);

    }
});
function fnChangeCard(orderId,thisParentId,studentId,prodId,prodNm){
        /*배송정보 저장하기*/
        var device = "pc";
        const res = function (response) {
            if (response.code == "200") {
                if(response.data.checkOrder){
                    if(confirm("지금 카드를 변경하시면 다음 결제일부터 반영됩니다.\n카드를 변경 하시겠습니까?")){
                        var UserAgent = navigator.userAgent;
                        if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
                            device = 'mobile';
                        }
                        deliveryId = response.data;
                        var appendHtml = '<iframe style="z-index:999;overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px" src="'+paymentUrl+'/payment.html#/cardChange?prodId='+prodId+'&prodNm='+prodNm+'&parentId='+thisParentId+'&studentId='+studentId+'&orderId='+orderId+'&device='+device+'"></iframe>';
                        $("#replaceIframe").html(appendHtml);
                        $("#payPop").show();
                        document.querySelector('body').style.overflow = 'hidden';
                    }
                }else{
                    alert(response.data.msg);
                    return false;
                }
            } else {
                if (response.message != null) {
                    alert(response.message);
                } else {
                    alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                }
                return false;
            }
        }
        let data = {
            'orderId':orderId
        };
        /*23.07.20*/
        com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/mypage/pament/card/check', orderId, res);


}
window.addEventListener('message', function(e) {
    if(!common.isNull(e.data.message)){
        $("#payPop").hide();
        alert("결제 중 오류가 발생했습니다.\n잠시 후 다시 결제 진행하시기 바랍니다.\n");
        console.log(e.data.message);
        document.querySelector('body').style.overflow = 'auto';
    }else if(e.data == 'cancel'){
        $("#payPop").hide();
        document.querySelector('body').style.overflow = 'auto';
    }else if(e.data == 'success'){
        alert("카드 정보가 변경되었습니다.\n다음 결제부터 반영됩니다.");
        location.reload();
        $("#payPop").hide();
        document.querySelector('body').style.overflow = 'auto';
    }else if(e.data == 'close'){
        $("#payPop").hide();
        document.querySelector('body').style.overflow = 'auto';
    }else if(e.data == 'fail'){
        $("#payPop").hide();
        document.querySelector('body').style.overflow = 'auto';
    }else{
        $("#payPop").hide();
        document.querySelector('body').style.overflow = 'auto';
    }

});
function fnReLoadChildInfo(){
    fnGetThisFullInfo();
}