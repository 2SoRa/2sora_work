<template>
  <!-- 뷰어 브릿지 : 다시 읽기 -->
  <div class="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <!-- TODO: 오늘의 책에서 진입시 today-book 클래스 추가 필요 -->
          <div class="viewer-bridge report" :class="{ 'today-book' : viewerInfo.modalData.item.isAge >= 36 && viewerInfo.modalData.item.isPy && viewerInfo.modalData.info.path === 'T' }">
            <div class="sub-gnb pos-absolute">
              <div class="sub-gnb-right">
                <button type="button" class="btn-close" @click="checkPy"></button>
              </div>
            </div>
            <div class="contents thumb-info-lr">
              <div class="side-area left">
                <img :src="viewerInfo.modalData.item.thumbUrl" :alt="viewerInfo.modalData.item.bookNm"  @error="replaceDefault">
              </div>
              <div class="side-area right">
                <h3 class="view-title"></h3>
                <!-- TODO : 영역 별 클래스 추가
                  주영역(그래프 100%) : .high
                  부영역(그래프 70%) : .mid
                -->
                <!-- TODO : 페이지 진입 후 데이터 넣어줄 때 클래스도 같이 추가 onShow(그래프 애니메이션) -->
                <ul class="graph-wrap" ref="graphWrap">
                  <li class="graph-item language" :class="{ high : viewerInfo.modalData.item.mainAreaCd === '2', mid : viewerInfo.modalData.item.subAreaCd === '2'}">
                    <div class="mask-graph"></div><span class="char"></span><span class="graph-item-category"><!--언어 발달--></span>
                  </li>
                  <li class="graph-item emotion" :class="{ high : viewerInfo.modalData.item.mainAreaCd === '4', mid : viewerInfo.modalData.item.subAreaCd === '4'}">
                    <div class="mask-graph"></div><span class="char"></span><span class="graph-item-category"><!--정서 발달--></span>
                  </li>
                  <li class="graph-item sociality" :class="{ high : viewerInfo.modalData.item.mainAreaCd === '1', mid : viewerInfo.modalData.item.subAreaCd === '1'}">
                    <div class="mask-graph"></div><span class="char"></span><span class="graph-item-category"><!--사회성 발달--></span>
                  </li>
                  <li class="graph-item recognition" :class="{ high : viewerInfo.modalData.item.mainAreaCd === '3', mid : viewerInfo.modalData.item.subAreaCd === '3'}">
                    <div class="mask-graph"></div><span class="char"></span><span class="graph-item-category"><!--인지 발달--></span>
                  </li>
                  <li class="graph-item creativity" :class="{ high : viewerInfo.modalData.item.mainAreaCd === '5', mid : viewerInfo.modalData.item.subAreaCd === '5'}">
                    <div class="mask-graph"></div><span class="char"></span><span class="graph-item-category"><!--창의사고력--></span>
                  </li>
                </ul>
              </div>
            </div>
            <!-- TODO: 기능 추가 필요 -->
            <button type="button" class="go-quiz" @click="checkPy">
              <img src="@/assets/img/launcher-readingclub/viewer-bridge/btn_quiz.webp" alt="독서 퀴즈로 가기">
            </button>
          </div>
        </div>
      </div>
    </div>
    <audio ref="audioReport" style="position:absolute;opacity:0;z-index:-9999">
      <source src="https://cdnfiles.superv.com/narration/Viewer_Na_004.mp3" type="audio/mp3">
    </audio>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentType : '',
      viewerInfo : this.propsData.viewerInfo
    }
  },
  props : {
    propsData: {
      viewerInfo : Object,
    }
  },
  mounted() {
    this.$refs.audioReport.play();
    setTimeout(() => {
      this.$refs.graphWrap.classList.add('onShow');
    },500)
    setTimeout(() => {
      this.checkPy()
    },14000);
  },
  methods : {
    checkPy() {
      if (this.viewerInfo.modalData.item.isAge >= 36 && this.viewerInfo.modalData.item.isPy && (this.viewerInfo.modalData.info.path === 'T' || this.viewerInfo.modalData.info.path === 'S')) {
        this.openViewerPopup(this.viewerInfo.modalData.info, this.viewerInfo.modalData.item, 'py');
      } else {
        this.openViewerPopup(this.viewerInfo.modalData.info, this.viewerInfo.modalData.item, 're');
      }
      this.$refs.audioReport.pause();
    },
    openViewerPopup(info,item,type) {
      this.$emit('openViewerPopup',info,item,type);
    },
    closeViewerPopup() {
      this.$emit('closeViewerPopup');
    },
    replaceDefault(e) {
      e.target.src = require('@/assets/img/launcher-readingclub/common/thumbnail_default.png')
    }
  }
}
</script>

