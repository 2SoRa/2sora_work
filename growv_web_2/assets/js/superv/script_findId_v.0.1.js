/*학부모 이름 20byte, 영문, 한글 확인.*/
$(document).on('keyup click keydown', '[name="submitName"], [name="submitMdnNo"]', function () {
    if ($(this).attr("name") == "submitName") {
        $(this).val(common.nameCheck($(this).val()));
    }
    let submitBtn = $(this).parents(".item-group").siblings("button");
    if (!common.isNull($("[name='submitName']").val()) && $("[name='submitMdnNo']").val().length == 11) {
        submitBtn.attr("disabled", false);
        submitBtn.removeClass("disabled");
    } else {
        submitBtn.addClass("disabled");
    }

});

function fnSubmitFindId() {
    $('.custom-error').addClass('hide');
    var thisName = $('[name="submitName"]').val();
    var thisMdnNo = $('[name="submitMdnNo"]').val();
    if (common.isNull(thisName)) {
        alert("학부모 이름을 입력해 주세요.");
        $('.custom-error.name').removeClass('hide');
        return;
    }
    if (common.isNull(thisMdnNo)) {
        alert("휴대폰 번호를 입력해 주세요.");
        $('.custom-error.contact').removeClass('hide');
        return;
    }

    const res = function (response) {
        if (response.code == "200") {
            $('[name="resultName"]').html(response.data.name);
            $('[name="resultEmail"]').html(response.data.loginId);
            $('[name="resultDate"]').html(response.data.regDt);
            $("[name='findIdForm']").hide();
            $("[name='findIdResult']").show();
            $('.login_info').html("<strong name='resultName'>"+response.data.name+"</strong>님 아이디 찾기가 완료되었습니다.");
            $('[name="submitName"]').val('');
            $('[name="submitMdnNo"]').val('');
        } else {
            var returnMage = response.message;
            if (!common.isNull(returnMage)) {
                alert(returnMage);
            } else {
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
    com_ajax.ajax('post', '/clientsvc/account/v1/web/user/search/id', data, res);


}