<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.matchShowModal" @close="closePopup">
      <template v-slot:body>
        <div class="math-modal match">
          <div class="modal-top">
            <h1 class="title">숫자 맞추기</h1>
            <button @click="closePopup" class="math-modal-close"></button>
          </div>
          <div class="contents">
            <div class="play-img">
              <img src="@/assets/img/launcher/play-math/playtype-info-03@3x.webp" alt="">
            </div>
            <div class="choice-level total3">
              <div class="level-btn">
                <button class="level1" @click="openViewer(181, 18007, 'SL_18007_0')"></button>
                <button class="level2" @click="openViewer(181, 18008, 'SL_18008_0')"></button>
                <button class="level3" @click="openViewer(181, 18009, 'SL_18009_0')"></button>
              </div>
              <ul class="level-info">
                <li class="age2">6세 권장</li>
                <li>7세 권장</li>
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
      matchShowModal: Boolean,
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