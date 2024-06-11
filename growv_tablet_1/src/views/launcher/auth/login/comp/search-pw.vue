<template>
  <div class="search">
    <div class="search-area">
      <div class="search-title">
        <p class="title">비밀번호 찾기</p>
        <p class="content">회원가입 시 <span>등록한 정보</span>를 입력해 주세요.</p>
      </div>
      <ul class="input-wrap">
        <li>
          <div class="loginId-wrap">
            <input type="text" id="id" class="input input-id" autocomplete="off" placeholder="아이디 (이메일)" require ref="firstInput"
                   v-model="loginId" :readonly="isSmsSend"
                   @input="activeInputClear($event, 'loginId'), activeCheckBtn(), activeCertSendBtn()">
            <div class="input-sub" v-if="!isSmsSend">
              <button class="btn btn-clear" @click="clickClear($event,'loginId')"></button>
            </div>
          </div>
        </li>
        <li>
          <div class="name-wrap">
            <input type="text" id="name" class="input" autocomplete="off" placeholder="학부모이름 (한글 10자, 영문 20자 까지)" require
                   v-model="name" :readonly="isSmsSend"
                   @input="activeInputClear($event, 'name'), activeCheckBtn(), activeCertSendBtn()">
            <div class="input-sub" v-if="!isSmsSend">
              <button class="btn btn-clear" @click="clickClear($event,'name')"></button>
            </div>
          </div>
        </li>
        <li>
          <div class="certify mobileNo-wrap">
            <div>
              <input type="text" id="tel" class="input" autocomplete="off" placeholder="휴대폰 번호 (숫자만 입력)" require
                     maxlength="11" :readonly="isSmsSend"
                     v-model="mobileNo"
                     @input="activeInputClear($event, 'mobileNo'), activeCheckBtn(), typedInput($event), activeCertSendBtn()">
              <div class="input-sub" v-if="!isSmsSend">
                <button class="btn btn-clear" @click="clickClear($event,'mobileNo')"></button>
              </div>
            </div>
            <button v-if="!isSmsSend" class="btn btn-type-05 disable certify-btn" @click="smsCertSend()">인증번호</button>
            <button v-if="isSmsSend" class="btn btn-type-05 retry retry-btn" @click="smsCertSend()">재요청</button>
          </div>
        </li>
        <li v-if="isSmsSend">
          <div class="certify certify-wrap">
            <div>
              <input type="text" id="certify-number" class="input" autocomplete="off" placeholder="인증번호 입력"
                     maxlength="4"
                     v-model="certifyNo" @input="typedInput($event)">
              <div class="input-sub">
                <!-- TODO: show 추가하면 활성화 // 시간 임박 시 hurry 클래스 추가 -->
                <p class="time show">{{ minute }}:{{ seconds }}</p>
              </div>
            </div>
            <button class="btn btn-type-05 cert-check-btn" @click="smsCertCheck()">인증확인</button>
          </div>
        </li>
      </ul>
      <div class="btn-wrap">
        <button class="btn btn-410 gray">
          <router-link :to="{ name:'loginMain' }">이전</router-link>
        </button>
        <button class="btn btn-410 checkBtn disable" @click="searchUserInfo()">확인</button>
      </div>
    </div>
    <div class="footer search-footer">
      <p>고객센터<span class="call">1533-1777</span></p>
      <div>
        <p></p>
        <p>평일<span>10:00 ~ 19:00</span></p>
        <p>점심시간<span>12:00 ~ 13:00</span></p>
        <p>주말/공휴일<span>휴무</span></p>
      </div>
    </div>
  </div>

  <alertModal :propsData="{alertShowModal, message}" @closePopup="closeAlertPopup"></alertModal>
</template>

<script>
import {searchPw} from "@/api/auth/auth-api"
import {smsCertCheck, smsCertSend} from "@/api/sms/smsCert-api";

import alertModal from './comp-login-popup/search-pw-confirm-popup'

export default {
  name: "searchPw",
  created() {
    // this.$refs.firstInput.focus();
  },
  data() {
    return {
      loginId: '',
      name: '',
      mobileNo: '',
      certifyNo: '',
      isMobileNoCertified: false,
      alertShowModal: false,
      message: '',
      isSmsSend: false,
      countTime: 180000,
      totalTime: '',
      minute: '',
      seconds: '',
      timer: null,
    }
  },
  components: {
    alertModal,
  },
  methods: {
    activeCheckBtn() {
      const checkBtn = document.querySelector('.checkBtn');
      if (this.loginId && this.name && this.mobileNo.length >= 10 && this.isMobileNoCertified) {
        checkBtn.classList.remove('disable')
      } else {
        this.disabledCheckBtn();
      }
    },
    disabledCheckBtn() {
      const checkBtn = document.querySelector('.checkBtn');
      checkBtn.classList.add('disable');
    },
    activeCertSendBtn() {
      const certSendBtn = document.querySelector('.certify-btn');
      if (this.loginId && this.name && this.mobileNo.length >= 10) {
        certSendBtn.classList.remove('disable')
      } else {
        this.disabledCertSendBtn();
      }
    },
    disabledCertSendBtn() {
      const certSendBtn = document.querySelector('.certify-btn');
      certSendBtn.classList.add('disable');
    },
    disabledCertCheckBtn() {
      const certSendBtn = document.querySelector('.cert-check-btn');
      certSendBtn.classList.add('disable');
    },
    disabledCertRetryBtn() {
      const certSendBtn = document.querySelector('.retry-btn');
      certSendBtn.classList.add('disable');
    },
    activeInputClear(event, div) {
      const parentWrap = event.target.closest('.' + div + '-wrap');
      const icon = parentWrap.querySelectorAll('.btn-clear');

      icon.forEach((el) => {
        if (!el.classList.contains('show')) {
          el.classList.add('show');
        }
      });
    },
    clickClear(event, div) {
      if (div === 'name') {
        this.name = '';
      } else if (div === 'mobileNo') {
        this.mobileNo = '';
      } else if (div === 'loginId') {
        this.loginId = '';
      }

      const parentWrap = event.target.closest('.' + div + '-wrap');
      const icon = parentWrap.querySelectorAll('.btn-clear');

      icon.forEach((el) => {
        if (el.classList.contains('show')) {
          el.classList.remove('show');
        }
      });

      this.disabledCheckBtn();
    },
    typedInput(event) {
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
    },
    // 알럿팝업 열기
    openAlertPopup() {
      this.alertShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    //  알럿팝업 닫기
    closeAlertPopup() {
      this.alertShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    searchUserInfo() {
      if (!this.loginId) {
        alert("아이디(이메일)를 입력해 주세요.");
        return;
      }

      if (!this.name) {
        alert("학부모 이름을 입력해 주세요.");
        return;
      }

      if (!this.mobileNo) {
        alert("휴대폰 번호를 입력해 주세요.");
        return;
      }

      //eslint-disable-next-line
      const valueReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!valueReg.test(this.loginId)) {
        alert("이메일 형식의 올바른 아이디를 입력해주세요.");
        return;
      }

      const params = {
        loginId: this.loginId,
        name: this.name,
        mdnNo: this.mobileNo,
        isMobileNoCertified: this.isMobileNoCertified
      }

      searchPw(params).then((res) => {
        const result = res.data;
        if (result.code === '200') {
          // this.$router.push({name: 'searchIdSuccess', params: {name: result.data.name, loginId: result.data.loginId, regDt: result.data.regDt}});
          this.$router.push({
            name: 'resetPw',
            query: {id: result.data.id, loginId: result.data.loginId}
          });
        } else {
          this.message = result.message;
          this.openAlertPopup();
        }
      }).catch((error) => {
        console.log("error =", error);
        const errorData = error.response.data;
        alert(errorData.message);
      });
    },
    smsCertSend() {
      if(!this.mobileNo){
        this.message = '휴대폰 번호를 입력해주세요.';
        this.openAlertPopup();
        return;
      }

      const params = {
        mdnNo: this.mobileNo,
      }

      smsCertSend(params).then((res) => {
        const result = res.data;
        if (result.code === '200') {
          // 타이머 초기화/시작
          clearInterval(this.timer);
          this.startTimer();

          this.message = '인증번호가 발송되었습니다.';
          this.openAlertPopup();
          this.isSmsSend = true;
        } else {
          this.message = result.message;
          this.openAlertPopup();
        }
      }).catch((error) => {
        console.log("error =", error);
        const errorData = error.response.data;
        this.message = errorData.message;
        this.openAlertPopup();
      });
    },
    smsCertCheck() {
      if(this.minute == '00' && this.seconds == '00'){
        this.message = '인증 시간이 초과되었습니다. 재요청 하시기 바랍니다.';
        this.openAlertPopup();
        return;
      }

      if(!this.certifyNo){
        this.message = '인증번호를 입력해주세요.';
        this.openAlertPopup();
        return;
      }

      const params = {
        mdnNo: this.mobileNo,
        certNo: this.certifyNo
      }

      smsCertCheck(params).then((res) => {
        const result = res.data;
        if (result.code === '200') {
          this.isMobileNoCertified = true;
          this.message = '인증 되었습니다.';
          this.openAlertPopup();
          this.activeCheckBtn();
          this.disabledCertRetryBtn();
          this.disabledCertCheckBtn();
        } else {
          this.message = '인증번호가 일치하지 않습니다. \n다시 인증해 주세요.';
          this.openAlertPopup();
        }
      }).catch((error) => {
        console.log("error =", error);
        const errorData = error.response.data;
        this.message = errorData.message;
        this.openAlertPopup();
      });
    },
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
  },
}
</script>

<style scoped>
</style>