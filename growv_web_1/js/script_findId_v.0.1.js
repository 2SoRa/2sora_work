var isDisabled = false;
$(function(){
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
            $(".confirm").removeClass("disabled").prop("disabled", false);
        }else{
            $(".confirm").addClass("disabled").prop("disabled", true);
        }
    });
    $("body").on("keyup", ".custom-input", function(){
        var ck = $(this).val();
        if(ck == ""){
            $(this).next(".input-clear-button").addClass("disabled");
        }else{
            $(this).next(".input-clear-button").removeClass("disabled");
        }
    });
    $("body").on("click", ".input-clear-button", function(){
        $(this).prev(".custom-input").val("");
        $(this).addClass("disabled");
    });
    $("body").on("click", "button.contact", function(){
        $(this).parents(".item").next(".item").removeClass("hide");
    });
});

/*휴대전화번호 확인.*/
$(document).on('keydown', '[name="submitMdnNo"]', function (){
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
$(document).on('keyup click keydown', '[name="submitName"]', function (){
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

function fnSubmitFindId(){
    // $('.custom-error').removeClass('show');
    $('.custom-error').addClass('hide');
    var thisName = $('[name="submitName"]').val();
    var thisMdnNo = $('[name="submitMdnNo"]').val();
    if(common.isNull(thisName)){
        alert("학부모 이름을 입력해 주세요.");
        // $('.custom-error.name').addClass('show');
        $('.custom-error.name').removeClass('hide');
        return;
    }
    if(common.isNull(thisMdnNo)){

        alert("휴대폰 번호를 입력해 주세요.");
        // $('.custom-error.contact').addClass('show');
        $('.custom-error.contact').removeClass('hide');
        return;
    }

    const res = function(response) {
        if(response.code == "200"){
            $('[name="resultName"]').html(response.data.name);
            $('[name="resultEmail"]').html(response.data.loginId);
            $('[name="resultDate"]').html(response.data.regDt);
            $("[name='findIdForm']").hide();
            $("[name='findIdResult']").show();
            $('.login_info').html("아이디 찾기가 완료되었습니다.")
            $('[name="submitName"]').val('');
            $('[name="submitMdnNo"]').val('');
        }else{
            var returnMage = response.message;
            if(!common.isNull(returnMage)){
                alert(returnMage);
            }else{
                alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            }
            return false;
        }
    }
    let data = {
        name: thisName,
        mdnNo: thisMdnNo
    }
    data = JSON.stringify(data);
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/account/v1/web/user/search/id',  data, res);


}