
let reP;
let reTY;
let rePI;
let reS;
let reSNm
$(document).ready(function () {
    fnLoginCheck();
    /*230919 임시*/
    reP = sessionStorage.getItem("reP");
    rePI = sessionStorage.getItem("rePI");
    reTY = sessionStorage.getItem("reTY");
    reS = sessionStorage.getItem("reS");
    reSNm = sessionStorage.getItem("reSNm");
    if(common.isNull(reP) || common.isNull(reS)){
        common.hrefFunction("/");
    }else{
        if(reTY == "true" || reTY == true || reTY == "Y"){
            $("#parentIdTitle").html("아이디");
            if(rePI.indexOf("@") > -1){
                let prePI = rePI.substring(0,rePI.indexOf("@"));
                if(prePI.length >= 6){
                    let thisSuffix = "";
                    for(let i=3;i<prePI.length;i++){
                        thisSuffix += "*";
                    }
                    prePI = prePI.substring(0,3) +thisSuffix;
                }else{
                    prePI = prePI.substring(0,3) +"***";
                }
                prePI += rePI.substring(rePI.indexOf("@"), rePI.length);
                $("#parentId").html(prePI);
            }else{
                $("#parentId").html(rePI);
            }
            $("#parentTempTitle").html("자녀명");
            $("#parentTemp").html(reSNm);
        }else{
            $("#parentIdTitle").html("임시 아이디");
            $("#parentId").html(rePI);
            $("#parentTempTitle").html("임시비밀번호");
            $("#parentTemp").html(rePI.substring(rePI.length - 4, rePI.length));
        }
        sessionStorage.removeItem("reP");
        sessionStorage.removeItem("reTY");
        sessionStorage.removeItem("rePI");
        sessionStorage.removeItem("reS");
        sessionStorage.removeItem("reSNm");
    }
});


$(document).on("click", "#submitStepBtn", function (){
    if(!common.isNull(reP) && !common.isNull(reS)) {
        const res = function (response) {
            if (response.code == "200") {
                if(response.data.code == "200"){
                    common.hrefFunction("/")
                }else{
                    common.hrefFunction("/")
                }
            } else {
                common.hrefFunction("/")
            }
        }
        let data = {
            "parentId": reP,
            "studentId": reS,
            "engStep": $("[name='englishStep']:checked").val(),
        };
        /*23.07.20*/
        com_ajax.ajax('post', '/clientsvc/hpg/v1/svr/exp/member/step/info', JSON.stringify(data), res);
    }else{
        common.hrefFunction("/")
    }
});

function fnCheckEngStep(){
    if(common.isNull($("[name='englishStep']:checked").val())){
        $("#submitStepBtn").attr("disabled", true);
    }else{
        $("#submitStepBtn").attr("disabled", false);
    }
};
