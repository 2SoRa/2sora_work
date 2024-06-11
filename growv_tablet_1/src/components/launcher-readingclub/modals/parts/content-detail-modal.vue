<template>
  <div class="whole-modal modal-detail-view">
    <div class="whole-modal-dim"></div>
    <div class="whole-modal-content">
       video
      <div class="inner-wrap video" v-show="this.propsData.detailViewInfo.modalData.video">
        <div class="video-wrap">
          <video  :src="this.detailViewInfo.modalData.video" controls :poster="this.detailViewInfo.modalData.image" style="width:1500px;height:900px" controlsList="nofullscreen nodownload" oncontextmenu="return false;" autoplay></video>
<!--          <img :src="propsData.detailViewInfo.modalUrl" alt="비디오썸네일" class="img-obj-fit-cover">-->
        </div>
<!--        <button type="button" class="btn-video-play"></button>-->
      </div>
      <!--TODO:text더보기 클래스 확인-->
      <div class="inner-wrap text" v-show="this.propsData.detailViewInfo.modalData.text">
        {{propsData.detailViewInfo.modalData.text}}
      </div>
      <button type="button" class="close" @click="closePopup"></button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return{
      detailViewInfo : this.propsData.detailViewInfo,
    }
  },
  props : {
    propsData : {
      detailViewInfo : Object
    }
  },
  mounted() {
    console.log(this.detailViewInfo);
  },
  methods : {
    closePopup() {
      this.$emit('closePopup');
    },
  }
}
</script>