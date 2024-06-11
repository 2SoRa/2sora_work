<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.childConfirmShowModal" @close="closePopup" :title="title">
      <template v-slot:body>
        <div class="child-confirm">
          <div class="confirm-contents">
            <div class="confirm-title">학습을 진행할 <span>자녀를 선택</span>하세요.</div>
            <div class="radio-wrap">
              <label class="radio" v-for="item in propsData.students" :key="item">
                <input type="radio" name="childSelect" :value="item.studentId" v-model="this.formData.studentId">
                <span class="radio-check"></span>
                <span class="label">{{ item.studentNm }}</span>
              </label>
            </div>
          </div>
          <div class="btn-wrap btn-wrap-01">
            <!-- TODO: 체크 완료시 disable 클래스 삭제 -->
            <button class="btn btn-type-03-sec gray" @click="closePopup">닫기</button>
            <button class="btn btn-type-03-sec disable sendBtn" @click="closeSendPopup">확인</button>
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
import Modal from "@/components/modal.vue";

export default {
  name: "child-confirm-popup",
  props: {
    propsData: {
      childConfirmShowModal: Boolean,
      students: Object
    },
  },
  data() {
    return {
      title: '',
      formData: {
        studentId: null
      }
    }
  },
  components: {
    Modal,
  },
  watch: {
    'formData.studentId'() {
      this.activeSendBtn();
    }
  },
  methods: {
    closePopup() {
      this.formData.studentId = null;
      this.$emit('closePopup');
    },
    closeSendPopup() {
      if (!this.formData.studentId) {
        alert("자녀를 선택해 주세요.");
        return;
      }

      this.$emit('closePopup', this.formData.studentId);
    },
    activeSendBtn() {
      if (this.formData.studentId) {
        const sendBtn = document.querySelector('.sendBtn');
        sendBtn.classList.remove('disable')
      }
    }
  },
}
</script>

<style scoped>

</style>