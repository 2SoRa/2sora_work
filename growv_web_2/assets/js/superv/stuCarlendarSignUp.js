const stuCalToday = new Date();
let studentStartDate = new Date(stuCalToday.getFullYear()-6, stuCalToday.getMonth(), stuCalToday.getDate());
let studentEndDate = new Date(stuCalToday.getFullYear(), stuCalToday.getMonth() - 20, stuCalToday.getDate());
let minYear = studentStartDate.getFullYear();
let maxYear = studentEndDate.getFullYear();
let minMonth = 1;
let maxMonth = 12;
let minDay = 1;
let maxDay = 31;

$(document).ready(function () {
    fnSetCalendar(minYear, maxYear, minMonth, maxMonth, minDay, maxDay);
});

function fnSetCalendar(thisMinYear, thisMaxYear, thisMinMonth, thisMaxMonth, thisMinDay, thisMaxDay){
    let yearSel = $('[name="yearSel"]').val();
    let monthSel = $('[name="monthSel"]').val();
    let daySel = $('[name="daySel"]').val();

    let fullHtml = "";
    let yearHtml = '<select name="yearSel" class="select" required onchange="changeCalendar();">';
    yearHtml += '<option value="">년</option>';
    for(let y = thisMinYear; y<=thisMaxYear; y++){
        yearHtml += '<option value="'+y+'"';
        if(yearSel == y){
            yearHtml += 'selected';
        }
        yearHtml +='>'+y+'년</option>';
    }
    yearHtml += '</select>';

    let monthHtml = '<select name="monthSel" class="select" required onchange="changeCalendar();"';
    if(yearSel == null || yearSel == undefined || yearSel == ""){
        monthHtml += 'disabled'
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

    let dayHtml = '<select name="daySel" class="select" required onchange="changeCalendar();">';
    dayHtml += '<option value="">일</option>';
    for(let d = thisMinDay; d<=thisMaxDay; d++){
        dayHtml += '<option value="'+d+'"';
        if(daySel == d){
            dayHtml += 'selected';
        }
        dayHtml += '>'+d+'일</option>';
    }
    dayHtml += '</select>';
    fullHtml = yearHtml+monthHtml+dayHtml +"<input type='text' class='select' name='calAgeInput' value='나이' disabled>";
    $("#childAgeSel").html(fullHtml);
    $("[name='calHtmlPart']").html(fullHtml);
}

function changeCalendar(){
    fnCertSnBtnCheck();
    fnAllFormCheck();/*필요할 경우 각 js에 생성*/
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
        if (parseInt(monthSel) < 10) {
            monthSel = "0" + monthSel;
        }
        if (parseInt(daySel) < 10) {
            daySel = "0" + daySel;
        }
        fncalcAge(yearSel+'-'+monthSel+'-'+daySel);
    }else{
        $("[name='calAgeInput']").val('나이');
    }
};

function fncalcAge(birthDate) {
    let birthDateCheck = new Date(birthDate);
    let btMonth;
    let btYear = stuCalToday.getFullYear() - birthDateCheck.getFullYear();
    if(btYear >=1){
        btMonth = (stuCalToday.getMonth() - birthDateCheck.getMonth()+1) + (btYear*12);
    }else{
        btMonth = stuCalToday.getMonth() - birthDateCheck.getMonth();
    }

    if(btMonth > 23){
        let age = '';
        const birthYear = String(birthDate).substring(0,4);
        const todayYear = new Date().getFullYear();

        age = todayYear - birthYear + 1;
        age += "세";
        $("[name='calAgeInput']").val(age);
    }else{

        $("[name='calAgeInput']").val(Math.ceil(btMonth)+"개월");
    }

}