<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.authShowModal" @close="closePopup">
      <template v-slot:body>
        <!-- TODO: 임시 스타일 버튼 추가 후 스타일 변경될 수 있음 -->
        <div class="modal-lt-round parent-certify"> <!-- modal-04 -->
          <h1 class="title">학부모 인증</h1>
          <button class="modal-default-button" @click="closePopup"></button>
          <div class="content">
            <div class="txt-guide-wrap">
              <p class="txt-guide">본인 인증을 진행해 주세요.</p>
<!--              <p class="txt-try-num">일일 최대 <em><i>&lt;!&ndash; TODO : 현재 인증 횟수 &ndash;&gt;{{authCount}}</i>/5</em>회</p>-->
            </div>
            <div class="certify-area">
              <div class="certify retry">
                <div>
                  <input type="tel" id="tel" class="input" autocomplete="off" :value="getParentSmsInfo">
                  <!-- TODO:  인증번호 클릭시 재요청으로 버튼 변경 / disable 삭제 시 활성화 -->
                  <!--                <button class="btn btn-type-05 certify-btn" @click="openCertifyPopup()">인증번호</button>-->
                  <button v-if="!isSmsSend" class="btn btn-type-05 certify-btn authBtn" @click="sendAuthNum()">인증요청</button>
                  <!-- TODO: disable 삭제 시 활성화          -->
                  <button v-else-if="isSmsSend" class="btn btn-type-05 retry reAuthBtn" @click="sendAuthNum('retry')">재요청</button>
                </div>
              </div>
              <p class="txt-info">
                <span class="default">휴대폰 번호가 다른 경우 회원정보를 수정해주세요.</span>
                <span class="cert-click">휴대폰으로 인증번호가 발송되었습니다. 확인 후 입력해주세요.</span>
              </p>
            </div>
            <div class="certify certify-number" :class="{'sta-reAuth' : isSmsSend && authTimer.totalTime !== 0}">
              <div>
                <div class="input-wrap">
                  <input type="number" class="input" autocomplete="off" placeholder="인증번호 입력" v-model="authNum">
                  <div class="input-sub" v-if="isSmsSend && authTimer.totalTime !== 0 ">
                    <!-- TODO: 시간 임박 시 hurry 클래스 추가 -->
                    <p class="time active hurry">{{ authTimer.minuates }}<span>:</span>{{ authTimer.seconds }}</p>
                  </div>
                </div>
                <button class="btn btn-type-05" :class="{disable : !isSmsSend || authTimer.totalTime === 0 }" @click="checkAuthNum()">확인</button>
              </div>
              <p class="txt-info">
                <span class="error" v-if="isAuthError && isSmsSend">{{message}}</span>
              </p>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div>
        </div>
      </template>
    </Modal>
    <buyModal :propsData="{completeShowModal }" @closePopup="closeCompletePopup"></buyModal>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import Modal from '@/components/modal';
import buyModal from './vscan-auth-buy-popup'
import common from '@/common/common'
import {smsCertCheck} from "@/api/sms/smsCert-api";
import learningFactory from '@/api/learning-factory';
import mypageFactory from '@/api/mypage-factory';

const schedule = learningFactory.get('scheduleCode');
const authApi = mypageFactory.get('userInfoCode');
export default {
  props: {
    propsData: {
      authShowModal: Boolean,
    },
  },
  data() {
    return {
      title: '학부모 인증',
      historyShowModal: false,
      completeShowModal: false,
      confirmShowModal: false,
      isSmsSend: false,
      message: '',
      getParentSmsInfo: '',
      isAuthError: false,

      authNum: '',
      authTimer: {
        timer: null,
        countTime: 180000,
        totalTime: '',
        minuates: '03',
        seconds: '00',
      },
      authCount: 0,
      //최대 5번까지 인증번호 요청가능
      isMaxAuthcount:false,
      showTimer:false
    }
  },
  components: {
    Modal,
    buyModal,
  },
  computed: {
    // ...mapGetters('scheduleStorage', ['getParentSmsInfo']),
    ...mapGetters(['userInfo']),
  },
  mounted() {
    const data = {
      student_id : this.userInfo.info.studentId
    }
    const list = schedule.loadParentSmsInfo(data);
    list.then((res) => {
      this.getParentSmsInfo = res.data.data.mdnNo
    })
  },
  methods: {
    ...mapMutations('scheduleStorage', ['storeParentAuthDiv']),

    closePopup() {
      this.resetForm();
      this.$emit('closePopup');
    },
    resetForm() {
      clearInterval(this.authTimer.timer);

      this.isSmsSend = false;
      this.message = '';
      this.authNum = '';
      this. authTimer = {
        timer: null,
        countTime: 180000,
        totalTime: '',
        minuates: '03',
        seconds: '00',
      };
      // this.authCount = 0;
    },
    openHistoryPopup() {
      this.$refs.scriptHistory.show();

      this.historyShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    openAuthCompletePopup() {
      this.completeShowModal = true;
      // this.closePopup();
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 이력보기 팝업 닫기
    closeHistoryPopup() {
      this.historyShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    // 학부모 인증 완료 팝업 닫기
    closeCompletePopup() {
      this.completeShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    // 인증번호 보내기
    sendAuthNum(retry) {
      const data = {
        // student_id : this.userInfo.info.studentId,
        mdnNo : this.getParentSmsInfo,
        goPath : 'S'
      }
      const list = authApi.checkAuthNum(data);
      list.then((res) => {
        if (res.status == 200) {
          if(!retry){
            this.isSmsSend = !this.isSmsSend
          }
          clearInterval(this.authTimer.timer);
          this.startTimer();
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    startTimer() {
      this.authTimer.totalTime = this.authTimer.countTime / 1000;

      this.countDown();

      this.authTimer.timer = setInterval(() => {
        this.countDown();
      }, 1000);
    },
    countDown() {
      this.authTimer.minuates = String(Math.floor(this.authTimer.totalTime / 60)).padStart(2, '0');
      this.authTimer.seconds = String(this.authTimer.totalTime % 60).padStart(2, '0');
      // let timerClass = document.querySelector('.certify-number')

      if (this.authTimer.totalTime >= 1) {
        this.authTimer.totalTime -= 1;
      } else {
        this.authTimer.totalTime = 0;
        clearInterval(this.authTimer.timer);
        this.authTimer.minuates = '03';
        this.authTimer.seconds = '00';
        this.authNum ='';
        // timerClass.classList.remove('sta-reAuth')
      }
    },
    // 인증번호 확인하기
    checkAuthNum() {
      if (this.authTimer.totalTime == 0) {
        this.message = '인증 유효시간이 지났습니다. 인증번호 재요청을 해주세요.';
        this.openConfirmPopup();
        return;
      }
      const data = {
        mdnNo: this.getParentSmsInfo,
        certNo: this.authNum,
      }
      const list = smsCertCheck(data);
      list.then((res) => {
        if (res.status == 200) {
            this.openAuthCompletePopup();
            this.storeParentAuthDiv('P');

            const moment = require('moment');
            moment.locale('ko');

            let authCheckDate = moment().add('1', 'h').format('YYYY-MM-DD HH:mm:ss');
            common.saveParentAuthExpiredTime(authCheckDate);
        }
      }).catch((error) => {
        console.log(error);
        this.message = '인증번호가 다릅니다.';
        this.isAuthError = true;
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
  },
}
</script>

<style>
@import "@/assets/css/launcher/modal/history-list.css";
@import "@/assets/css/launcher/modal/auth-modal.css";
</style>