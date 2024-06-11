<template>
<!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.authShowModal" @close="closePopup">
      <template v-slot:body>
        <!-- TODO: 임시 스타일 버튼 추가 후 스타일 변경될 수 있음 -->
        <div class="modal-04 parent-certify">
        <button class="modal-default-button" @click="closePopup"></button>
          <div class="content">
            <div class="history">
              <button @click="openHistoryPopup()"><img src="@/assets/img/launcher/common/btn_txtbtn_record_48.png" alt="history"></button>
            </div>
            <p class="txt-guide" style="padding-left: 107px;text-align:left;">본인 인증을 진행해 주세요.</p>
            <div class="certify-area">
              <!-- TODO: 학부모가 입력했던 연락처로 자동 발송 -->
              <div class="certify retry">
                <div>
                  <input type="tel" id="tel" class="input" autocomplete="off" :value="getParentSmsInfo">
                <!-- TODO:  인증번호 클릭시 재요청으로 버튼 변경 / disable 삭제 시 활성화 -->
<!--                <button class="btn btn-type-05 certify-btn" @click="openCertifyPopup()">인증번호</button>-->
                <button v-if="!isSmsSend" class="btn btn-type-05 certify-btn authBtn" @click="sendAuthNum()">인증번호</button>
                <!-- TODO: disable 삭제 시 활성화          -->
                <button v-else-if="isSmsSend" class="btn btn-type-05 retry reAuthBtn" @click="sendAuthNum()">재요청</button>
                </div>
              </div>
              <p class="txt-info">
                <span class="default">휴대폰 번호가 다른 경우 회원정보를 수정해주세요.</span>
                <span class="cert-click">휴대폰으로 인증번호가 발송되었습니다. 확인 후 입력해주세요.</span>
              </p>
            </div>

            <div class="certify certify-number">
              <div>
                <div class="input-wrap">
                  <input type="number" class="input" autocomplete="off" placeholder="인증번호입력" v-model="authNum">
                  <div class="input-sub">
                    <!-- TODO: show 추가하면 활성화 // 시간 임박 시 hurry 클래스 추가 -->
                    <p class="time show">{{ authTimer.minuates }}<span>:</span>{{ authTimer.seconds }}</p>
                  </div>
                </div>
                  <button class="btn btn-type-05" @click="checkAuthNum()">인증확인</button>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div>
        </div>
      </template>
    </Modal>
    <historyModal ref="scriptHistory" :propsData="{historyShowModal}" @closePopup="closeHistoryPopup"></historyModal>
    <completeModal :propsData="{completeShowModal}" @closePopup="closeCompletePopup"></completeModal>
    <confirmModal :propsData="{confirmShowModal, message}" @closePopup="closeConfirmPopup"></confirmModal>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import Modal from '@/components/modal';
import historyModal from './schedule-parent-history-popup'
import completeModal from './schedule-parent-auth-complete-popup'
import confirmModal from './comfirm-popup'
import common from '@/common/common'

import learningFactory from '@/api/learning-factory';

const schedule = learningFactory.get('scheduleCode');

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

      authNum: '',
      authTimer: {
        timer: null,
        countTime: 180000,
        totalTime: '',
        minuates: '03',
        seconds: '00',
      },
      authCount: 0,
    }
  },
  components: {
    Modal,
    historyModal,
    completeModal,
    confirmModal,
  },
  computed: {
    ...mapGetters('scheduleStorage', ['getParentSmsInfo']),
    ...mapGetters(['userInfo']),
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
      this.authCount = 0;
    },
    openHistoryPopup() {
      this.$refs.scriptHistory.show();

      this.historyShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    openAuthCompletePopup() {
      this.completeShowModal = true;
      this.closePopup();
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
    sendAuthNum() {
      this.authCount++;

      const data = {
        student_id : this.userInfo.info.studentId,
        mdn_no : this.getParentSmsInfo,
      }

      const list = schedule.sendParentAuthNum(data);
      list.then((res) => {
        if (res.status == 200) {
          if (res.data.data.result == 0) {
            this.message = '넘겨받은 전화번호가 없습니다.';
            this.openConfirmPopup();
            return;
          }

          if (res.data.data.result == 2) {
            this.message = '하루에 5번까지 인증이 가능합니다.';
            this.openConfirmPopup();
            return;
          }

          if (res.data.data.result == 1) {
            if (this.authCount >= 1) {
              this.isSmsSend = true;
            } else {
              this.isSmsSend = false;
            }

            clearInterval(this.authTimer.timer);
            this.startTimer();
          }

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

      if (this.authTimer.totalTime >= 1) {
        this.authTimer.totalTime -= 1;
      } else {
        this.authTimer.totalTime = 0;
        clearInterval(this.authTimer.timer);
        this.authTimer.minuates = '03';
        this.authTimer.seconds = '00';
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
        student_id : this.userInfo.info.studentId,
        mdn_no : this.getParentSmsInfo,
        cert_no : this.authNum,
      }

      const list = schedule.checkParentAuthNum(data);
      list.then((res) => {
        if (res.status == 200) {
          if (res.data.data.result == 0) {
            this.message = '넘겨받은 전화번호가 없습니다.';
            this.openConfirmPopup();
            return;
          }

          if (res.data.data.result == 2) {
            this.message = '넘겨받은 인증번호가 없습니다.';
            this.openConfirmPopup();
            return;
          }

          if (res.data.data.result == 3) {
            this.message = '인증번호가 다릅니다.';
            this.openConfirmPopup();
            return;
          }

          if (res.data.data.result == 1) {
            this.openAuthCompletePopup();
            this.storeParentAuthDiv('P');

            const moment = require('moment');
            moment.locale('ko');

            let authCheckDate = moment().add('1', 'h').format('YYYY-MM-DD HH:mm:ss');
            common.saveParentAuthExpiredTime(authCheckDate);
          }
        }
      }).catch((error) => {
        console.log(error)
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