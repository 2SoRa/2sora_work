<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.comparisonShowModal" @close="closePopup">
      <template v-slot:body>
        <div class="math-modal comparison">
          <div class="modal-top">
            <h1 class="title">수 비교 놀이</h1>
            <button @click="closePopup" class="math-modal-close"></button>
          </div>
          <div class="contents">
            <div class="play-img">
              <img src="@/assets/img/launcher/play-math/playtype-info-04@2x.webp" alt="">
            </div>
            <div class="choice-level total2">
              <div class="level-btn">
                <button class="level1" @click="openViewer(181, 18010, 'SL_18010_0')"></button>
                <button class="level2" @click="openViewer(181, 18011, 'SL_18011_0')"></button>
              </div>
              <ul class="level-info">
                <li>5세 권장</li>
                <li>6~7세 권장</li>
              </ul>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/modal';
import {mapGetters} from "vuex";

export default {
  props: {
    propsData: {
      comparisonShowModal: Boolean,
    },
  },
  data() {
    return {
    }
  },
  components: {
    Modal,
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  methods: {
    closePopup() {
      this.$emit('closePopup');
    },

    // 뷰어 띄우기
    openViewer(courseId, lectureId, paymentKey) {
      const token = localStorage.getItem("accessToken");
      const url = window.location.href;
      let baseUrl = '';

      if (url.indexOf("https://stw.superv.com/") > -1) {
        baseUrl = 'https://study.superv.com'
      } else {
        baseUrl = 'https://dev-study.superv.com'
      }

      location.href = `intent:#Intent;package=com.mackerly.growv.viewer;i.lectureKey=${lectureId};i.studentId=${this.userInfo.info.studentId};S.baseUrl=${baseUrl};S.launchMode=default;S.authToken=${token};i.courseKey=${courseId};S.paymentKey=${paymentKey};end`;
    },
  },
}
</script>

<style>
</style>