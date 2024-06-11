<template>
  <!--  TODO : 임시 구성 및 스타일 -->
  <div class="main-gnb btn-purple">
    <div class="gnb-left">
      <button type="button" class="all-menu" @click="showMenu"></button>
      <div class="member-no" v-if="propsData.gateInfo.modalData.supervread_subscribe_yn === 'Y' &&  propsData.gateInfo.modalData.supervread_subscribe_div === 'F' && propsData.gateInfo.modalData.supervstudy_subscribe_yn === 'N'">
        <img class="main-cha" src="@/assets/img/launcher-readingclub/main/img_free_member.webp" alt="">
        <div class="logo">
          <a href="/readingclub.html">
            <img src="@/assets/img/launcher-readingclub/common/logo_super_reading.webp" alt="superReadinglogo">
          </a>
        </div>
      </div>
      <div v-else class="member-div">
        <div class="logo">
          <a href="/readingclub.html">
            <img src="@/assets/img/launcher-readingclub/common/gnb_logo_v.webp" alt="superVlogo" />
          </a>
        </div>
        <div class="main-gnb-tab">
          <button type="button" @click="goApp">스터디</button>
          <button type="button">슈퍼리딩</button>
        </div>
      </div>
    </div>
    <div class="menu">
      <ul>
        <li class="active">오늘의 책</li>
        <li>
          <router-link :to="{ name: 'superpickMain' }">슈퍼픽</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'koreanLibraryDevelopment' }">한글 도서관</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'englishLibraryStep' }">영어 도서관</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'mysuperbookWeek' }">마이슈퍼북</router-link>
        </li>
      </ul>
    </div>
    <div class="gnb-right">
      <button type="button" class="setting" @click="openAppSetting">설정</button>
      <button type="button">
        <router-link :to="{ name: 'GrowingTree' }">
          <!-- TODO: mypage 진입 이미지 - 캐릭터 설정 이미지로 변경 기능 추가 필요 -->
          <img v-if="characterData === 'S'" src="@/assets/img/launcher-readingclub/common/profile_thumb/profile_thumb_su.webp" alt="sukey" />
          <img v-else-if="characterData === 'D'" src="@/assets/img/launcher-readingclub/common/profile_thumb/profile_thumb_de.webp" alt="dewey" />
          <img v-else-if="characterData === 'W'" src="@/assets/img/launcher-readingclub/common/profile_thumb/profile_thumb_wi.webp" alt="wiz" />
          <img v-else-if="characterData === 'E'" src="@/assets/img/launcher-readingclub/common/profile_thumb/profile_thumb_ev.webp" alt="evie" />
          <img v-else-if="characterData === 'N'" src="@/assets/img/launcher-readingclub/common/profile_thumb/profile_thumb_ne.webp" alt="neo" />
          <img v-else src="@/assets/img/launcher-readingclub/common/profile_thumb/profile_thumb_def.webp" alt="default" />
        </router-link>
      </button>
    </div>
  </div>
  <menuModal v-if="isMenu" @closePopup="closePopup"></menuModal>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import menuModal from '@/components/launcher-readingclub/modals/modal-menu';

export default {
  inheritAttrs: false,
  props : {
    propsData : {
      gateInfo : Object
    }
  },
  data() {
    return {
      // TODO: 캐릭터 default - default / sukey - s / dewey - d / wiz - w / evie - e / neo - n
      isMenu : false,
    };
  },
  components : {
    menuModal
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapGetters('readingStorage',['getAllMenu']),
    studentState() {
      return this.userInfo.info.studentMemStateCd;
    },
    characterData() {
      return this.userInfo.info.supervCharacterId;
    }
  },
  mounted() {
    if (this.getAllMenu) {
      this.isMenu = true
      this.setAllMenu(false);
    }
  },
  methods: {
    ...mapMutations('readingStorage',['setAllMenu']),
    goApp() {
      if (this.propsData.gateInfo.modalData.supervstudy_subscribe_yn === 'Y') {
        // eslint-disable-next-line
        GrowvLauncherBridge.startScreen('main');
        // eslint-disable-next-line
        GrowvLauncherBridge.close();
      } else {
        this.$emit('showGatePopup','study');
      }
    },
    showMenu() {
      this.isMenu = true;
    },
    openAppSetting() {
      const userAgent = navigator.userAgent;
      if (userAgent === 'SuperV-Launcher') {
        // eslint-disable-next-line
        GrowvLauncherBridge.startSettings('SuperReading');
      }
    },
    closePopup() {
      this.isMenu = false;
    },
  }
};
</script>