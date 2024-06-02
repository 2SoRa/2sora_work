//input superVboard_inp_txt 입력된 글자수 체크하는 함수
$('#superVboard_inp_txt').on('keyup', function(){

    $('#superVcusReqSubmitBtn').removeClass('disabled');
    $('#superVcusReqSubmitBtn').attr('disabled', false);
    const textLength = $(this).val().length;
    $('.sub_title p span').text(textLength);

});


//고객 로그인 정보 확인
function checkCusReqlogin(){

    const jwtTokcen = jwt.getAllToken();
    if(!common.isNull(jwtTokcen.getItem(ACCESS_TOKEN_NAME)) && !common.isNull(jwtTokcen.getItem(EXPIRED_TIME_NAME)) && !common.isNull(jwtTokcen.getItem(REFRESH_TOKEN_NAME))) {
        return true;
    }else {
      if(confirm("로그인이 필요합니다. 로그인 하시겠습니까?" )){
        common.hrefFunction("/member/login.html");
      }else{
        return false;
      }
    }
}

//전화번호 클릭시 로그인 확인
const suervBoardInputNum = document.getElementById('superVboard_inp_num');
suervBoardInputNum.addEventListener('click', function() {
    checkCusReqlogin()
});

suervBoardInputNum.addEventListener("keydown",  function(KeyboardEvent) {

    const key = KeyboardEvent.keyCode;
    const inputValLen = $("#superVboard_inp_num").val().trim().length;
    const checkInput = checkInputKeyBoard(event.key);

    // delete, backspace, tab, 숫자 입력의 경우 허용
    if ( (key == 8 || key == 46 || key==9)  || (key >= 48 && key <= 57) || (key >= 96 && key <= 105)  ){
        // 숫자 이외의 입력을 막음
    } else {
        event.preventDefault();
    }

    //숫자 전화번호 이상 입력시 입력 막음
    if(inputValLen == 11 && checkInput == true) {
        event.preventDefault();
    }

});

//슈퍼브이에 바라는 내용 클릭시 로그인 확인
const suervBoardInputTxt = document.getElementById('superVboard_inp_txt');
suervBoardInputTxt.addEventListener('click', function() {
    checkCusReqlogin();
});



// 현재 입력값이 숫자인지 확인
function checkInputKeyBoard(objVal){
    const pattern = /^[0-9]*$/;            
    if (pattern.test(objVal)) {
        return true;    
    } else {
        return false;
    }
}

function submitCusReq(){

    if(!checkCusReqlogin()){
        return;
    } else {
        if($("#superVboard_inp_num").val().length != 11){
            alert("휴대폰 번호를 입력해 주세요.");
            return false;
        }
        if(Number($('.sub_title p span').text()) < 30){
            alert("내용을 최소 30자 이상 입력해주세요.");
            return false;                            
        }
        if(Number($('.sub_title p span').text()) > 500){
            alert("500자 까지만 입력할 수 있습니다.");
            return false;
        }
    }

    if(confirm("등록하시겠습니까?" )){
    
        const res = function(response) {
            $("#superVboard_inp_txt").val("");
            $("#superVboard_inp_num").val("");                
            $('.sub_title p span').text(0)
            $('#superVcusReqSubmitBtn').attr('disabled', true);
            $('#superVcusReqSubmitBtn').addClass('disabled');
            if (response.code == "200") {
                const result = response.data;
                if(result.id != null){
                    alert('정상 등록되었습니다.\n고객님의 소중한 의견에 감사드립니다.')
                }
                $("#cusReqClosePop").click();    
            } else{
                if(response.data.message != null){
                    alert(response.data.message);
                    $("#cusReqClosePop").click();
                }else{
                    alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                    $("#cusReqClosePop").click();
                }
            }
        }
        const jwtTokcen = jwt.getAllToken();
        const userInfo = JSON.parse(jwtTokcen.getItem("vuex"));        
        const sendData = {
            parentId : userInfo.parentId,
            parentNm : userInfo.parentName,
            requestDiv : "S",
            mdnNo : $("#superVboard_inp_num").val(),
            requestCt : common.decodeHTMLEntities($("#superVboard_inp_txt").val())
        }
        let data = JSON.stringify(sendData);
        /*23.07.20*/
        com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/web/customer/hope',  data, res);
    
    } else {
        return false;
    }
    
}
