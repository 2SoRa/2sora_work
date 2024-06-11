<template>
  <div class="login-main">
    <div class="login-area">
      <ul class="input-wrap">
        <li>
          <div class="id-wrap">
            <input type="email" class="input" autocomplete="off" placeholder="아이디" ref="firstInput" required
                   v-model="id" @input="activeInputClear($event, 'id'), activeLoginBtn()">
            <div class="input-sub">
              <button class="btn btn-clear" @click="clickClear($event,'id')"></button>
            </div>
          </div>
        </li>
        <li>
          <div class="password-wrap">
            <input type="password" class="input" autocomplete="off" placeholder="비밀번호" v-model="password" required
                   @input="activeInputClear($event, 'password'), activeLoginBtn()">
            <div class="input-sub">
              <button class="btn hidden disable" @click="toggleEyeBtn($event)"></button>
              <button class="btn btn-clear" @click="clickClear($event, 'password')"></button>
            </div>
          </div>
        </li>
        <li>
          <ul class="info">
            <li>임시 아이디 (회원가입 전) : <span>sv휴대폰 번호</span> (예 : sv01012345678)</li>
            <li>회원 아이디 (회원가입 후) : <span>회원가입 이메일</span> (예 : abc@superv.com)</li>
          </ul>
        </li>
      </ul>
      <button class="btn btn-760 disable" @click="login()">로그인</button>
      <div class="account-search">
        <router-link :to="{ name:'searchId' }">아이디 찾기</router-link>
        <router-link :to="{ name:'searchPw' }">비밀번호 찾기</router-link>
      </div>
    </div>
    <!-- TODO: 원격지원 앱 호출 버튼   -->
    <a class="remote" href="intent://run#Intent;package=net.koino.anysupportMobile;scheme=AnySupportMobile;end;">
      <img src="@/assets/img/launcher/login/icobtn_remote@2x.webp" alt="원격지원 앱 호출">
    </a>
    <div class="serial">
      <!-- TODO : span에 시리얼 넘버 -->
      S/N <span>{{ deviceNo }}</span>
    </div>
    <div class="footer guide-footer">
      <p>고객센터<span class="call">1533-1777</span></p>
      <p>평일<span>10:00 ~ 19:00</span></p>
      <p>점심시간<span>12:00 ~ 13:00</span></p>
      <p>주말/공휴일<span @click="openStoragePopup()">휴무</span></p>
    </div>
  </div>


  <childModal :propsData="{childShowModal}" @closePopup="closeChildPopup"></childModal>
  <enterModal :propsData="{enterShowModal}" @closePopup="closeEnterPopup"></enterModal>
  <tMsgModal :propsData="{tMsgShowModal}" @closePopup="closeTMsgPopup"></tMsgModal>
  <storageModal :propsData="{storageShowModal}" @closePopup="closeStoragePopup"></storageModal>
  <loginErrorModal :propsData="{loginErrorShowModal, message}" @closePopup="closeLoginErrorPopup"></loginErrorModal>
  <childConfirmModal :propsData="{childConfirmShowModal, students}"
                     @closePopup="closeChildConfirmPopup"></childConfirmModal>
</template>

<script>
import {login} from "@/api/auth/auth-api"
import {mapGetters} from 'vuex'
import childModal from '@/views/launcher/auth/login/comp/comp-login-popup/child-select-popup'
import enterModal from '@/views/launcher/common/comp/comp-common-popup/common-enter-popup'
import tMsgModal from '@/views/launcher/common/comp/comp-common-popup/common-teacher-msg-popup'
import storageModal from '@/views/launcher/common/comp/comp-common-popup/common-storage-popup'
import loginErrorModal from "@/views/launcher/auth/login/comp/comp-login-popup/login-error-popup";
import childConfirmModal from "@/views/launcher/auth/login/comp/comp-login-popup/child-confirm-popup";
import jwt from "@/common/jwt";
import constant from "@/common/constant";

export default {
  name: "login",
  created() {
    jwt.destroyAll();
    this.students = [];
    this.studentId = null;

    // 학습기 런처 토큰, 학생ID 초기화 처리
    // eslint-disable-next-line
    clearGrowvApp();

    if (constant.isStudyProdUrl) {
      // 테블릿 기기시리얼번호 가져오기
      // eslint-disable-next-line
      this.deviceNo = getDeviceNo();
    } else {
      this.deviceNo = "R9PT808NLGR";
    }

  },
  data() {
    return {
      id: '',
      password: '',
      childShowModal: false,
      enterShowModal: false,
      tMsgShowModal: false,
      storageShowModal: false,
      loginErrorShowModal: false,
      childConfirmShowModal: false,
      message: '',
      deviceNo: null,
      students: [],
      studentId: null
    }
  },
  mounted() {
    this.$refs.firstInput.focus();
  },
  components: {
    childModal,
    enterModal,
    tMsgModal,
    storageModal,
    loginErrorModal,
    childConfirmModal
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  methods: {
    activeLoginBtn() {
      const loginBtn = document.querySelector('.btn-760');

      if (this.id !== '' && this.password.length >= 4) {
        loginBtn.classList.remove('disable')
      } else {
        this.disabledLoginBtn();
      }
    },
    disabledLoginBtn() {
      const loginBtn = document.querySelector('.btn-760');
      loginBtn.classList.add('disable');
    },
    toggleEyeBtn(event) {
      if (!this.password) {
        return;
      }

      const parentWrap = event.target.closest('.password-wrap');
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
    activeInputClear(event, div) {
      if (div === "id") {
        const parentWrap = event.target.closest('.id-wrap');
        const icon = parentWrap.querySelectorAll('.btn-clear');

        icon.forEach((el) => {
          if (!el.classList.contains('show')) {
            el.classList.add('show');
          }
        });

      } else {
        const parentWrap = event.target.closest('.password-wrap');
        const icon = parentWrap.querySelectorAll('.btn-clear');

        icon.forEach((el) => {
          if (!el.classList.contains('show')) {
            el.classList.add('show');
          }
        });
      }
    },
    clickClear(event, div) {
      if (div === "id") {
        this.id = '';
        const parentWrap = event.target.closest('.id-wrap');
        const icon = parentWrap.querySelectorAll('.btn-clear');

        icon.forEach((el) => {
          if (el.classList.contains('show')) {
            el.classList.remove('show');
          }
        });
      } else {
        this.password = '';
        const parentWrap = event.target.closest('.password-wrap');
        const icon = parentWrap.querySelectorAll('.btn-clear');

        icon.forEach((el) => {
          if (el.classList.contains('show')) {
            el.classList.remove('show');
          }
        });
      }

      this.disabledLoginBtn();
    },
    login(studentId) {
      const credentials = {
        email: this.id,
        password: this.password,
        serialNo: this.deviceNo,
        studentId: studentId
      }

      login(credentials).then((res) => {
        const result = res.data;
        if (result.code === '200') {
          if (result.data.accessToken) {
            jwt.saveAllToken(result.data);
            this.$store.dispatch('loadUserInfo');

            setTimeout(() => {
              this.loginPageTransfer();
            }, 500)
          } else {
            this.students = result.data;
            this.openChildConfirmPopup();
          }
        } else {
          this.message = `<p>아이디와 비밀번호를 확인해주세요.</p><p class="info-list">임시 아이디 : sv휴대폰번호</p><p class="info-list">회원 아이디 : 이메일</.p>`;

          this.openLoginErrorPopup();
          jwt.destroyAll();
          this.students = [];
          this.studentId = null;
        }
      }).catch((error) => {
        const errorData = error.response.data;
        if (errorData.code === 'INVALID') {
          this.message = errorData.message;
          this.openLoginErrorPopup();
        }
      });
    },
    loginPageTransfer() {
      // 임시회원(1) 회원전환 프로세스 처리
      if (this.userInfo.info.studentMemStateCd === '1') {
        console.log("임시회원 전환 가입 페이지 이동");
        // 테블릿에 토큰, 학생ID 연동처리
        // eslint-disable-next-line
        setGrowvAppUser(jwt.getToken(), this.userInfo.info.studentId);

        // 회원가입페이지 화면전환
        this.$router.push({path: 'join'});

        // 무료회원(2), 정회원(3) App연동 로그인 정상 처리
      } else if (this.userInfo.info.studentMemStateCd === '2' || this.userInfo.info.studentMemStateCd === '3') {
        // 테블릿에 토큰, 학생ID 연동처리
        // eslint-disable-next-line
        setGrowvAppUser(jwt.getToken(), this.userInfo.info.studentId);

        // 테블릿 메인페이지 화면전환
        // eslint-disable-next-line
        goGrowvAppPage("welcome");

        // 만료회원(4)
      } else if (this.userInfo.info.studentMemStateCd === '4') {

        console.log("만료회원 안내페이지 이동")
        jwt.destroyAll();
        this.students = [];
        this.studentId = null;
        // 요효하지 않은 회원 상태로 처리
      } else {
        console.log("유효하지 않은 회원 상태로 처리")
        jwt.destroyAll();
        this.students = [];
        this.studentId = null;
      }
    },
    // 알럿팝업 열기
    openChildPopup() {
      this.childShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    //  알럿팝업 닫기
    closeChildPopup() {
      this.childShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    // 입장하기팝업 열기
    openEnterPopup() {
      this.enterShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    //  입장하기팝업 닫기
    closeEnterPopup() {
      this.enterShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    // 저장공간확인팝업 열기
    openStoragePopup() {
      this.storageShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    //  알럿팝업 닫기
    closeStoragePopup() {
      this.storageShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    // 알럿팝업 열기
    openTMsgPopup() {
      this.tMsgShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    //  알럿팝업 닫기
    closeTMsgPopup() {
      this.tMsgShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    openLoginErrorPopup() {
      this.loginErrorShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    closeLoginErrorPopup() {
      this.loginErrorShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    openChildConfirmPopup() {
      this.childConfirmShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    closeChildConfirmPopup(studentId) {
      this.childConfirmShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
      // 학생프로필 정보 초기화 및 로그인 정보 초기화
      this.students = [];
      jwt.destroyAll();

      if (studentId) {
        this.login(studentId);
      }
    },
  },

}
</script>

<style scoped>

</style>