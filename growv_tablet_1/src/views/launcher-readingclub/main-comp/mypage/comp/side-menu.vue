<template>
  <div class="mp-side">
    <div class="profile">
      <!-- TODO: 조건설정에 따라 캐릭터 변경됨 -->
      <button type="button" class="profile-img" @click="openCharacterPopup">
        <img
          v-if="
            userInfo.info.supervCharacterId == '' ||
            userInfo.info.supervCharacterId == null
          "
          src="@/assets/img/launcher/mypage/mp_profile_def.webp"
          alt="default"
        />
        <img
          v-else-if="userInfo.info.supervCharacterId == 'W'"
          src="@/assets/img/launcher/mypage/mp_profile_wiz.png"
          alt="wiz"
        />
        <img
          v-else-if="userInfo.info.supervCharacterId == 'S'"
          src="@/assets/img/launcher/mypage/mp_profile_sukey.png"
          alt="sukey"
          class="sukey"
        />
        <img
          v-else-if="userInfo.info.supervCharacterId == 'D'"
          src="@/assets/img/launcher/mypage/mp_profile_dewey.png"
          alt="dewey"
        />
        <img
          v-else-if="userInfo.info.supervCharacterId == 'E'"
          src="@/assets/img/launcher/mypage/mp_profile_evie.png"
          alt="evie"
        />
        <img
          v-else-if="userInfo.info.supervCharacterId == 'N'"
          src="@/assets/img/launcher/mypage/mp_profile_neo.png"
          alt="neo"
        />
      </button>
      <p class="name">{{ userInfo.info.studentName }}</p>
      <div>
        <img
          src="@/assets/img/launcher-readingclub/mypage/my_profile_period.png"
          alt="period"
        />
      </div>
      <div class="period" v-if="isPeriod">
        {{ userInfo.info.learnStartDt }} ~ {{ userInfo.info.learnEndDt }}
      </div>
      <div class="period" v-else>슈퍼리딩 수강 내역이 없어요</div>
    </div>
    <div class="btn-wrap">
      <!-- 독서활동 버튼 -->
      <button type="button" class="btn btn-reading">
        <router-link :to="{name:'readingStatusActiveCalendar', query:{path:'mypage'}}">
          <!-- href="/schedule.html" -->
          <img
              src="@/assets/img/launcher-readingclub/mypage/btn_reading.webp"
            alt="schedule"
          />
        </router-link>
      </button>
      <button type="button" class="btn btn-attend">
        <!-- 슈퍼리딩 출석부 버튼 -->
        <router-link :to="{name:'readingStatusAttend', query:{path:'mypage'}}">
          <img
            src="@/assets/img/launcher-readingclub/mypage/btn_attendancebook.webp"
            alt="attendancebook"
          />
        </router-link>
      </button>
    </div>
    <ul class="menu">
      <li @click="isSurport=false">
        <router-link :to="{ name: 'GrowingTree' }">자람나무 내역</router-link>
      </li>
      <li @click="isSurport=false">
        <router-link :to="{ name: 'ShoppingPoint' }"
          >포인트 내역</router-link
        >
      </li>
      <!-- TODO: 쪽지함은 현재도 운영하지 않기 때문에 주석처리로 대체 -->
      <!--      <li :class="{ active : isMessage }" @click="tabMessage('message')">
              <router-link :to="{ name: 'MessageReceive' }">쪽지함</router-link>
            </li>-->
      <!--      학습지원,회원정보수정은 런처 파일 동일하게 사용-->
      <li @click="isSurport=true">
        <router-link :to="{ name: 'StudySupportNotice' , query:{name:'readingClub'} }" exact :class="{'router-link-active router-link-exact-active':isSurport}">학습지원</router-link>
      </li>
      <li @click="isSurport=false">
        <router-link :to="{ name: 'MemberInfoMain'}">회원정보수정</router-link>
      </li>
    </ul>
    <div class="btn-wrap temp">
      <!-- TODO : 일반모드와 로그아웃은 슈퍼브이와 동일 -->
      <button v-if="isNormalMode" type="button" class="btn normal-mode" @click="openModePopup();"></button>
      <!--  TODO: 로그아웃 버튼 추가   -->
      <button type="button" class="btn logout" @click="logout()">로그아웃</button>
    </div>
  </div>

  <characterModal :propsData="{ characterShowModal, userInfo }" @closePopup="closeCharacterPopup"></characterModal>
  <ModeModal :propsData="{modeShowModal, userInfo}" @closePopup="closeModePopup"></ModeModal>
</template>

<script>
import characterModal from "@/views/launcher/mypage/comp/comp-contents/comp-mypage-popup/choice-character-popup.vue";
import { mapGetters } from "vuex";
import ModeModal from "@/views/launcher/mypage/comp/comp-contents/comp-mypage-popup/normal-mode-popup.vue";

export default {
  name: "side-menu.vue",
  components: {ModeModal, characterModal },
  data() {
    return {
      characterShowModal: false,
      modeShowModal: false,

      //TODO: 조건설정 필요함
      character: "wiz",
      isSurport:false,
      // isVitamin: false,
      // isMessage: false,
      // isStudy: false,
      // isInfo: false,
      isPeriod:false,
      isNormalMode:false
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  created() {
    this.getUrlParams();
  },
  mounted() {
    if(this.userInfo.info.learnStartDt){
      this.isPeriod = true;
    }
    if(this.userInfo.info.isDeviceNormal === true){
      this.isNormalMode = true;
    }
    if(window.location.href.match('/mypage/study-support')){
      this.isSurport = true
    }
  },
  methods: {
    //TODO: 탭메뉴 active 임시주석
    getUrlParams() {
      // if (window.location.href.match('message-box')) {
      //   this.isVitamin = false;
      //   this.isMessage = true;
      //   this.isStudy = false;
      //   this.isInfo = false;
      // } else if (window.location.href.match('study-support')) {
      //   this.isVitamin = false;
      //   this.isMessage = false;
      //   this.isStudy = true;
      //   this.isInfo = false;
      // } else if (window.location.href.match('member-info')) {
      //   this.isVitamin = false;
      //   this.isMessage = false;
      //   this.isStudy = false;
      //   this.isInfo = true;
      // } else {
      //   this.isVitamin = true;
      //   this.isMessage = false;
      //   this.isStudy = false;
      //   this.isInfo = false;
      // }
    },
    // tabMessage(thisArea) {
    // if (thisArea == 'vitamin') {
    //   this.isVitamin = true;
    //   this.isMessage = false;
    //   this.isStudy = false;
    //   this.isInfo = false;
    // } else if (thisArea == 'message') {
    //   this.isVitamin = false;
    //   this.isMessage = true;
    //   this.isStudy = false;
    //   this.isInfo = false;
    // } else if (thisArea == 'study') {
    //   this.isVitamin = false;
    //   this.isMessage = false;
    //   this.isStudy = true;
    //   this.isInfo = false;
    // } else if (thisArea == 'info') {
    //   this.isVitamin = false;
    //   this.isMessage = false;
    //   this.isStudy = false;
    //   this.isInfo = true;
    // }
    // },
    openCharacterPopup() {
      this.characterShowModal = true;
      document.querySelector("body").style.overflow = "hidden";
    },
    // 상세 팝업 닫기
    closeCharacterPopup() {
      this.characterShowModal = false;
      document.querySelector("body").style.overflow = "auto";
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
      // eslint-disable-next-line
      clearGrowvApp();
      document.location.href = "/login.html";
    },
  },
};
</script>

<style scoped></style>
