<template>
  <div>
    <Modal v-if="propsData.modeShowModal" @close="closePopup">
      <template v-slot:body>
        <div class="normal-mode">
          <img src="@/assets/img/launcher/mypage/mp_normalmode_top.png" alt="normalmode">
          <div class="pop-content">
            <ul class="form">
              <li>
                <div class="form-content">
                  <p class="certify-info">고객센터에서 전달받은 인증번호</p>
                  <div class="input-wrap">
                    <input type="number" class="input" placeholder="인증번호 입력" v-model="authNum" @input="enteredAuthNum($event)">
                  </div>
                </div>
              </li>
              <li class="select">
                <div class="form-content">
                  <label class="checkbox"> 일반모드 이용 동의합니다.
                    <input type="checkbox" v-model="isAgree">
                    <span class="checkmark"></span>
                  </label>
                </div>
              </li>
            </ul>

          </div>
          <div class="btn-wrap btn-wrap-01">
            <button class="btn btn-02-mp gray" @click="closePopup">취소</button>
            <button class="btn btn-02-mp" :class="{ disable : !isReg }" @click="registerNormalMode()">등록</button>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div></div>
      </template>
    </Modal>
    <confirmModal :propsData="{confirmShowModal, message}" @closePopup="closeConfirmPopup"></confirmModal>
  </div>
</template>

<script>
import Modal from '@/components/modal';
import confirmModal from './confirm-popup';
import mypageFactory from '@/api/mypage-factory';

const sideCode = mypageFactory.get('sideCode');

export default {
  props: {
    propsData: {
      modeShowModal: Boolean,
      userInfo: Object,
    },
  },
  data() {
    return {
      confirmShowModal: false,

      authNum: '',
      isAgree: false,
      isReg: false,

      message: '',
    }
  },
  components: {
    Modal,
    confirmModal,
  },
  watch: {
    'authNum'() {
      this.activeRegBtn();
    },
    'isAgree'() {
      this.activeRegBtn();
    },
  },
  methods: {
    closePopup() {
      this.resetForm();
      this.$emit('closePopup');
    },
    resetForm() {
      this.authNum = '';
      this.isAgree = false;
      this.isReg = false;
      this.message = '';
    },
    enteredAuthNum(event) {
      const numPattern = /^[0-9]+$/;

      if (!numPattern.test(event.target.value) && event.target.value.length > 0 || event.target.value.length > 4 ) {
        event.target.value = event.target.value.substring(0, event.target.value.length - 1);
      }

      this.authNum = event.target.value;
    },
    activeRegBtn() {
      if (this.authNum.length == 4 && this.isAgree) {
        this.isReg = true;
      } else {
        this.isReg = false;
      }
    },
    registerNormalMode() {
      const data = {
        memId : this.propsData.userInfo.info.studentId,
        authNum : this.authNum,
      }

      const mode = sideCode.modeNormal(data);
      mode.then((res) => {
        const result = res.data.data;
        if (result.result == 'Y') {
          this.closePopup();
          this.message = result.message;
          this.openConfirmPopup();
          // 등록요청 api호출 정상 응답 후 아래 함수 호출
          // eslint-disable-next-line
          exitGrowvApp();
        } else {
          this.message = result.message;
          this.openConfirmPopup();
        }
      }).catch((error) => {
        console.log(error);
      });
    },

    // 팝업
    // 알럿팝업 열기
    openConfirmPopup() {
      this.confirmShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    //  알럿팝업 닫기
    closeConfirmPopup() {
      this.confirmShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
  }
}
</script>

<style>
@import url('@/assets/css/launcher/layout.css');
@import url('@/assets/css/launcher/modal/mypage.css');
</style>