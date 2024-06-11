<template>
  <div class="mp-side">
    <div class="profile">
      <!-- TODO: 조건설정에 따라 캐릭터 변경됨 -->
      <button class="profile-img" @click="openCharacterPopup">
        <img v-if="userInfo.info.supervCharacterId == '' || userInfo.info.supervCharacterId == null" src="@/assets/img/launcher/mypage/mp_profile_def.webp" alt="default">
        <img v-else-if="userInfo.info.supervCharacterId == 'W'" src="@/assets/img/launcher/mypage/mp_profile_wiz.png" alt="wiz">
        <img v-else-if="userInfo.info.supervCharacterId == 'S'" src="@/assets/img/launcher/mypage/mp_profile_sukey.png" alt="sukey" class="sukey">
        <img v-else-if="userInfo.info.supervCharacterId == 'D'"  src="@/assets/img/launcher/mypage/mp_profile_dewey.png" alt="dewey">
        <img v-else-if="userInfo.info.supervCharacterId == 'E'"  src="@/assets/img/launcher/mypage/mp_profile_evie.png" alt="evie">
        <img v-else-if="userInfo.info.supervCharacterId == 'N'"  src="@/assets/img/launcher/mypage/mp_profile_neo.png" alt="neo">
      </button>
      <p class="name">{{ userInfo.info.studentName }}</p>
      <div><img src="@/assets/img/launcher/mypage/my_profile_period.png" alt="period"></div>
      <div class="period">{{ userInfo.info.learnStartDt }} ~ {{ userInfo.info.learnEndDt }}</div>
    </div>
    <div class="btn-wrap">
      <button class="btn">
        <a id="link" href="/schedule.html?backDiv=Y"> <!-- href="/schedule.html" -->
          <img src="@/assets/img/launcher/mypage/mp_btn_plan.png" alt="schedule">
        </a>
      </button>
      <button class="btn">
        <router-link :to="{ name: 'AttendBook'}">
          <img src="@/assets/img/launcher/mypage/mp_btn_attendancebook.png" alt="attendancebook">
        </router-link>
      </button>
    </div>
    <ul class="menu">
      <li :class="{ active : isVitamin }" @click="tabMessage('vitamin')">
        <router-link :to="{ name: 'VitaminHistory' }">비타민 내역</router-link>
      </li>
<!--      <li :class="{ active : isMessage }" @click="tabMessage('message')">
        <router-link :to="{ name: 'MessageReceive' }">쪽지함</router-link>
      </li>-->
      <li :class="{ active : isStudy }" @click="tabMessage('study')">
        <router-link :to="{ name: 'StudySupportNotice' }">학습지원</router-link>
      </li>
      <li :class="{ active : isInfo }" @click="tabMessage('info')">
        <router-link :to="{ name: 'MemberInfoMain' }">회원정보수정</router-link>
      </li>
    </ul>
    <div class="btn-wrap temp">
      <!-- TODO: 어드민에서 보여주기 되어있을때만 나타남, v-if="userInfo.info.isDeviceNormal"   -->
      <button v-if="userInfo.info.isDeviceNormal" class="btn normal-mode" @click="openModePopup();"></button>
      <!--  TODO: 로그아웃 버튼 추가   -->
      <button class="btn logout" @click="logout();">로그아웃</button>
    </div>
  </div>

  <characterModal :propsData="{characterShowModal, userInfo}" @closePopup="closeCharacterPopup"></characterModal>
  <modeModal :propsData="{modeShowModal, userInfo}" @closePopup="closeModePopup"></modeModal>
</template>

<script>
import {mapGetters} from "vuex";
import characterModal from './comp-contents/comp-mypage-popup/choice-character-popup'
import modeModal from './comp-contents/comp-mypage-popup/normal-mode-popup'

export default {
  data() {
    return {
      characterShowModal: false,
      modeShowModal: false,

      //TODO: 조건설정 필요함
      character: 'wiz',

      isVitamin: false,
      isMessage: false,
      isStudy: false,
      isInfo: false,
    }
  },
  components: {
    characterModal,
    modeModal,
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created() {
    this.getUrlParams();
  },
  methods: {
    //TODO: 탭메뉴 active
    getUrlParams() {
      if (window.location.href.match('message-box')) {
        this.isVitamin = false;
        this.isMessage = true;
        this.isStudy = false;
        this.isInfo = false;
      } else if (window.location.href.match('study-support')) {
        this.isVitamin = false;
        this.isMessage = false;
        this.isStudy = true;
        this.isInfo = false;
      } else if (window.location.href.match('member-info')) {
        this.isVitamin = false;
        this.isMessage = false;
        this.isStudy = false;
        this.isInfo = true;
      } else {
        this.isVitamin = true;
        this.isMessage = false;
        this.isStudy = false;
        this.isInfo = false;
      }
    },
    tabMessage(thisArea) {
      if (thisArea == 'vitamin') {
        this.isVitamin = true;
        this.isMessage = false;
        this.isStudy = false;
        this.isInfo = false;
      } else if (thisArea == 'message') {
        this.isVitamin = false;
        this.isMessage = true;
        this.isStudy = false;
        this.isInfo = false;
      } else if (thisArea == 'study') {
        this.isVitamin = false;
        this.isMessage = false;
        this.isStudy = true;
        this.isInfo = false;
      } else if (thisArea == 'info') {
        this.isVitamin = false;
        this.isMessage = false;
        this.isStudy = false;
        this.isInfo = true;
      }
    },
    openCharacterPopup() {
      this.characterShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 상세 팝업 닫기
    closeCharacterPopup() {
      this.characterShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    // 일반모드 팝업 열기
    openModePopup() {
      this.modeShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 일반모드 팝업 닫기
    closeModePopup() {
      this.modeShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    logout() {
      // 숫자놀이 첫 진입 키 로컬에서 삭제
      localStorage.removeItem("firstHist");

      // eslint-disable-next-line
      clearGrowvApp();
      document.location.href="/login.html";
    }
  }
}
</script>

<style>
</style>