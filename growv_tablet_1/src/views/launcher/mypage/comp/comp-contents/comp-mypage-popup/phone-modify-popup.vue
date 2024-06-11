<template>
  <div>
    <Modal v-if="propsData.phoneModiShowModal" @close="closePopup" title="">
      <template v-slot:body>
        <div class="modal-01 modi-info phone">
          <h1 class="title">휴대폰 번호 변경</h1>
          <div class="pop-content">
            <ul class="form">
              <li>
                <p class="form-title">휴대폰 번호 변경하기</p>
                <div class="form-content">
                  <div class="input-wrap">
                    <div class="wrap">
                      <input type="number" class="input" placeholder="변경할 휴대폰 번호 입력" v-model="inputPhone" @input="enteredPhoneNum($event)">
                    </div>
<!--                    <p class="input-sub">영문, 숫자, 특수문자 중 2가지 이상 포함 8~18자</p>-->
<!--                    <p class="input-sub">비밀번호를 입력해 주세요.</p>-->
                  </div>
                  <button v-if="!isSmsSend" class="btn btn-type-05 disable btnSend" @click="sendAuthNum()">인증번호</button>
                  <button v-if="isSmsSend" class="btn btn-type-05 btnSend" @click="sendAuthNum()">재전송</button>
                </div>
              </li>
              <li v-if="isCertify">
                <!-- TODO: error클래스 추가시 에러메시지 보여짐 -->
                <div class="form-content" :class="{ error: isAuthError }">
                  <div class="input-wrap">
                    <div class="wrap">
                      <input type="number" class="input" placeholder="인증번호 입력" v-model="authNum" @input="enteredAuthNum($event)">
                      <div class="input-sub">
                        <p class="time hurry show">{{ minute }} : {{ seconds }}</p>
                      </div>
                    </div>
                    <p class="info">인증번호가 발송되었습니다.</p>
                    <p class="info-sub">인증번호가 일치하지 않습니다. 다시 인증해 주세요.</p>
                  </div>
                  <button class="btn btn-type-05" :class="{ disable: !isAuthNum }" @click="checkAuthNum()">인증확인</button>
                </div>
              </li>
            </ul>
          </div>
          <div class="btn-wrap btn-wrap-01">
            <button class="btn btn-02-mp gray" @click="closePopup">닫기</button>
            <button class="btn btn-02-mp" :class="{ disable: !isChangeBtn }" @click="changePw()">변경</button>
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
import {smsCertCheck} from "@/api/sms/smsCert-api";
import mypageFactory from '@/api/mypage-factory';

const userInfoCode = mypageFactory.get('userInfoCode');


export default {
  props: {
    propsData: {
      phoneModiShowModal: Boolean,
      info: Object,
    },
  },
  components: {
    Modal,
    confirmModal,
  },
  data() {
    return {
      title: '휴대폰 번호 변경',
      confirmShowModal: false,

      isCertify: false, // 인증번호버튼 클릭여부
      isSmsSend: false, // 재전송버튼 클릭여부
      isAuthNum: false, // 인증번호 4자리 있는지 여부
      isAuthError: false, // 인증 에러인지 여부
      isChangeBtn: false, // 변경버튼 활성화 여부
      sendCount: 0,
      message: '', // 팝업에 보낼 에러메시지

      inputPhone: '',
      authNum: '',

      countTime: 180000, // 180000
      totalTime: '',
      minute: '03',
      seconds: '00',
      timer: null,
    }
  },
  watch: {
    'authNum'() {
      if (this.authNum.length > 0) {
        this.isAuthError = false;
      }
    },
  },
  methods: {
    closePopup() {
      this.resetForm();
      this.$emit('closePopup');
    },
    resetForm() {
      clearInterval(this.timer);

      this.isCertify = false;
      this.isSmsSend = false;
      this.isAuthNum = false;
      this.isAuthError = false;
      this.isChangeBtn = false;
      this.sendCount = 0;
      this.message = '';

      this.inputPhone = '';
      this.authNum = '';

      this.countTime = 180000;
      this.totalTime = '';
      this.minute = '03';
      this.seconds = '00';
      this.timer = null;
    },
    enteredPhoneNum(event) {
      const numPattern = /^[0-9]+$/;

      if (!numPattern.test(event.target.value) && event.target.value.length > 0) {
        event.target.value = event.target.value.substring(0, event.target.value.length - 1);
      }

      this.inputPhone = event.target.value;

      const btnSend = document.querySelector('.btnSend');
      if (this.inputPhone.length >= 10) {
        btnSend.classList.remove('disable');
      } else {
        btnSend.classList.add('disable');
      }
    },
    enteredAuthNum(event) {
      const numPattern = /^[0-9]+$/;

      if (!numPattern.test(event.target.value) && event.target.value.length > 0 || event.target.value.length > 4) {
        event.target.value = event.target.value.substring(0, event.target.value.length - 1);
      }

      this.authNum = event.target.value;

      if (this.authNum.length == 4) {
        this.isAuthNum = true;
      } else {
        this.isAuthNum = false;
      }
    },

    // 인증번호 전송
    sendAuthNum() {
      this.sendCount++;
      if (this.sendCount > 0) {
        this.isSmsSend = true;
        this.authNum = '';
      }

      const params = {
        mdnNo : this.inputPhone,
      }

      const check = userInfoCode.checkAuthNum(params);

      check.then((res) => {
        const result = res.data;
        if (result.code === '200') {
          this.isCertify = true;

          // 타이머 초기화시작
          clearInterval(this.timer);
          this.startTimer();
        } else {
          this.message = result.message;
          this.openConfirmPopup();
        }
      }).catch((error) => {
        this.isSmsSend = false;
        console.log("error =", error);
        const errorData = error.response.data;
        this.message = errorData.message;
        this.openConfirmPopup();
      });
    },

    // 인증번호 확인하기
    checkAuthNum() {
      if(this.minute == '00' && this.seconds == '00'){
        this.message = '인증 시간이 초과되었습니다. 재요청 하시기 바랍니다.';
        this.openConfirmPopup();
        return;
      }

      const params = {
        mdnNo: this.inputPhone,
        certNo: this.authNum
      }

      smsCertCheck(params).then((res) => {
        const result = res.data;
        if (result.code === '200') {
          this.isChangeBtn = true;
          this.message = '인증 되었습니다.';
          this.openConfirmPopup();
        } else {
          this.message = '인증번호가 일치하지 않습니다. \n다시 인증해 주세요.';
          this.openConfirmPopup();
        }
      }).catch((error) => {
        this.isAuthError = true;
        console.log("error =", error);
        const errorData = error.response.data;
        this.message = errorData.message;
        this.openConfirmPopup();
      });
    },

    // 휴대폰 번호 변경
    changePw() {
      const data = {
        parentId : this.propsData.info.parentId,
        parentMdnNo : this.inputPhone,
      }

      const change = userInfoCode.updatePhoneNum(data);
      change.then((res) => {
        if (res.status == 200) {
          this.closePopup();
          this.message = '휴대폰 번호가 변경되었습니다.';
          this.openConfirmPopup();
          this.$emit('refreshInfo');
        }
      }).catch((error) => {
        console.log(error);
      });
    },

    // 타이머
    startTimer() {
      this.totalTime = this.countTime / 1000;

      this.countDown();

      this.timer = setInterval(() => {
        this.countDown();
      }, 1000);
    },
    countDown() {
      this.minute = String(Math.floor(this.totalTime / 60)).padStart(2, '0');
      this.seconds = String(this.totalTime % 60).padStart(2, '0');

      if (this.totalTime >= 1) {
        this.totalTime -= 1;
      } else {
        this.totalTime = 0;
        clearInterval(this.timer);
      }
    },

    // 팝업
    // 알럿팝업 열기
    openConfirmPopup() {
      // this.closePopup();
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
@import url('@/assets/css/launcher/modal/modal-common.css');
@import url('@/assets/css/launcher/modal/mypage.css');
</style>