<template>
  <div>
    <Modal v-if="propsData.pwModiShowModal" title="">
      <template v-slot:body>
        <div class="modal-01 modi-info">
          <h1 class="title">비밀번호 변경</h1>
          <div class="pop-content">
            <ul class="form">
              <li>
                <p class="form-title">새 비밀번호</p>
                <!-- TODO: pwError1 추가시 input-sub1 에러 보여짐, pwError2 추가시 input-sub2 에러 보여짐 -->
                <div class="form-content formWrap formWrapDefault">
                  <div class="input-wrap">
                    <div class="wrap inputArea">
                      <input type="password" class="input inputPw" placeholder="영문, 숫자, 특수문자 중 2가지 이상 포함 8~18자" v-model="inputPassword" @input="activeInputClear($event), enteredPassword($event), activeCheckBtn()">
                      <div class="input-sub">
                        <!-- TODO: 각각 show 추가하면 활성화  -->
                        <button class="btn hidden" :class="{ show: isShowPw }" @click="showPassword()"></button>
                        <button class="btn btn-clear" @click="clickClear($event)"></button>
                        <p class="check"></p>
                      </div>
                    </div>
                    <p class="info-sub input-sub1">영문, 숫자, 특수문자 중 2가지 이상 포함 8~18자</p>
                    <p class="info-sub input-sub2">비밀번호를 입력해 주세요.</p>
                  </div>
                </div>
              </li>
              <li>
                <p class="form-title">새 비밀번호 확인</p>
                <!-- TODO: pwError1 추가시 input-sub1 에러 보여짐, pwError2 추가시 input-sub2 에러 보여짐 -->
                <div class="form-content formWrap formWrapConfirm">
                  <div class="input-wrap">
                    <div class="wrap inputArea">
                      <input type="password" class="input inputPwConfirm" placeholder="새 비밀번호 재입력" v-model="inputPasswordConfirm" @input="activeInputClear($event), enteredPasswordConfirm(), activeCheckBtn()">
                      <div class="input-sub">
                        <!-- TODO: 각각 show 추가하면 활성화  -->
                        <button class="btn hidden" :class="{ show: isShowPwConfirm }" @click="showConfirmPassword()"></button>
                        <button class="btn btn-clear" @click="clickClear($event)"></button>
                        <p class="check"></p>
                      </div>
                    </div>
                    <p class="info-sub input-sub1">비밀번호가 일치하지 않습니다.</p>
                    <p class="info-sub input-sub2">비밀번호를 재입력해 주세요.</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="btn-wrap btn-wrap-01">
            <button class="btn btn-02-mp gray" @click="closePopup">취소</button>
            <!-- TODO: disable 비활성화 -->
            <button class="btn btn-02-mp btnChange" @click="changePassword()">변경</button>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div></div>
      </template>
    </Modal>
  <comfirmModal :propsData="{confirmShowModal}" @closePopup="closeConfirmPopup"></comfirmModal>
  </div>

</template>

<script>
import Modal from '@/components/modal';
import comfirmModal from './info-pw-change-confirm-popup'
import {changePw} from "@/api/auth/auth-api";

export default {
  props: {
    propsData: {
      pwModiShowModal: Boolean,
      info: Object,
    },
  },
  data() {
    return {
      title: '비밀번호 변경',
      inputPassword: '',
      inputPasswordConfirm: '',

      isShowPw: false,
      isShowPwConfirm: false,

      confirmShowModal: false,
    }
  },
  components: {
    Modal,
    comfirmModal,
  },
  watch: {
    'inputPassword'() {
      this.activeCheckBtn();
      this.enteredPasswordConfirm();

      if (this.inputPassword.length > 0) {
        const formWrapDefault = document.querySelector('.formWrapDefault');
        formWrapDefault.classList.remove('pwError2');
      }
    },
    'inputPasswordConfirm'() {
      this.activeCheckBtn();
      this.enteredPasswordConfirm();

      if (this.inputPasswordConfirm.length > 0) {
        const formWrapConfirm = document.querySelector('.formWrapConfirm');
        formWrapConfirm.classList.remove('pwError2');
      }
    },
  },
  computed: {
  },
  methods: {
    closePopup() {
      this.resetForm();
      this.$emit('closePopup');
    },
    resetForm() {
      this.inputPassword = '';
      this.inputPasswordConfirm = '';
      this.isShowPw = false;
      this.isShowPwConfirm = false;
    },
    activeInputClear(event) {
      const parentWrap = event.target.closest('.inputArea');
      const icon = parentWrap.querySelector('.btn-clear');
      icon.classList.add('show');

      if (event.target.value == '') {
        icon.classList.remove('show');
      }
    },
    clickClear(event) {
      const parentWrap = event.target.closest('.inputArea');
      const icon = parentWrap.querySelector('.btn-clear');

      if (parentWrap.querySelector('input').classList.contains('inputPw')) {
        this.inputPassword = '';
      } else if (parentWrap.querySelector('input').classList.contains('inputPwConfirm')) {
        this.inputPasswordConfirm = '';
      }

      icon.classList.remove('show');
      this.activeCheckBtn();
    },
    activeCheckBtn() {
      const btnCheck = document.querySelector('.btnChange');

      let count = 0;
      const formWrap = document.querySelectorAll('.formWrap');
      formWrap.forEach((el) => {
        if (el.classList.contains('pwError1')) {
          count++;
        }
      });

      if (count > 0) {
        btnCheck.classList.add('disable');
      } else {
        btnCheck.classList.remove('disable');
      }
    },
    enteredPassword(event) {
      this.inputPassword = event.target.value;

      // 8~18자 이상 2가지 조합
      //eslint-disable-next-line
      const pw_reg_check1 = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,18}$/; //영문,숫자
      //eslint-disable-next-line
      const pw_reg_check2 = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,18}$/; //영문,특수문자
      //eslint-disable-next-line
      const pw_reg_check3 = /^(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{8,18}$/; //특수문자, 숫자

      const formWrap = event.target.closest('.formWrap');
      if (!(pw_reg_check1.test(this.inputPassword) || pw_reg_check2.test(this.inputPassword) || pw_reg_check3.test(this.inputPassword)) && this.inputPassword.length > 0) {
        formWrap.classList.add('pwError1');
      } else {
        formWrap.classList.remove('pwError1');
      }
    },
    enteredPasswordConfirm() {
      const formWrap = document.querySelector('.formWrapConfirm');
      if ((this.inputPassword != this.inputPasswordConfirm) && this.inputPasswordConfirm.length > 0) {
        formWrap.classList.add('pwError1');
      } else {
        formWrap.classList.remove('pwError1');
      }
    },

    // 비밀번호 보여주기 여부
    showPassword() {
      this.isShowPw = !this.isShowPw;
      const inputPw = document.querySelector('.inputPw');
      if (this.isShowPw) {
        inputPw.type = 'text';
      } else {
        inputPw.type = 'password';
      }
    },
    // 비밀번호 확인 보여주기 여부
    showConfirmPassword() {
      this.isShowPwConfirm = !this.isShowPwConfirm;
      const inputPwConfirm = document.querySelector('.inputPwConfirm');
      if (this.isShowPwConfirm) {
        inputPwConfirm.type = 'text';
      } else {
        inputPwConfirm.type = 'password';
      }
    },
    // 비밀번호 변경
    changePassword() {
      if (this.inputPassword.length == 0) {
        const formWrapDefault = document.querySelector('.formWrapDefault');
        formWrapDefault.classList.add('pwError2');
        return;
      }
      if (this.inputPasswordConfirm.length == 0) {
        const formWrapConfirm = document.querySelector('.formWrapConfirm');
        formWrapConfirm.classList.add('pwError2');
        return;
      }

      const params = {
        id: this.propsData.info.parentId,
        loginId: this.propsData.info.parentLoginId,
        password: this.inputPasswordConfirm
      }

      changePw(params).then((res) => {
        const result = res.data;
        if (result.code === '200') {
          this.openConfirmPopup();
        }
      }).catch((error) => {
        console.log("error =", error);
      });
    },

    // 팝업
    // 확인팝업 열기
    openConfirmPopup() {
      this.closePopup();
      this.confirmShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 확인팝업 닫기
    closeConfirmPopup() {
      this.confirmShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
  }
}
</script>

<style>
@import url('@/assets/css/launcher/modal/mypage.css');
</style>