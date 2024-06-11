<template>
  <!-- 뷰어 브릿지 : 독서 성장 리포트 -->
  <div class="viewer-bridge report">
    <div class="sub-gnb pos-absolute">
      <div class="sub-gnb-right">
        <button type="button" class="btn-close"><router-link :to="{ name: 'ReadingClubMainView' }"></router-link></button>
      </div>
    </div>
    <div class="contents thumb-info-lr">
      <div class="side-area left">
        <img src="@/assets/img/launcher-readingclub/dummy/temp2.webp">
      </div>
      <div class="side-area right">
        <h3 class="view-title"><img src="@/assets/img/launcher-readingclub/viewer-bridge/img_txt_report.webp" alt="독서 성장 리포트"></h3>
        <!-- TODO : 영역 별 클래스 추가
          주영역(그래프 100%) : .high
          부영역(그래프 70%) : .mid
        -->
        <!-- TODO : 페이지 진입 후 데이터 넣어줄 때 클래스도 같이 추가 onShow(그래프 애니메이션) -->
        <ul class="graph-wrap onShow">
          <li class="graph-item language high"><div class="mask-graph"></div><span class="char"></span><span class="graph-item-category"><!--언어 발달--></span></li>
          <li class="graph-item emotion mid"><div class="mask-graph"></div><span class="char"></span><span class="graph-item-category"><!--정서 발달--></span></li>
          <li class="graph-item sociality"><div class="mask-graph"></div><span class="char"></span><span class="graph-item-category"><!--사회성 발달--></span></li>
          <li class="graph-item recognition"><div class="mask-graph"></div><span class="char"></span><span class="graph-item-category"><!--인지 발달--></span></li>
          <li class="graph-item creativity"><div class="mask-graph"></div><span class="char"></span><span class="graph-item-category"><!--창의사고력--></span></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup>
</script>