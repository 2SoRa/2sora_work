<template>
  <!-- div로 루트를 감싸주어야 warning이 안뜸 -->
  <div>
    <Modal v-if="propsData.completeShowModal" @close="closePopup" :title="title">
      <template v-slot:body>
        <div class="modal-lt-round buy-request">
          <h1 class="title">구매 요청</h1>
          <div class="content">
            <div class="txt-guide-wrap">
              <p class="txt-guide">V스캔 콘텐츠를 구매 하시겠습니까?</p>
            </div>
            <div class="info-list-wrap">
              <ul class="info-list">
                <li class="list-item remain-point"><p>잔여 포인트</p><em>{{insertDotNumber(currentBook.pointRemaining)}}</em></li>
                <li class="list-item off-point"><p>차감 포인트</p><em>{{currentBook.sbBooks.items[0].bookDiv === 'E' ? '1,000' : '3,000'}}</em></li>
              </ul>
              <p class="txt-info has-top-bd">
                <span class="type-red">
                  구매 후 콘텐츠가 즉시 실행됩니다.<br>
                  콘텐츠 실행 후 환불/취소가 불가능합니다.
                </span>
              </p>
            </div>
            <div class="input-circle-chk">
              <input type="checkbox" id="agree" value="agree" name="buy-agree" v-model="isAgree">
              <label for="agree">동의합니다.</label>
            </div>
            <div class="btn-wrap btn-wrap-02">
              <button class="btn btn-type-02-sec gray" @click="closePopup">취소</button>
              <!-- TODO : 구매하기 버튼 활성화 .disable 삭제 -->
              <button class="btn btn-type-02-sec" :class="{disable : !isAgree}" @click="buyBook">구매하기</button>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div>
        </div>
      </template>
    </Modal>
    <viewerModal :propsData="{ viewerInfo }" @openBookRun="openBookRun" @openViewerPopup="openViewerPopup" @closeViewerPopup="closeViewerPopup"></viewerModal>
  </div>
</template>

<script>
import Modal from '@/components/modal';
import readingClubFactory from "@/api/reading-club/readingClub-factory";
import {mapGetters} from "vuex";
import functionMixin from "@/common/mixin/functionMixin";
import viewerModal from "@/components/launcher-readingclub/modals/model-viewer.vue";
import numberMixin from "@/common/mixin/numberMixin";
import viewerMixin from "@/common/mixin/viewerMixin";

const buyBookApi = readingClubFactory.get('viewer')

export default {
  mixins: [
    functionMixin,
    numberMixin,
    viewerMixin
  ],
  props: {
    propsData: {
      completeShowModal: Boolean,
      message: '',
    },
  },
  data() {
    return {
      viewerInfo : {
        isModal : false,
        modalType : 'type',
        modalData : {}
      },
      title: '구매 요청',
      isAgree:false,
      flagBuy:false,
    }
  },
  components: {
    viewerModal,
    Modal,
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapGetters('vscanStorage', ['getVscanBookInfo']),
    currentBook() {
      return this.getVscanBookInfo;
    }
  },
  methods: {
    //구매하기
    buyBook() {
      if (!this.flagBuy) {
        this.flagBuy = true;
        const params = {
          parentId: this.userInfo.info.parentId,
          studentId: this.userInfo.info.studentId,
          bookGopath: 'S'
        }

        const buyBookData = buyBookApi.buyVscanBook(this.currentBook.sbBooks.items[0].bookId, params)
        buyBookData.then((res) => {
          if (res.data.data.result > 0) {
            this.showToast('구매 완료! 즐겁게 감상해 보세요.');
          } else if (res.data.data.result === -1) {
            alert('구매가 실패했어요!');
            this.flagBuy = false;
          }
        })
      }
    },
    toastComplete() {
      this.mixin_openBook({ 'path' : 'S', 'entry' : 'VScan', 'isBuy' : 'Y' },this.currentBook.sbBooks.items[0])
      setTimeout(() => {
        this.flagBuy = false;
      },2000);
    },
    closePopup() {
      // this.$emit('closePopup');
      this.$router.replace({name:'ReadingClubMainView'})
    },
    openBookRun(type) {
      this.mixin_openBookRun(type);
    },
    viewFinalComplete() {
      this.$router.replace({name:'ReadingClubMainView'})
    },
    openViewerPopup(info, item, type) {
      this.viewerInfo.modalData.info = info;
      this.viewerInfo.modalData.item = item;
      this.viewerInfo.modalType = type;
      this.viewerInfo.isModal = true;
    },
    closeViewerPopup(onlyClose) {
      this.viewerInfo.isModal = false;
      if ((this.viewFinalComplete !== undefined) && (onlyClose === false)) {
        this.viewFinalComplete();
      }
    },
  },
}
</script>

<style>
</style>