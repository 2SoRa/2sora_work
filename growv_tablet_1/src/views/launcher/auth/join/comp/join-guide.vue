<template>
  <div class="join-guide">
<!--    <h1 class="title">슈퍼V 첫 방문을 환영합니다!</h1>-->
    <div class="content">
      <p class="content-title">슈퍼V 서비스를 원활하게 이용하기 위해 <span>회원가입</span>을 진행해주세요.</p>

      <div class="check-all">
        <label class="checkbox">네, 모두 동의합니다.
          <input type="checkbox" v-model="formData.isAllAgreed"/>
          <span class="checkmark"></span>
        </label>
      </div>
      <p class="info">전체 동의는 필수 및 선택 정보에 대한 동의도 포함되어 있으며, 개별적으로 동의를 선택하실 수 있습니다.<br>서비스 계약 이행을 위해 필요한 경우에는 동의절차를 거치지 않을 수 있습니다. (정보통신망법 제 5조 제2항)</p>

      <ul class="agree-check-wrap">
        <li>
          <div>
            <label class="checkbox"><span>[필수]</span> 이용약관 동의
              <input type="checkbox" v-model="formData.isServiceAgreed" @click="activeCheckBtn()"/>
              <span class="checkmark"></span>
            </label>
          </div>
          <button @click="openServicePopup()">
            <img src="@/assets/img/launcher/login/log_ico_arrow_48_r.png" alt="arrow">
          </button>
        </li>
        <li class="agree-info">
          <div>
            <label class="checkbox"><span>[필수]</span> 개인정보 수집 및 이용 동의
              <input type="checkbox" v-model="formData.isPrivacyAgreed" @click="activeCheckBtn()"/>
              <span class="checkmark"></span>
            </label>
            <div class="info">동의를 거부할 권리가 있으나, 동의를 거부하는 경우 회원 서비스를 이용할 수 없습니다.</div>
          </div>
          <button @click="openPrivacyPopup()">
            <img src="@/assets/img/launcher/login/log_ico_arrow_48_r.png" alt="arrow">
          </button>
        </li>
        <li>
          <div>
            <label class="checkbox">[선택] 개인정보의 마케팅 및 광고 활용
              <input type="checkbox" v-model="formData.isMarketingAgreed"/>
              <span class="checkmark"></span>
            </label>
          </div>
          <button @click="openAdPopup()">
            <img src="@/assets/img/launcher/login/log_ico_arrow_48_r.png" alt="arrow">
          </button>
        </li>
      </ul>
      <div class="btn-wrap">
        <button class="btn btn-410 gray" @click="this.$router.go(-1)">이전</button>
        <button class="btn btn-410 disable checkBtn" @click="goSignUp">다음</button>
      </div>
    </div>
  </div>

  <serviceModal :propsData="{serviceShowModal}" @closePopup="closeServicePopup"></serviceModal>
  <privacyModal :propsData="{privacyShowModal}" @closePopup="closePrivacyPopup"></privacyModal>
  <adModal :propsData="{adShowModal}" @closePopup="closeAdPopup"></adModal>
</template>

<script>
import serviceModal from './comp-join-popup/policy-service-popup'
import privacyModal from './comp-join-popup/policy-privacy-popup'
import adModal from './comp-join-popup/policy-ad-popup'
import {mapGetters} from "vuex";

export default {
  name: "join-guide",
  data() {
    return {
      formData: {
        isAllAgreed: false,
        isServiceAgreed: false,
        isPrivacyAgreed: false,
        isMarketingAgreed: false
      },
      serviceShowModal: false,
      privacyShowModal: false,
      adShowModal: false,
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created() {
    if(!this.userInfo.info.parentId){
      this.$router.push({name: 'loginMain'});
    }
  },
  components: {
    serviceModal,
    privacyModal,
    adModal,
  },
  watch: {
    'formData.isAllAgreed'() {
      if(this.formData.isAllAgreed) {
        this.formData.isServiceAgreed = true;
        this.formData.isPrivacyAgreed = true;
        this.formData.isMarketingAgreed = true;
      }else{
        if(!this.formData.isMarketingAgreed) {
          this.formData.isServiceAgreed = true;
          this.formData.isPrivacyAgreed = true;
        }else if(!this.formData.isServiceAgreed) {
          this.formData.isPrivacyAgreed = true;
          this.formData.isMarketingAgreed = true;
        }else if(!this.formData.isPrivacyAgreed) {
            this.formData.isServiceAgreed = true;
            this.formData.isMarketingAgreed = true;
        }else{
          this.formData.isServiceAgreed = false;
          this.formData.isPrivacyAgreed = false;
          this.formData.isMarketingAgreed = false;
        }
      }
    },
    'formData.isServiceAgreed'() {
      if(!this.formData.isServiceAgreed){
        this.formData.isAllAgreed = false;
        this.disabledCheckBtn();
      }

      this.checkedAllAgree();
    },
    'formData.isPrivacyAgreed'() {
      if(!this.formData.isPrivacyAgreed){
        this.formData.isAllAgreed = false;
        this.disabledCheckBtn();
      }

      this.checkedAllAgree();

    },
    'formData.isMarketingAgreed'() {
      if (!this.formData.isMarketingAgreed) {
        this.formData.isAllAgreed = false;
      }
      this.checkedAllAgree();
    }
  },
  methods: {
    activeCheckBtn() {
      const checkBtn = document.querySelector('.checkBtn');
      checkBtn.classList.remove('disable')
    },
    disabledCheckBtn() {
      const checkBtn = document.querySelector('.checkBtn');
      checkBtn.classList.add('disable');
    },
    goSignUp(){
      if(!this.formData.isServiceAgreed){
        alert('이용약관에 동의해 주세요.');
        return;
      }

      if(!this.formData.isPrivacyAgreed){
        alert('개인정보 수집 및 이용동의에 동의해 주세요.');
        return;
      }

      this.$router.push({name: 'joinMain',
        query: {
          isServiceAgreed: this.formData.isServiceAgreed,
          isPrivacyAgreed: this.formData.isPrivacyAgreed,
          isMarketingAgreed: this.formData.isMarketingAgreed
        }})
    },
    // 알럿팝업 열기
    openServicePopup() {
      this.serviceShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    //  알럿팝업 닫기
    closeServicePopup() {
      this.serviceShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    // 알럿팝업 열기
    openPrivacyPopup() {
      this.privacyShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    //  알럿팝업 닫기
    closePrivacyPopup() {
      this.privacyShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    // 알럿팝업 열기
    openAdPopup() {
      this.adShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    //  알럿팝업 닫기
    closeAdPopup() {
      this.adShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    checkedAllAgree(){
      if(this.formData.isServiceAgreed && this.formData.isPrivacyAgreed && this.formData.isMarketingAgreed) {
        this.formData.isAllAgreed = true;
        this.activeCheckBtn();
      }else if(this.formData.isServiceAgreed && this.formData.isPrivacyAgreed && !this.formData.isMarketingAgreed) {
        this.activeCheckBtn();
      }else{
        this.disabledCheckBtn();
      }
    }
  },
}
</script>

<style scoped>

</style>