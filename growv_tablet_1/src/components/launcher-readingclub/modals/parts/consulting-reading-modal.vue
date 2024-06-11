<template>
  <div class="whole-modal consult reading">
    <div class="whole-modal-content">
      <img src="@/assets/img/launcher-readingclub/main/bg_reading_exp_240320.webp" alt="상담 신청 팝업">
      <button type="button" class="close" @click="closeGatePopup"></button>
      <!-- TODO: 버튼 클릭 기능 추가 필요     -->
      <button type="button" class="submit" @click="showInquiry" v-if="isShow"></button>
    </div>
    <!-- 슈퍼 리딩 무체 -->
    <div class="free-experi reading" v-if="currentModal.isModal && currentModal.modalType === 'exp'">
      <Modal>
        <template v-slot:header>
          <h1>슈퍼리딩 <span>무료 체험 신청</span></h1>
          <button type="button" class="modal-default-button" @click="closePopup"></button>
        </template>
        <template v-slot:body>
          <div class="pop-body content-scroll-area">
            <h1 class="sub-title">
              체험을 신청하시면,<br>
              슈퍼리딩 무료 체험이 <span>익일 자동 시작</span>됩니다.
            </h1>
            <form class="form-area">
              <fieldset>
                <legend>무체 신청 입력 폼</legend>
                <!-- TODO: 회원정보에 있는 자녀 이름&나이 불러와야함 -->
                <div class="input-wrap">
                  <p>자녀 이름</p>
                  <input type="text" autocomplete="off" :value="userInfo.info.studentName" disabled>
                </div>
                <div class="input-wrap">
                  <p>자녀 연령</p>
                  <input type="text" autocomplete="off" :value="setAge()" disabled>
                </div>
                <div class="reading-level">
                  <h1 class="sub-title">
                    슈퍼리딩은 <span>일일 독서 시간표</span>를 제공합니다.<br>
                    책 단계를 선택해 주세요.
                  </h1>
                  <ul>
                    <li>
                      <p>한글 책 단계</p>
                      <p>한글 책은 자녀 연령으로 자동 선택됩니다.</p>
                    </li>
                    <li>
                      <p>영어 책 단계 <span>*</span></p>
                      <form class="form-area">
                        <fieldset>
                          <legend>영어 책 단계 설정</legend>
                          <div class="radio-round-group square white">
                            <div class="radio-input">
                              <input type="radio" id="basic" value="B" name="english-step" checked v-model="engStep">
                              <label for="basic">
                                <span class="bold">Basic</span>
                                <span class="normal">영어가 처음이거나 알파벳만 알아요.</span>
                              </label>
                            </div>
                            <div class="radio-input">
                              <input type="radio" id="intermediate" value="I" name="english-step" v-model="engStep">
                              <label for="intermediate">
                                <span class="bold">Intermediate</span>
                                <span class="normal">파닉스를 알고 기초 단어를 읽을 수 있어요.</span>
                              </label>
                            </div>
                          </div>
                        </fieldset>
                      </form>
                    </li>
                  </ul>
                </div>
                <div class="input-wrap">
                  <p>전화번호<span> *</span></p>
                  <input type="text" autocomplete="off" v-model="inputTel">
                </div>
                <!-- TODO: 핸드폰 번호 정보 다를 때 error 클래스 추가 필요 ex) class="info error"-->
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
    <!-- 슈퍼 리딩 상담 -->
    <div class="free-experi reading buy" v-if="currentModal.isModal && currentModal.modalType === 'buy'">
      <Modal>
        <template v-slot:header>
          <h1>슈퍼리딩 <span>구매 상담 신청</span></h1>
          <button type="button" class="modal-default-button" @click="closePopup"></button>
        </template>
        <template v-slot:body>
          <div class="pop-body content-scroll-area">
            <h1 class="sub-title">
              이미 무료 체험을 진행하셨습니다.<br>
              구매 상담을 신청하시면 해피콜이 진행됩니다.
            </h1>
            <form class="form-area">
              <fieldset>
                <legend>무체 신청 입력 폼</legend>
                <!-- TODO: 회원정보에 있는 자녀 이름&나이 불러와야함 -->
                <div class="input-wrap">
                  <p>자녀 이름</p>
                  <input type="text" autocomplete="off" :value="userInfo.info.studentName" disabled>
                </div>
                <div class="input-wrap">
                  <p>자녀 연령</p>
                  <input type="text" autocomplete="off" :value="setAge()" disabled>
                </div>
                <div class="input-wrap">
                  <p>전화번호<span> *</span></p>
                  <input type="text" autocomplete="off" v-model="inputTel">
                </div>
                <!-- TODO: 핸드폰 번호 정보 다를 때 error 클래스 추가 필요 ex) class="info error"-->
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
import moment from "moment";

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
      flagBuy : false,
      studentId : null,
      engStep : 'B',
      buyData : {},
      parentNum : null,
      inputTel : '',
      currentModal : {
        isModal : false,
        modalType : 'exp'
      },
      isShow : false
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
    this.getIsComplete();
    this.getBuyInfo();
    this.getParentInfo();
  },
  methods : {
    getIsComplete() {
      const params = {
        parentId : this.userInfo.info.parentId,
        consultLocationDiv: "VL",
        cosultDiv : "D",
        studentId : this.userInfo.info.studentId
      }
      const completeInfo = userProductApi.getIsInquiry(params)
      completeInfo.then((res) => {
        if (res.data.data === 0) {
          this.isShow = true;
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
      // 스터디에서 넘어왔을 경우
      if(this.$route.query.entryPoint === 'studyGNB') {
        // eslint-disable-next-line
        GrowvLauncherBridge.startScreen('main');
      } else {
        // eslint-disable-next-line
        GrowvLauncherBridge.startScreen('gate');
      }
      // eslint-disable-next-line
      GrowvLauncherBridge.close();
    },
    closePopup() {
      this.inputTel = '';
      this.currentModal.isModal = false;
    },
    setAge() {
      return (1 + moment(new Date()).diff(moment(this.userInfo.info.birthdate), 'years')) + '세';
    },
    goExp() {
      // 슈퍼리딩 무체 신청
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
          expRequestDiv: '2',
          prodId: location.href.indexOf("://stw.superv.com") > -1 ? 130 : 230,
          engStep: this.engStep
        }
        const doExp = userProductApi.doExp(params);
        doExp.then((res) => {
          if (res.data.data.code === 200) {
            this.buyData.isReading = true;
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
      // 슈퍼리딩 구매 신청
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
          consultLocationDiv: 'VL',
        }
        const doBuy = userProductApi.doBuy(params);
        doBuy.then((res) => {
          if (res.data.data.result === 'Y') {
            this.showToast('신청이 완료되었습니다.<br>빠른 시일 내 연락 드리도록 하겠습니다.');
            this.inputTel = '';
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
      if (this.buyData.isReading) {
        this.currentModal.modalType = 'buy';
      }
      this.currentModal.isModal = true;
    }
  }
}
</script>