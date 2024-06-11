<template>
  <!-- V 스캔 : 인식 실패 -->
  <div class="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="vscan-mode fail">
            <div class="sub-gnb">
              <h1>V스캔 도서 인식</h1>
              <div class="sub-gnb-right">
                <button type="button" class="btn-close" @click="closeVscanPopup"></button>
              </div>
            </div>
            <div class="contents">
              <div class="img-wrap">
                <img src="@/assets/img/launcher-readingclub/vscan-mode/img_error.webp" alt="불편을 드려 죄송합니다. 다음에 다시 시도해 주세요.">
              </div>
              <div class="btn-wrap">
                <button type="button" class="btn-round-321 type-purple" @click="closeVscanPopup">
                  <span class="txt">확인</span>
                </button>
              </div>
              <ul class="info-wrap">
                <li class="pl-0"><strong>고객센터</strong><span>1533-1777</span></li>
                <li class="pl-0"><strong>평일</strong><span>10:00 ~ 19:00</span></li>
                <li><strong>점심시간</strong><span>12:00~13:00</span></li>
                <li class="pr-0"><strong>주말/공휴일</strong><span>휴무</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  methods: {
    closeVscanPopup() {
      this.$emit('closeVscanPopup');
    }
  }
}
</script>