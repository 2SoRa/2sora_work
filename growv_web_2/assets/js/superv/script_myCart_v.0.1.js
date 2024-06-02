let cartParentId ="";

function fnGetMyCartList() {
   /* if(!fnLoginCheck()){
        alert("로그인 후 진행해주세요.");
        common.hrefFunction('/main/login');
        return;
    }*/
    let cartJwtTokcen = jwt.getAllToken();
    var userInfo = JSON.parse(cartJwtTokcen.getItem("vuex"));
    if (!common.isNull(userInfo) && !common.isNull(userInfo.parentId)) {
        cartParentId = userInfo.parentId;
    }else{
        alert("로그인 후 진행해주세요.");
        common.hrefFunction('/main/login');
        return;
    }
    const thisNowDate = new Date();
    const thisNowYYMMDD = new Date(thisNowDate.getFullYear(), thisNowDate.getMonth(), thisNowDate.getDate());
    const res = function(response) {
        if (response.code == "200") {
            var returnData = response.data;
            var pcHtml = '';
            var mobHtml = '';
            if (returnData.length > 0) {
                // 231109 nature 수정 : d-none add, remove 추가
                $('.no_data').addClass('d-none');
                $('.cart-items-list').removeClass('d-none');
                
                $.each(returnData, function (index, item) {
                    var thisClass = '';
                    var classNm = '';
                   /* if (item.prodMngCd == 2) {
                        classNm = 'superClass';
                        thisClass = '슈퍼클래스';
                    } else if (item.prodMngCd == 3) {
                        classNm = 'superCoachingClass';
                        thisClass = '슈퍼코칭클래스';
                    } else if (item.prodMngCd == 4) {
                        classNm = 'prime';
                        thisClass = '프라임';
                    }*/
                    var thisSoldCheck = '';
                    var thisId = item.orderCartUid;
                    var thisProdId = item.prodId;
                    var thisProdNm = item.prodNm;

                    var thisSaleEndDt = item.thisSaleEndDt;
                    var thisMonthPay = item.monthpayPrice;

                    /*판매종료 확인*/
                    var thisSaleCheck = true;
                    const thisSaleEndDtDate = new Date(item.saleEndDt);
                    const thisSaleEndYYMMDD= new Date(thisSaleEndDtDate.getFullYear(), thisSaleEndDtDate.getMonth(), thisSaleEndDtDate.getDate());
                    const thisEndDtDate = new Date(item.endDtm);
                    const thisEndYYMMDD= new Date(thisEndDtDate.getFullYear(), thisEndDtDate.getMonth(), thisEndDtDate.getDate());
                    if(thisSaleEndYYMMDD < thisNowYYMMDD || thisEndYYMMDD < thisNowYYMMDD){
                        thisSaleCheck = false
                    }
                    /*판매 1주일 확인*/
                    var thisWeekCheck = false;
                    if(Math.abs((thisSaleEndYYMMDD.getTime() - thisNowYYMMDD.getTime())/ (1000 * 60 * 60 * 24)) <= 7 || Math.abs((thisEndYYMMDD.getTime() - thisNowYYMMDD.getTime())/ (1000 * 60 * 60 * 24)) <= 7){
                        thisWeekCheck = true;
                    }
                    if(item.payDiv == "T"){
                        thisSaleCheck = true;
                        thisWeekCheck = false;
                    }
                    var thisEndDt = item.endDtm;
                    if(thisSaleEndDtDate < thisEndDtDate){
                        thisEndDt = item.saleEndDt;
                    }
                    <!-- TODO: li에 sold-out 추가시 글자 스타일 및 변경됨 -->
                    if(thisSaleCheck){
                        pcHtml += '<li class="list-item">';
                    }else{
                        pcHtml += '<li class="sold-out">';
                    }
                    pcHtml += '<label class="radio">';
                    pcHtml += '<input type="radio" name="pcRadio" onclick="fnClickCheckBox(\''+index+'\');" value="'+thisId+'">';
                    // pcHtml += '<span class="checkmark"></span>';
                    // pcHtml += '<span class="check-img '+classNm+'">';
                    // pcHtml += '<img src="../images/icon/icon_class@2x.webp" alt="' + classNm + '">';
                    // pcHtml += '<span class="">' + thisClass + '</span>';
                    if(!thisSaleCheck){
                        pcHtml += '<span class="sold-out">품절</span>';
                    }
                    pcHtml += '</span>';
                    pcHtml += '</label>';
                    pcHtml += '<div class="cart-item">';
                    pcHtml += '<div class="cart-title">';
                    if(item.payDiv == "T"){
                        if(item.revokeTypeCd == "1") {
                            pcHtml += '<span class="contract wide">해지반환금</span>';
                        }else{
                            pcHtml += '<span class="contract wide">추가납입금</span>';
                        }

                    }else if(item.payDiv == "C"){
                        pcHtml += '<span class="contract wide">취소청구금</span>';
                    }else{
                        pcHtml += '<span class="contract">약정</span>';
                    }
                    pcHtml += '<div>';
                    pcHtml += '<p>' + thisProdNm + '</p>';
                    if(item.payDiv != "T" && item.payDiv != "C") {
                        pcHtml += '<button class="btn-remove" onclick="fnDeleteThisCart(\'' + thisId + '\',\'' + cartParentId + '\');">삭제</button>';
                    }
                    pcHtml += '</div>';
                    pcHtml += '</div>';
                    pcHtml += '<ul>';
                    /*7일 이내 상품만 노출*/
                    if(thisWeekCheck){
                        pcHtml += '<li class="cart-duration">';
                        pcHtml += '<p class="sub-title">결제가능일</p>';
                        pcHtml += '<p class="date">' + thisEndDt + '<span>까지</span></p>';
                        pcHtml += '</li>';
                    }
                    pcHtml += '<li class="cart-cost">';
                    pcHtml += '<p class="sub-title">상품금액</p>';
                    if(String(item.payTypeCd) == '1'){
                        pcHtml += '<p class="cost"><span>월 </span><span class="price">' +  common.comma(item.monthpayPrice) + '</span><span>원</span></p>';
                    }else if(item.payDiv == "T" || item.payDiv == "C"){
                        pcHtml += '<p class="cost">' +  common.comma(item.orderAmt) + '<span>원</span></p>';
                    }else{
                        pcHtml += '<p class="cost"><span>일시납 </span><span class="price">' +  common.comma(item.lumppayPrice) + '</span><span>원</span></p>';
                    }
                    pcHtml += '</li>';
                    pcHtml += '</ul>';
                    pcHtml += '</div>';
                    pcHtml += '<input type="hidden" name="prodId" value="'+thisProdId+'"/>';
                    pcHtml += '</li>';
/*
                    <!-- TODO: li에 sold-out 추가시 글자 스타일 및 변경됨 -->
                    /!* superClass superCoachingClass prime *!/
                    if(thisSaleCheck){
                        mobHtml += '<li>';
                    }else{
                        mobHtml += '<li class="sold-out">';
                    }
                    mobHtml += '<label class="radio">';
                    mobHtml += '<input type="radio" name="mbRadio" onclick="fnClickCheckBox(\''+index+'\');" value="'+thisId+'">';
                    // mobHtml += '<span class="checkmark"></span>';
                    mobHtml += '<span class="cart-title">';
                    if(item.payDiv == "T"){
                        if(item.revokeTypeCd == "1"){
                            mobHtml += '<span class="contract wide">해지반환금</span>';
                        }else{
                            mobHtml += '<span class="contract wide">추가납입금</span>';
                        }
                    }else{
                        mobHtml += '<span class="contract">약정</span>';
                    }
                    mobHtml += '<span>' + thisProdNm + '</span>';
                    if(item.payDiv != "T") {
                        mobHtml += '<button onclick="fnDeleteThisCart(\'' + thisId + '\',\'' + parentId + '\');"><img src="../images/icon/icon_pop_close_18@2x.webp" alt="delete"></button>';
                    }
                    mobHtml += '</span>';
                    mobHtml += '<span class="flex-row cart-item">';
                    mobHtml += '<span class="check-img">';
                    mobHtml += '<img src="../images/icon/icon_class@2x.webp" alt="' + classNm + '">';
                    mobHtml += '<span class="">' + thisClass + '</span>';
                    if(!thisSaleCheck){
                        mobHtml += '<span class="sold-out">품절</span>';
                    }
                    mobHtml += '</span>';
                    mobHtml += '<span class="flex-column cart-info">';
                    if(thisWeekCheck) {
                        mobHtml += '<span class="cart-date">';
                        mobHtml += '<span class="sub-title">결제가능일</span>';
                        mobHtml += '<span class="date">' + thisEndDt + '<span> 까지</span></span>';
                        mobHtml += '</span>';
                    }
                    mobHtml += '<span class="cart-cost">';
                    mobHtml += '<span class="sub-title">상품금액</span>';
                    if(String(item.payTypeCd) == '1'){
                        mobHtml += '<span class="cost"><span>월 </span>' +  common.comma(item.monthpayPrice) + '<span>원</span></span>';
                    }else if(item.payDiv == "T"){
                        mobHtml += '<span class="cost">' +  common.comma(item.orderAmt) + '<span>원</span></span>';
                    }else{
                        mobHtml += '<span class="cost"><span>일시납 </span>' +  common.comma(item.lumppayPrice) + '<span>원</span></span>';
                    }
                    mobHtml += '</span>';
                    mobHtml += '</span>';
                    mobHtml += '</span>';
                    mobHtml += '</label>';
                    mobHtml += '<input type="hidden" name="prodId" value="'+thisProdId+'"/>';
                    mobHtml += '</li>';*/
                });
                $('[name="cartPc"]').html(pcHtml);
            }else{
                // 231109 nature 수정 : d-none add, remove 추가
                $('.no_data').removeClass('d-none');
                $('.cart-items-list').addClass('d-none');
                
                // 231109 nature 수정 : 아래 내용 주석처리
                // pcHtml = '<div class="no_data">\n' +
                //     '              <img src="../../assets/img/common/icon_nodata.png" alt="">\n' +
                //     '              <p class="fs_14 fc_75 line_h1_4">장바구니가 비어있습니다.</p>\n' +
                //     '            </div>';
                // $('[name="cartPc"]').after(pcHtml);
                
                /*mobHtml = '        <li class="list-none">\n' +
                    '          <div><img src="../images/icon/m_icon_cart@2x.webp" alt="no-item"><span>장바구니가 비어있습니다.</span></div>\n' +
                    '        </li>';*/
            }
        /*    $('[name="cartMb"]').html(mobHtml);*/

        } else{
            if(response.data.message != null){
                alert(response.data.message);
            }else{
                alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            }
            return false;
        }
    }
    /*23.07.20*/
    com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/mypage/order/cart',  String(cartParentId), res);
}

function fnDeleteThisCart(thisId, thisParentId){
    const res = function(response) {
        if (response.code == "200") {
        } else{
            if(response.data.message != null){
                alert(response.data.message);
                window.location.reload();
            }else{
                alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
            }
            return false;
        }
    }

    let data = {
        "id" :thisId,
        "parentId" : thisParentId,
    };
    data = JSON.stringify(data);
    /*23.07.20*/
    com_ajax.ajax('delete', '/clientsvc/hpg/v1/svh/mypage/cart/Info',  data, res);

}

function fnClickCheckBox(thisIdx){
    $("[name='pcRadio']").eq(thisIdx).prop("checked", true);
    $("[name='mbRadio']").eq(thisIdx).prop("checked", true);
    $("[name='paymentCartBtn']").removeClass('disabled');

}

function fnGetPaymentCart(){
    var orderCartUid = $('input[name=pcRadio]:checked').val();
    if(common.isNull(orderCartUid)){
        $("[name='paymentCartBtn']").addClass('disabled');
        alert("상품을 선택해 주세요.");
        return false;
    }
    var jwtTokcen = jwt.getAllToken();
    var userInfo = JSON.parse(jwtTokcen.getItem("vuex"));
    if(!common.isNull(userInfo) && !common.isNull(userInfo.parentId)){
        cartParentId = userInfo.parentId;
        /*상품 구매가능 상태 확인*/
        const buyCheck = function(response1) {
            if(response1.code == "200"){
                if(response1.data.status){
                    var payDiv = response1.data.payDiv;
                    /*무료체험, 진행중 상태 확인*/
                    const res = function(response) {
                        if(response.code == "200"){
                            if(!common.isNull(response.data.stateCd)){
                                var thisStateCd = parseInt(response.data.stateCd);
                                var prodId = $('input[name=pcRadio]:checked').parents('li').find('[name="prodId"]').val();
                                var orderCartUid = $('input[name=pcRadio]:checked').val();
                                /*2023.03.29 해지환급금 분기 추가-유희목*/
                                if(payDiv == "T" || payDiv == "C"){
                                    common.hrefFunction('/pages/payment/payment.html?prodId='+prodId+'&orderCartUid='+orderCartUid+'&payDiv='+payDiv);
                                }else if(thisStateCd == 2){
                                    alert("이미 유료 학습을 진행중이십니다.\n도움이 필요하신 경우 고객센터로 연락 부탁드립니다.");
                                    return false;
                                }
                                common.hrefFunction('/pages/payment/payment.html?prodId='+prodId+'&orderCartUid='+orderCartUid+'&payDiv='+payDiv);
                            }else{
                                alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                            }
                        }else{
                            alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                            return false;
                        }
                    }
                    let data = {"parentId" : cartParentId};
                    data = JSON.stringify(data);
                    /*23.07.20*/
                    com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/mypage/payment/check',  data, res);
                }else{
                    alert("해당 상품의\n판매기간이 종료되었습니다.");
                    window.location.reload();
                }
            }else{
                alert("시스템 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                return false;
            }
        }

        let buyData = {
            "parentId" : cartParentId,
            "orderCartUid" : orderCartUid
        };
        buyData = JSON.stringify(buyData);
        /*23.07.20*/
        com_ajax.ajax('post', '/clientsvc/hpg/v1/svh/mypage/cart/check',  buyData, buyCheck);


    }else{
        if(confirm("로그인이 필요한 서비스입니다.\n지금 로그인 하시겠습니까?")){
            common.hrefFunction('/main/login');
        }
        return false;
    }


}