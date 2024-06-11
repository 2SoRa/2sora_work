<template>
  <div class="mypage-link consult-write">
    <div class="gnb">
      <button v-if="!isReadingClub" class="back"><router-link :to="{ name: 'StudySupportConsult'}"></router-link></button>
<!--      리딩클럽에서 진입시 query값 넘겨주기-->
      <button class="back" v-else><router-link :to="{ name: 'StudySupportConsult' , query:{name: 'readingClub' }}"></router-link></button>
      <h1 class="title">1:1 문의하기</h1>
    </div>
    <div class="mypage-content">
      <div class="content">
        <ul>
          <li>
            <p class="form-title">문의 유형<span class="essential"></span></p>
            <!-- TODO: 오류시 error 추가  -->
            <div class="form-content select inputSelect">
              <div class="dropdown-wrap">
                <div class="dropdown full-select">
                  <!--  TODO: 디폴트는 전체         -->
                  <v-select label="cdVlNm"
                            placeholder="문의유형 선택"
                            :options="objectItem"
                            v-model="formData.selectedObject"
                            :reduce="objectItem => objectItem.cdVl">
                    <template #open-indicator="{ attributes }">
                      <span v-bind="attributes"><img src="@/assets/img/launcher/mypage/mp_ico_down.png" alt="arrow"></span>
                    </template>
                  </v-select>
                </div>
                <p class="info-sub">문의 유형을 선택해 주세요.</p>
              </div>
              <p class="info"><span class="essential"></span> 필수항목</p>
            </div>
          </li>
          <li class="align">
            <p class="form-title">내용<span class="essential"></span></p>
            <!-- TODO: 오류시 error 추가  -->
            <div class="form-content inputArea">
              <div class="input-area textarea">
                <textarea placeholder="내용을 입력해 주세요. (4,000자 이내)" maxlength="4000" @input="activeTextArea($event)" v-model="formData.inputContent"></textarea>
              </div>
              <p class="info-sub">문의 내용을 입력해 주세요.</p>
              <!-- TODO: 글자 입력시 카운팅 되어야함 -->
              <p><span>{{ this.contCount }}</span>/4000</p>
            </div>
          </li>
          <li>
            <p class="form-title">답변알림</p>
            <!-- TODO: 오류시 error 추가  -->
            <div class="form-content alarm inputPhone">
              <div class="input-wrap">
                <div class="phone-wrap inputArea">
                  <input type="tel" name="phone" class="input inputPhone" autocomplete="off" @input="activeInputClear($event)" placeholder="휴대폰 번호를 입력해 주세요." v-model="formData.inputPhone">
                  <div class="input-sub" >
                    <!-- TODO: show 추가하면 활성화 -->
                    <button class="btn btn-clear" @click="clickClear($event)"></button>
                  </div>
                </div>
                <p class="info-sub">휴대폰 번호를 입력해 주세요.</p>
              </div>
              <div class="checkbox-wrap">
                <label class="checkbox"> 답변 알림 받기
                  <input type="checkbox" name="alarm" v-model="formData.isSms">
                  <span class="checkmark"></span>
                </label>
              </div>
              <div class="info">문의에 대한 답변 등록 여부를 알려드립니다.</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="btn-wrap btn-wrap-01">
        <button class="btn btn-type-02-sec gray" @click="openCancelPopup()">취소</button>
        <!-- TODO: disable이면 비활성화 -->
        <button class="btn btn-type-02-sec" @click="registerConsult()">등록</button>
      </div>
    </div>
  </div>
  <cancelModal :propsData="{cancelShowModal}" @closePopup="closeCancelPopup"></cancelModal>
  <regConfirmModal :propsData="{regConfirmShowModal,isReadingClub}" @closePopup="closeRegConfirmPopup"></regConfirmModal>
</template>

<script>
import {mapGetters} from "vuex";
import cancelModal from '../comp/comp-contents/comp-mypage-popup/consult-reg-cancel-popup'
import regConfirmModal from '../comp/comp-contents/comp-mypage-popup/consult-reg-confirm-popup'
import mypageFactory from '@/api/mypage-factory';
import scheduleFactory from '@/api/learning-factory';

const consultCode = mypageFactory.get('consultCode');
const schedule = scheduleFactory.get('scheduleCode');

export default {
  name: '',
  components: {
    cancelModal,
    regConfirmModal,
  },
  data() {
    return {
      formData: {
        selectedObject: null,
        inputContent: '',
        inputPhone: '',
        isSms: true,
        regId: '',
        readingClubQuery:''
      },

      cancelShowModal: false,
      regConfirmShowModal: false,
      contCount: 0,
      objectItem: [
        {
          cdVl: null,
          cdVlNm: '문의 유형 선택',
        },
        {
          cdVl: '1',
          cdVlNm: '회원정보',
        },
        {
          cdVl: '2',
          cdVlNm: '주문/결제',
        },
        {
          cdVl: '3',
          cdVlNm: '배송문의',
        },
        {
          cdVl: '4',
          cdVlNm: '취소/교환/환불',
        },
        {
          cdVl: '5',
          cdVlNm: '학습서비스',
        },
        {
          cdVl: '6',
          cdVlNm: '사이트 이용',
        },
        {
          cdVl: '7',
          cdVlNm: '이벤트',
        },
        {
          cdVl: '8',
          cdVlNm: '기타',
        },
      ],
      //리딩클럽 집입 여부
      isReadingClub:false,
    }
  },
  watch: {
    'formData.selectedObject'() {
      if (this.formData.selectedObject != null) {
        const inputSelect = document.querySelector('.inputSelect');
        inputSelect.classList.remove('error');
      }
    },
    'formData.inputContent'() {
      if (this.formData.inputContent.length >= 0) {
        const inputArea = document.querySelector('.inputArea');
        inputArea.classList.remove('error');
      }
    },
    'formData.inputPhone'() {
      if (!this.formData.isSms || (this.formData.isSms && this.formData.inputPhone.length != 0)) {
        const inputPhone = document.querySelector('.inputPhone');
        inputPhone.classList.remove('error');
      }
    },
    'formData.isSms'() {
      if (!this.formData.isSms || (this.formData.isSms && this.formData.inputPhone.length != 0)) {
        const inputPhone = document.querySelector('.inputPhone');
        inputPhone.classList.remove('error');
      }
    },
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created() {
    this.getMdnNo();
    //리딩클럽에서 진입 했다면 true로 바꿔주기
    if(window.location.href.match('readingclub')){
      this.isReadingClub = true
    }
  },
  methods: {
    activeInputClear(event) {
      const numPattern = /^[0-9]+$/;

      if (!numPattern.test(event.target.value) && event.target.value.length > 0) {
        event.target.value = event.target.value.substring(0, event.target.value.length - 1);
      }

      this.formData.inputPhone = event.target.value;

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

      if (parentWrap.querySelector('input').classList.contains('inputPhone')) {
        this.formData.inputPhone = '';
        event.target.value = '';
      }

      icon.classList.remove('show');
    },
    activeTextArea(event) {
      this.formData.inputContent = event.target.value;
      this.contCount = event.target.value.length;
    },
    getMdnNo() {
      const data = {
        student_id : this.userInfo.info.studentId,
      }
      const num = schedule.loadParentSmsInfo(data);
      num.then((res) => {
        if (res.status == 200) {
          this.formData.inputPhone = res.data.data.mdnNo;
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    registerConsult() {
      if (this.formData.selectedObject == null) {
        const inputSelect = document.querySelector('.inputSelect');
        inputSelect.classList.add('error');

        return;
      }

      if (this.formData.inputContent.length == 0) {
        const inputArea = document.querySelector('.inputArea');
        inputArea.classList.add('error');

        return;
      }

      if (this.formData.isSms && this.formData.inputPhone.length == 0) {
        const inputPhone = document.querySelector('.inputPhone');
        inputPhone.classList.add('error');

        return;
      }

      this.formData.regId = this.userInfo.info.parentId;

      const data = {
        inquireTypeCd : this.formData.selectedObject,
        inquireCt : this.formData.inputContent,
        inquireAnswerNoticeYn : this.formData.isSms,
        inquireAnswerMdnNo : this.formData.inputPhone,
        regId : this.userInfo.info.studentId,
        inquireProdDiv : this.isReadingClub ? 'R' : 'V'
      }

      const register = consultCode.register(data);
      register.then((res) => {
        if (res.status == 200) {
          this.openRegConfirmPopup();
        }
      }).catch((error) => {
        console.log(error)
      });
    },

    // 팝업 클릭시
    clickPopBtn() {
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 취소 팝업 열기
    openCancelPopup() {
      this.cancelShowModal = true;
      this.clickPopBtn();
    },
    // 취소 팝업 닫기
    closeCancelPopup() {
      this.cancelShowModal = false;

      document.querySelector('body').style.overflow = 'auto';
    },
    // 등록 팝업 열기
    openRegConfirmPopup() {
      this.regConfirmShowModal = true;
      this.clickPopBtn();
    },
    // 등록 팝업 닫기
    closeRegConfirmPopup() {
      this.regConfirmShowModal = false;

      document.querySelector('body').style.overflow = 'auto';
    },
    //리딩클럽에서 진입 시 클래스 붙여주기
    addReadingClubClass() {
      const readingClub = document.querySelector('.consult-write')
      readingClub.classList.add('reading-club')
    }
  },
  mounted() {
    const input = document.querySelectorAll('.vs__selected-options .vs__search');
    input.forEach((el) => {
      el.setAttribute('inputmode','none');
      el.setAttribute('readonly','readonly');
    });
    if(this.$route.query.name){
      this.readingClubQuery = this.$route.query.name
      this.addReadingClubClass();
    }
  },
}
</script>

<style>
@import url('@/assets/css/launcher/common.css');
@import url('@/assets/css/launcher/layout.css');
@import url('@/assets/css/launcher/mypage/mypage.css');
@import url('@/assets/css/launcher/mypage/mypage-link.css');
</style>