let childAddCheck = 0;
const stuAddCalToday = new Date();
var stuAddStartDate = new Date(stuAddCalToday.getFullYear()-5, stuAddCalToday.getMonth(), stuAddCalToday.getDate());
var stuAddEndDate = new Date(stuAddCalToday.getFullYear(), stuAddCalToday.getMonth() - 20, stuAddCalToday.getDate());
let stuMinYear = stuAddStartDate.getFullYear();
let stuMaxYear = stuAddEndDate.getFullYear();
let stuMinMonth = 1;
let stuMaxMonth = 12;
let stuMinDay = 1;
let stuMaxDay = 31;
let stuAddParentId;


function fnOpenAddChildPop(){
    if(stuCnt < 3){
        //dimLayerShow({ target: '#child_pop' });
        $("#child_pop").addClass('active');
        fnSetCalendarForNew(stuMinYear, stuMaxYear, stuMinMonth, stuMaxMonth, stuMinDay, stuMaxDay);
        document.querySelector('body').style.overflow = 'hidden';
    }else{
        alert("자녀는 3명까지 추가 가능합니다.");
    }
}

function fnSetCalendarForNew(thisMinYear, thisMaxYear, thisMinMonth, thisMaxMonth, thisMinDay, thisMaxDay){
    let yearSel = $('[name="yearSelN"]').val();
    let monthSel = $('[name="monthSelN"]').val();
    let daySel = $('[name="daySelN"]').val();


    let fullHtml = "";
    let yearHtml = '<select name="yearSelN" class="form_select ready" required>';
    yearHtml += '<option value="">년</option>';
    for(let y = thisMinYear; y<=thisMaxYear; y++){
        yearHtml += '<option value="'+y+'"';
        if(yearSel == y){
            yearHtml += 'selected';
        }
        yearHtml +='>'+y+'년</option>';
    }
    yearHtml += '</select>';

    let monthHtml = '<select name="monthSelN" class="form_select ready';
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

    let dayHtml = '<select name="daySelN" class="form_select ready" required>';
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
    $('[name="calHtmlPartN"]').html(fullHtml);
}

$(document).on('change', '[name="yearSelN"], [name="monthSelN"], [name="daySelN"]', function (){
    let yearSel = $('[name="yearSelN"]').val();

    if(yearSel == stuMinYear){
        var thisMinMM = stuAddStartDate.getMonth();
        fnSetCalendarForNew(stuMinYear, stuMaxYear, 1, 12, stuMinDay, stuMaxDay);
    }else if(yearSel == stuMaxYear){
        var thisMaxMM = stuAddEndDate.getMonth();
        if($('[name="monthSel"]').val() == String(thisMaxMM+1)){
            fnSetCalendarForNew(stuMinYear, stuMaxYear, 1, thisMaxMM+1, stuMinDay, stuAddEndDate.getDate());
        }else{
            fnSetCalendarForNew(stuMinYear, stuMaxYear, 1, thisMaxMM+1, stuMinDay, stuMaxDay);
        }
    }else {
        fnSetCalendarForNew(stuMinYear, stuMaxYear, stuMinMonth, stuMaxMonth, stuMinDay, stuMaxDay);
    }
    let monthSel = $('[name="monthSelN"]').val();
    let daySel = $('[name="daySelN"]').val();
    if(yearSel != null && yearSel != ""  && yearSel != "0" && monthSel != null && monthSel != "" && monthSel != "0" && daySel != null && daySel != "" && daySel != "0"){
        fncalcAgeForNew(yearSel+'-'+monthSel+'-'+daySel);
    }else{
        $("[name='calAgeInputN']").val('');
    }
    fnCheckAddStuInfo();
});

$(document).on('keyup keydown change click', '#stuNamePop', function (){
    var returnVal = common.nameCheck($(this).val());
    $(this).val(returnVal);
    $("[name='addStuNameCheck']").hide();
    fnCheckAddStuInfo();
});

function fncalcAgeForNew(birthDate) {
    let birthDateCheck = new Date(birthDate);
    let btMonth;
    let btYear = stuAddCalToday.getFullYear() - birthDateCheck.getFullYear();
    if(btYear >=1){
        btMonth = (stuAddCalToday.getMonth() - birthDateCheck.getMonth()+1) + (btYear*12);
    }else{
        btMonth = stuAddCalToday.getMonth() - birthDateCheck.getMonth();
    }

    if(btMonth > 23){
        let age = '';
        const birthYear = String(birthDate).substring(0,4);
        const todayYear = new Date().getFullYear();

        age = todayYear - birthYear + 1;
        age += "세";
        $("[name='calAgeInputN']").val(age);
    }else{

        $("[name='calAgeInputN']").val(Math.ceil(btMonth)+"개월");
    }
}

function fnAddStuInfo(){
    if(childAddCheck > 0 ){
        return false;
    }

    if(!$('[name="addStuBtn"]').hasClass('disabled')){
        childAddCheck++;
        let stuName = $("#stuNamePop").val();

        /*2023.07.10*/
        if(common.nameCheck(stuName) != stuName){
            $("[name='addStuNameCheck']").show();
            return false;
        }
        $("[name='addStuNameCheck']").hide();
        let yearSel = $('[name="yearSelN"]').val();
        let monthSel = $('[name="monthSelN"]').val();
        let daySel = $('[name="daySelN"]').val();

        var jwtTokcen = jwt.getAllToken();
        if (!common.isNull(jwtTokcen.getItem("vuex"))) {
            var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
            if (!common.isNull(userInfo) && !common.isNull(userInfo.parentId) && common.isNull(stuAddParentId)) {
                stuAddParentId = userInfo.parentId;
            }
        }else{
            jwt.destroyAll();
            $("[name='loginUserName']").html();
            $("[name='loginPart']").hide();
            $("[name='loginOutPart']").show();
            alert("로그인 후 진행해주세요.");
            common.hrefFunction('/main/login');
        }
        const res = function (response) {
            if(response.data.code == '200'){
                if (response.data.message != null) {
                    alert(response.data.message);
                } else {
                    alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                }
                childClosePop();
            }else{
                if (response.data.message != null) {
                    alert(response.data.message);
                } else {
                    alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                    childClosePop();
                }
            }
            fnReLoadChildInfo();
            childAddCheck = 0;
        }
        if (parseInt(monthSel) < 10) {
            monthSel = "0" + monthSel;
        }
        if (parseInt(daySel) < 10) {
            daySel = "0" + daySel;
        }
        let data = {
            "parentId" : stuAddParentId,
            "studentNm" : stuName,
            "birthdate" : yearSel+"-"+monthSel+"-"+ daySel
        };
        data = JSON.stringify(data);
        /*23.07.20*/
        com_ajax.ajax('put', '/clientsvc/hpg/v1/svh/mypage/newStudent', data, res);
    }
}
function fnCheckAddStuInfo(){
    let stuName = $("#stuNamePop").val();
    let yearSel = $('[name="yearSelN"]').val();
    let monthSel = $('[name="monthSelN"]').val();
    let daySel = $('[name="daySelN"]').val();
    if(!common.isNull(stuName) && yearSel != "0" && monthSel != "0" && daySel != "0" && !common.isNull(yearSel) && !common.isNull(monthSel) && !common.isNull(daySel)){
        $('[name="addStuBtn"]').removeClass('disabled');
    }else{
        $('[name="addStuBtn"]').addClass('disabled');
    }
}
function childClosePop() {
    childAddCheck = 0;
    $('#child_pop').removeClass('active');
    $('[name="yearSelN"]').val("0");
    $('[name="monthSelN"]').val("0");
    $('[name="daySelN"]').val("0");
    $('#child_pop').find('input').val("");
    $('[name="addStuBtn"]').addClass('disabled');
    document.querySelector('body').style.overflow = 'auto';
    var $this = $('#child_pop'),
        $t_p = $this.parents(".dimlayer_z");
    dimLayerHide($t_p);

}
function childModifyClosePop() {
    $("input:radio[name='thisStudentGender']:radio").prop('checked', false);
    $('#add_child').removeClass('active');
    $('[name="yearSelN"]').val("0");
    $('[name="monthSelN"]').val("0");
    $('[name="daySelN"]').val("0");
    document.querySelector('body').style.overflow = 'auto';
    var $this = $('#add_child'),
        $t_p = $this.parents(".dimlayer_z");
    dimLayerHide($t_p);
}

