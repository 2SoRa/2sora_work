<template>
  <div class="whole-modal consult study">
    <div class="whole-modal-content">
      <img src="@/assets/img/launcher-readingclub/main/bg_study_exp_231201.webp" alt="상담 신청 팝업">
      <button type="button" class="close" @click="closeGatePopup"></button>
      <button class="submit" @click="showInquiry"></button>
    </div>
    <!-- 슈퍼 브이 무체 -->
    <div class="free-experi" v-if="currentModal.isModal && currentModal.modalType === 'exp'">
      <Modal>
        <template v-slot:header>
          <h1>스터디 <span>무료 체험 신청</span></h1>
          <button type="button" class="modal-default-button" @click="closePopup"></button>
        </template>
        <template v-slot:body>
          <div class="pop-body">
            <h1 class="sub-title">
              체험을 신청하시면,<br>
              슈퍼V 스터디 무료 체험이 <span>익일 자동 시작</span>됩니다.
            </h1>
            <form class="form-area">
              <fieldset>
                <legend>무체 신청 입력 폼</legend>
                <div class="input-wrap">
                  <p>자녀 이름</p>
                  <input type="text" autocomplete="off" :value="userInfo.info.studentName" disabled>
                </div>
                <div class="input-wrap">
                  <p>자녀 연령</p>
                  <input type="text" autocomplete="off" :value="setAge() + '세'" disabled>
                </div>
                <div class="input-wrap">
                  <p>전화번호<span> *</span></p>
                  <input type="text" autocomplete="off" v-model="inputTel">
                </div>
                <p class="info" ref="info" error-text="등록된 휴대 전화번호와 일치하지 않습니다." input-text="회원정보에 등록된 휴대 전화번호를 입력해 주세요."></p>
              </fieldset>
            </form>
            <button type="button" class="btn" @click="goExp">신청</button>
          </div>
        </template>
        <template v-slot:footer>
        </template>
      </Modal>
    </div>
    <!-- 슈퍼 브이 상담 -->
    <div class="free-experi buy" v-if="currentModal.isModal && currentModal.modalType === 'buy'">
      <Modal>
        <template v-slot:header>
          <h1>스터디 <span>구매 상담 신청</span></h1>
          <button type="button" class="modal-default-button" @click="closePopup"></button>
        </template>
        <template v-slot:body>
          <div class="pop-body">
            <h1 class="sub-title">
              이미 무료 체험을 진행하셨습니다.<br>
              구매 상담을 신청하시면 해피콜이 진행됩니다.
            </h1>
            <form class="form-area">
              <fieldset>
                <legend>구매 상담 입력 폼</legend>
                <div class="input-wrap">
                  <p>자녀 이름</p>
                  <input type="text" autocomplete="off" :value="userInfo.info.studentName" disabled>
                </div>
                <div class="input-wrap">
                  <p>자녀 연령</p>
                  <input type="text" autocomplete="off" :value="setAge() + '세'" disabled>
                </div>
                <div class="input-wrap">
                  <p>전화번호<span> *</span></p>
                  <input type="text" autocomplete="off" v-model="inputTel">
                </div>
                <p class="info" ref="info" error-text="등록된 휴대 전화번호와 일치하지 않습니다." input-text="회원정보에 등록된 휴대 전화번호를 입력해 주세요."></p>
              </fieldset>
            </form>
            <button type="button" class="btn" @click="goBuy">신청</button>
          </div>
        </template>
        <template v-slot:footer>
        </template>
      </Modal>
    </div>
  </div>
</template>
<script >
import Modal from "@/components/modal.vue";
import { mapGetters } from "vuex";
import readingClubFactory from "@/api/reading-club/readingClub-factory";
import functionMixin from "@/common/mixin/functionMixin";
import moment from "moment/moment";

const userProductApi =readingClubFactory.get('gate')
export default {
  mixins : [ functionMixin ],
  props : {
    propsData : {
      gateInfo : Object
    }
  },
  data() {
    return {
      flagBuy :false,
      studentId : null,
      engStep : 'basic',
      buyData : {},
      parentNum : null,
      inputTel : '',
      currentModal : {
        isModal : false,
        modalType : 'exp'
      },
    }
  },
  computed : {
    ...mapGetters(['userInfo'])
  },
  components : {
    Modal
  },
  created() {
    this.studentId = this.userInfo.info.studentId;
  },
  mounted() {
    // this.getIsComplete();
    this.getBuyInfo();
    this.getParentInfo();
  },
  methods : {
    getIsComplete() {
      const params = {
        parentId : this.userInfo.info.parentId,
        consultLocationDiv: "RL",
        cosultDiv : "D"
      }
      const completeInfo = userProductApi.getIsInquiry(params)
      completeInfo.then((res) => {
        if (res.data.data === 0) {
          this.isComplete = true;
        }
      })
    },
    async getBuyInfo() {
      await Promise.all([
        userProductApi.getUserSuperVstate(this.studentId),
        userProductApi.getUserReadingstate(this.studentId),
      ]).then((res) => {
        this.buyData.isStudy = res[0].data.data.expYn;
        this.buyData.isReading = res[1].data.data.expYn;
      });
    },
    getParentInfo() {
      const params = {
        student_id : this.studentId
      }
      const parentInfo = userProductApi.getParentPhone(params)
      parentInfo.then((res) => {
        this.parentNum = res.data.data.mdnNo;
      })
    },
    closeGatePopup() {
      if(this.$route.query.entryPoint === 'gate' && this.$route.query.selectedButton === 'study') {
        // eslint-disable-next-line
        GrowvLauncherBridge.startScreen('gate');
        // eslint-disable-next-line
        GrowvLauncherBridge.close();
        return;
      }
      if (this.propsData.gateInfo.modalData.supervread_subscribe_yn === 'Y') {
        this.$emit('closeGatePopup');
        this.$router.replace({ query : {}});
        return;
      } else {
        // eslint-disable-next-line
        GrowvLauncherBridge.startScreen('gate');
        // eslint-disable-next-line
        GrowvLauncherBridge.close();
      }
    },
    closePopup() {
      this.inputTel = '';
      this.currentModal.isModal = false;
    },
    setAge() {
      return ( 1 + moment(new Date()).diff(moment(this.userInfo.info.birthdate), 'years'));
    },
    goExp() {
      // 슈퍼브이 무체 신청
      if (!this.inputTel) {
        this.$refs.info.classList.add('error','blank');
        return;
      }
      if (this.parentNum !== this.inputTel) {
        this.$refs.info.classList.remove('blank');
        this.$refs.info.classList.add('error');
        return;
      }
      if (!this.flagBuy) {
        this.flagBuy = true;
        const params = {
          studentId: this.studentId,
          expRequestDiv: '1',
          prodId: location.href.indexOf("://stw.superv.com") > -1 ? 131 : 231,
          engStep: this.engStep
        }
        const doExp = userProductApi.doExp(params);
        doExp.then((res) => {
          if (res.data.data.code === 200) {
            this.buyData.isStudy = true;
            this.showToast('신청이 완료되었습니다.<br>내일부터 무료 체험이 가능합니다.');
            this.inputTel = '';
          } else {
            this.inputTel = '';
            this.showToast('오류가 발생했습니다.<br>관리자에게 문의해주세요.');
          }
        }).catch((err) => console.log(err));
      }
    },
    goBuy() {
      // 슈퍼브이 구매 신청
      if (!this.inputTel) {
        this.$refs.info.classList.add('error','blank');
        return;
      }
      if (this.parentNum !== this.inputTel) {
        this.$refs.info.classList.remove('blank');
        this.$refs.info.classList.add('error');
        return;
      }
      if (!this.flagBuy) {
        this.flagBuy = true;
        const params = {
          studentId: this.studentId,
          cosultDiv: 'D',
          consultLocationDiv: 'RL',
        }
        const doBuy = userProductApi.doBuy(params);
        doBuy.then((res) => {
          if (res.data.data.result === 'Y') {
            this.showToast('신청이 완료되었습니다.<br>빠른 시일 내 연락 드리도록 하겠습니다.');
            this.inputTel = '';
            // this.isComplete = false;
          } else {
            this.inputTel = '';
            this.showToast('오류가 발생했습니다.<br>관리자에게 문의해주세요.');
          }
        }).catch((err) => console.log(err));
      }
    },
    toastComplete() {
      this.flagBuy = false;
      this.closePopup();
    },
    showInquiry() {
      if (this.buyData.isStudy) {
        this.currentModal.modalType = 'buy';
      } else {
        if (this.setAge() < 4) {
          alert('4세 부터 무료 체험 신청이 가능합니다.');
          return;
        }
      }
      this.currentModal.isModal = true;
    }
  }
}
</script>