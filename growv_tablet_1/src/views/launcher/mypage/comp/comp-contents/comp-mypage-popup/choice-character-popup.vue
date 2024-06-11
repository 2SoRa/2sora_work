<template>
  <div>
    <Modal v-if="propsData.characterShowModal" @close="closePopup" title="">
      <template v-slot:body>
        <div class="modal-01 choice-character">
          <h1 class="title">슈퍼V 프렌즈를 선택해 주세요!</h1>
          <div class="pop-content">
            <ul>
              <li v-for="item in checkCharacterList" :key="item">
                <label class="checkbox">
                  <input type="radio" name="character" :value="item.characterId" v-model="selCharacter">
                  <span class="checkmark"></span>
                  <!-- TODO: label태그 밖에 있던 checkbox-sub를 label 안에 넣어서 여백 수정해야 함 -->
                  <div class="checkbox-sub">
                    <img :src="item.imgSrc" :alt="item.name" class="character-item">
                    <p>{{ item.name }}</p>
                  </div>
                </label>
              </li>
            </ul>
          </div>
          <div class="btn-wrap btn-wrap-01">
            <button class="btn btn-02-mp gray" @click="closePopup">닫기</button>
            <button class="btn btn-02-mp" @click="selectProfile()">선택완료</button>
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
import {mapActions} from "vuex";
import Modal from '@/components/modal';
import confirmModal from './confirm-popup';
import mypageFactory from '@/api/mypage-factory';

const sideCode = mypageFactory.get('sideCode');

export default {
  props: {
    propsData: {
      characterShowModal: Boolean,
      userInfo: Object,
    },
  },
  data() {
    return {
      title: '캐릭터 선택',

      confirmShowModal: false,
      message: '',

      selCharacter: '',

      checkCharacterList: [
        {
          characterId: 'W',
          imgSrc: require('@/assets/img/launcher/mypage/mp_profile_wiz.png'),
          name: '위즈'
        },
        {
          characterId: 'S',
          imgSrc: require('@/assets/img/launcher/mypage/mp_profile_sukey.png'),
          name: '슈키'
        },
        {
          characterId: 'D',
          imgSrc: require('@/assets/img/launcher/mypage/mp_profile_dewey.png'),
          name: '듀이'
        },
        {
          characterId: 'E',
          imgSrc: require('@/assets/img/launcher/mypage/mp_profile_evie.png'),
          name: '이비'
        },
        {
          characterId: 'N',
          imgSrc: require('@/assets/img/launcher/mypage/mp_profile_neo.png'),
          name: '네오'
        }
      ]
    }
  },
  components: {
    Modal,
    confirmModal,
  },
  computed: {
  },
  methods: {
    ...mapActions(['loadUserInfo']),

    closePopup() {
      this.resetForm();
      this.$emit('closePopup');
    },
    resetForm() {
      this.message = '';
      this.selCharacter = '';
    },
    selectProfile() {
      if (this.selCharacter == '') {
        this.message = '슈퍼V 프렌즈를 선택해 주세요.';
        this.openConfirmPopup();
        return;
      }

      const data = {
        memId : this.propsData.userInfo.info.studentId,
        parentId : this.propsData.userInfo.info.parentId,
        supervCharacterId : this.selCharacter,
      }

      const select = sideCode.updateCharacter(data);
      select.then((res) => {
        const result = res.data.data;
        if (res.status == 200) {
          if (result.result == 'Y') {
            this.loadUserInfo();
            this.closePopup();
            this.message = result.message;
            this.openConfirmPopup();
          } else {
            this.message = result.message;
            this.openConfirmPopup();
          }
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
@import url('@/assets/css/launcher/modal/mypage.css');
</style>