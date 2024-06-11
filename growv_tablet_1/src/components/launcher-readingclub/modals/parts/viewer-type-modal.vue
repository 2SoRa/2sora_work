<template>
  <!-- 뷰어 브릿지 : 모션북 / 이북 고르기 -->
  <div class="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="viewer-bridge kind">
            <div class="sub-gnb pos-absolute">
              <div class="sub-gnb-right">
                <button type="button" class="btn-close" @click="closeViewerPopup"></button>
              </div>
            </div>
            <div class="contents thumb-info-lr">
              <div class="side-area left img-shadow">
                <img :src="viewerInfo.modalData.item.thumbUrl" :alt="viewerInfo.modalData.item.bookNm" @error="replaceDefault" >
              </div>
              <div class="side-area right">
                <h3 class="view-title"><img src="@/assets/img/launcher-readingclub/viewer-bridge/img_txt_read_kind.webp" alt="책을 어떻게 읽고 싶어?"></h3>
                <div class="btn-wrap">
                  <!-- TODO : 버튼 클릭시 active 추가 -->
                  <button type="button" :class="['btn-book-kind','mbook',{active : currentType === 'motionBook'}]" @click="toggleType('motionBook')">
                    <img src="@/assets/img/launcher-readingclub/viewer-bridge/btn_mbook_char.webp">
                  </button>
                  <button type="button" :class="['btn-book-kind','ebook',{active : currentType === 'eBook'}]" @click="toggleType('eBook')">
                    <img src="@/assets/img/launcher-readingclub/viewer-bridge/btn_ebook_char.webp">
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <audio ref="audioType" style="position:absolute;opacity:0;z-index:-9999">
      <source src="https://cdnfiles.superv.com/narration/Viewer_Na_001.mp3" type="audio/mp3">
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
    this.$refs.audioType.play();
  },
  methods : {
    toggleType(type) {
      this.$refs.audioType.pause();
      this.currentType = type;
      this.$emit('openBookRun',type);
      setTimeout(() => {
        this.closeViewerPopup();
      },1500);
    },
    openViewerPopup(info,item,type) {
      this.$emit('openViewerPopup',info,item,type);
    },
    closeViewerPopup() {
      this.$emit('closeViewerPopup',true);
    },
    replaceDefault(e) {
      e.target.src = require('@/assets/img/launcher-readingclub/common/thumbnail_default.png')
    }
  }
}
</script>

