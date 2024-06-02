$(document).ready(function () {
    fnLoginCheck();
});

function fnProBuy(devProdId, prodId){
   /* if(!fnLoginCheck()){
        alert("로그인 후 진행해주세요.");
        common.hrefFunction('/main/login');
        return;
    }*/
    if(prodId == 100){
        if(confirm("로그인이 필요한 서비스입니다.\n지금 로그인 하시겠습니까?")){
            common.hrefFunction('/main/login');
            return false;
        }
        return false;
    }
    else{
        var jwtTokcen = jwt.getAllToken();
        var proParentId = null;
        var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
        if(!common.isNull(userInfo) && !common.isNull(userInfo.parentId)){
            proParentId = userInfo.parentId;
            //common.hrefFunction("/payment/payment.html?prodId="+prodId)
            /*무료체험, 진행중 상태 확인*/
            const res = function(response) {
                if(response.code == "200"){
                    if(!common.isNull(response.data.stateCd)){
                        var thisStateCd = parseInt(response.data.stateCd);
                        if(thisStateCd == 2){
                            alert("자녀 모두 유료 학습중입니다.\n" +
                                "도움이 필요하신 경우 고객센터로 연락 부탁드립니다.");
                            return false;
                        }
                        /*if(thisStateCd == 1){
                            alert("무료체험을 진행중인 자녀입니다.\n\n해당 자녀로 결제하실 경우\n무료체험은 종료됩니다.");
                        }*/
                        var prodUrlCheck = new URL(location.href).host;
                        if(prodUrlCheck.indexOf('dev') != -1 || prodUrlCheck.indexOf('local') != -1) {
                            common.hrefFunction("/pages/payment/payment.html?prodId=" + devProdId)
                        }else{
                            common.hrefFunction("/pages/payment/payment.html?prodId=" + prodId)
                        }
                    }else{
                        alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                    }
                }else{
                    alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                    return false;
                }
            }
            let data = {"parentId" : proParentId};
            data = JSON.stringify(data);
            /*23.07.20*/
            com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/mypage/payment/check',  data, res);
        }else{
            if(confirm("로그인이 필요한 서비스입니다.\n지금 로그인 하시겠습니까?")){
                common.hrefFunction('/main/login');
            }
            return false;
        }
    }
}
