<template>
  <div class="search">
    <div class="search-area">
      <div class="search-title">
        <p class="title">비밀번호 재설정</p>
        <p class="content">비밀번호를 <span>새롭게 설정</span>해 주세요.</p>
      </div>
      <ul class="input-wrap">
        <li>
          <div class="password-wrap">
            <input type="password" class="input" autocomplete="off"  placeholder="비밀번호 (영문, 숫자, 특수문자 중 2가지 이상 포함 8~18자)"
                   ref="firstInput"
                   v-model="password" @input="activeCheckBtn(), activeInputClear($event, 'password')"
            >
            <div class="input-sub">
              <button class="btn hidden" @click="toggleEyeBtn($event, 'password')"></button>
              <button class="btn btn-clear" @click="clickClear($event,'password')"></button>
              <p class="check"></p>
            </div>
          </div>
        </li>
        <li>
          <div class="confirm-wrap">
            <input type="password" class="input" autocomplete="off"  placeholder="비밀번호 재입력"
                   v-model="passwordConfirm" @input="activeCheckBtn(), activeInputClear($event, 'confirm')"
            >
            <div class="input-sub">
              <button class="btn hidden" @click="toggleEyeBtn($event, 'confirm')"></button>
              <button class="btn btn-clear" @click="clickClear($event,'confirm')"></button>
              <p class="check"></p>
            </div>
          </div>
        </li>
      </ul>
      <div class="btn-wrap">
        <button class="btn btn-410 gray">
          <router-link :to="{ name:'searchPw' }">이전</router-link>
        </button>
        <button class="btn btn-410 checkBtn disable" @click="changePw()">확인</button>
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

  <alertModal :propsData="{alertShowModal, message, isProcess}" @closePopup="closeAlertPopup"></alertModal>
</template>

<script>
import alertModal from './comp-login-popup/search-pw-confirm-popup'
import {changePw} from "@/api/auth/auth-api";

export default {
  name: "resetPw",
  created() {
    if(!this.$route.query.id && !this.$route.query.loginId){
      this.$router.push({name: 'loginMain',});
    }

    this.id = this.$route.query.id;
    this.loginId = this.$route.query.loginId;
  },
  data() {
    return {
      id: '',
      loginId: '',
      password: '',
      passwordConfirm: '',
      alertShowModal: false,
      message: '',
      isProcess: false
    }
  },
  components: {
    alertModal,
  },
  methods: {
    activeCheckBtn() {
      const checkBtn = document.querySelector('.checkBtn');
      if (this.password && this.passwordConfirm) {
        checkBtn.classList.remove('disable')
      } else {
        this.disabledCheckBtn();
      }
    },
    disabledCheckBtn() {
      const checkBtn = document.querySelector('.checkBtn');
      checkBtn.classList.add('disable');
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
      this.toggleEyeCloseBtn(event, div);

      if (div === 'password') {
        this.password = '';
      } else if (div === 'confirm') {
        this.passwordConfirm = '' ;
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
    toggleEyeCloseBtn(event, div) {
      const parentWrap = event.target.closest('.' + div + '-wrap');
      const input = parentWrap.querySelector('input');
      const icon = parentWrap.querySelectorAll('.hidden');

      // eye icon들 중 show클래스가 있으면 제거하고 없으면 추가
      icon.forEach((el) => {
        if (el.classList.contains('show')) {
          el.classList.remove('show');
          input.setAttribute('type', 'password');
        }
      });
    },
    toggleEyeBtn(event, div) {
      if(div === 'password' && !this.password){
        return;
      }else if(div === 'pwConfirm' && !this.passwordConfirm){
        return;
      }

      const parentWrap = event.target.closest('.' + div + '-wrap');
      const input = parentWrap.querySelector('input');
      const icon = parentWrap.querySelectorAll('.hidden');

      // eye icon들 중 show클래스가 있으면 제거하고 없으면 추가
      icon.forEach((el) => {
        if (el.classList.contains('show')) {
          el.classList.remove('show');
          input.setAttribute('type', 'password');
        } else {
          el.classList.add('show');
          input.setAttribute('type', 'text');
        }
      });
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
    changePw(){
      // 비밀번호, 비밀번호 확인 체크
      if(this.password !== this.passwordConfirm) {
        this.message = '비밀번호가 일치하지 않습니다.';
        this.openAlertPopup();
        return;
      }

      // 영문+숫자 8자 이상 체크
      const pw_reg1 = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,50}$/; //영문,숫자
      // 특수문자 포함 6자 이상
      const pw_reg2_check1 = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,50}$/; //영문,특수문자
      const pw_reg2_check2 = /^(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{6,50}$/; //특수문자, 숫자
      if (!pw_reg1.test(this.password) && !(pw_reg2_check1.test(this.password) || pw_reg2_check2.test(this.password))) {
        this.message = '영문/숫자/특수문자 중 2가지 이상을 포함한 8~18자 여야 합니다.';
        this.openAlertPopup();
        return;
      }

      const params = {
        id: this.id,
        loginId: this.loginId,
        password: this.password
      }

      changePw(params).then((res) => {
        const result = res.data;
        if (result.code === '200') {
          this.isProcess = true;
          this.message = '비밀번호 재설정이 완료되었습니다. 로그인 해주세요.';
          this.openAlertPopup();
        } else {
          this.message = result.message;
        }
      }).catch((error) => {
        console.log("error =", error);
        const errorData = error.response.data;
        this.message = errorData.message;
        this.openAlertPopup();
      });
    }
  },
}
</script>

<style scoped>
</style>