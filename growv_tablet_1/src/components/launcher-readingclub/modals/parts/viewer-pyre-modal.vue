<template>
  <!-- 뷰어 브릿지 : 다시 읽기 -->
  <div class="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="viewer-bridge read">
            <div class="sub-gnb pos-absolute">
              <div class="sub-gnb-right">
                <button type="button" class="btn-close" @click="closeViewerPopup"></button>
              </div>
            </div>
            <div class="contents thumb-info-lr">
              <div class="side-area left img-shadow">
                <img :src="viewerInfo.modalData.item.thumbUrl" :alt="viewerInfo.modalData.item.bookNm" @error="replaceDefault">
              </div>
              <div class="side-area right">
                독서퀴즈 다시시작?
                <div class="btn-wrap">
                  <button type="button" class="btn-glossy-box stop" @click="closeViewerPopup"><img src="@/assets/img/launcher-readingclub/viewer-bridge/btn_stop.webp"></button>
                  <button type="button" class="btn-glossy-box yes" @click="openBook"><img src="@/assets/img/launcher-readingclub/viewer-bridge/btn_like.webp"></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
  methods : {
    openBook() {
      this.mixin_openBookRun('py');
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

