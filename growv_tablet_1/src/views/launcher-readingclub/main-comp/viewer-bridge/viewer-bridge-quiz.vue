<template>
  <!-- 뷰어 브릿지 : 독서 퀴즈를 시작해 볼까? -->
  <div class="viewer-bridge quiz">
    <div class="sub-gnb pos-absolute">
      <div class="sub-gnb-right">
        <button type="button" class="btn-close"><router-link :to="{ name: 'ReadingClubMainView' }"></router-link></button>
      </div>
    </div>
    <div class="contents thumb-info-lr">
      <div class="side-area left img-shadow">
        <img src="@/assets/img/launcher-readingclub/dummy/viewer_thumb_1.webp">
      </div>
      <div class="side-area right">
        <h3 class="view-title has-bg"><img src="@/assets/img/launcher-readingclub/viewer-bridge/img_txt_quiz.webp" alt="독서 퀴즈를 시작해 볼까?"></h3>
        <div class="btn-wrap">
          <button type="button" class="btn-glossy-box stop"><img src="@/assets/img/launcher-readingclub/viewer-bridge/btn_stop.webp"></button>
          <button type="button" class="btn-glossy-box yes"><img src="@/assets/img/launcher-readingclub/viewer-bridge/btn_like.webp"></button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
</script>