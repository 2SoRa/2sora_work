<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.subtractionShowModal" @close="closePopup">
      <template v-slot:body>
        <div class="math-modal subtraction">
          <div class="modal-top">
            <h1 class="title">뺄셈 놀이</h1>
            <button @click="closePopup" class="math-modal-close"></button>
          </div>
          <div class="contents">
            <div class="play-img">
              <img src="@/assets/img/launcher/play-math/playtype-info-07@3x.webp" alt="">
            </div>
            <div class="choice-level total4">
              <div class="level-btn">
                <button class="level1" @click="openViewer(181, 18019, 'SL_18019_0')"></button>
                <button class="level2" @click="openViewer(181, 18020, 'SL_18020_0')"></button>
                <button class="level3" @click="openViewer(181, 18021, 'SL_18021_0')"></button>
                <button class="level4" @click="openViewer(181, 18022, 'SL_18022_0')"></button>
              </div>
              <ul class="level-info">
                <li>6세 권장</li>
                <li class="age2">7세 권장</li>
                <li>8세 권장</li>
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
      subtractionShowModal: Boolean,
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