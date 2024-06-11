<template>
  <!-- 내 도서관 : V스캔 구매 -->
  <div class="category-select-wrap">
    <button type="button" class="btn-vscan-go" @click="openAppVscan">
      <span class="txt">V스캔 GO 버튼</span>
    </button>
    <ul class="tab-menu-list">
      <li class="list-item">
        <button type="button" @click="toggleLanguage('K')" :class="{ active : this.currentLanguage === 'K'}"><span
          class="txt">한글책</span></button>
      </li>
      <li class="list-item">
        <button type="button" @click="toggleLanguage('E')" :class="{ active : this.currentLanguage === 'E'}"><span
          class="txt">영어책</span></button>
      </li>
    </ul>
    <!--  TODO: 1차 오픈범위 제외 / 버튼 가림 // 한글 전용일때 안보이도록 처리 완료 -->
    <!--    <button type="button" class="btn-vscan-schedule hide-eng"><span class="txt">V스캔 시간표</span></button>-->
  </div>
  <div class="content-scroll-area vscan">
    <div class="desc-area">
      <small class="float-desc">V스캔을 찍으면 내 도서관에서 독서가 가능해요.<br>내 도서관 보관 기간은 30일이에요.(다시 찍으면 30일 연장)</small>
    </div>
    <form class="form-area">
      <fieldset>
        <legend>전체/미완료/완료 라디오버튼</legend>
        <div class="radio-round-group">
          <div class="radio-input">
            <input type="radio" id="A" name="checked-study" value="A" v-model="currentRead" checked>
            <label for="A">전체</label>
          </div>
          <div class="radio-input">
            <input type="radio" id="N" name="checked-study" value="N" v-model="currentRead">
            <label for="N">안 읽었어요</label>
          </div>
          <div class="radio-input">
            <input type="radio" id="Y" name="checked-study" value="Y" v-model="currentRead">
            <label for="Y">읽었어요</label>
          </div>
        </div>
      </fieldset>
    </form>
    <div class="book-list-wrap">
      <ul class="book-list" v-if="bookListData && bookListData.length > 0">
        <li class="list-item" v-for="(item, index) in bookListData" :key="item">
          <div class="thumb-wrap">
            <span class="sta-book" :class="{ 'check-read' : item.isRead }"></span>
            <div class="thumbnail" :class="{ expire : item.endDt && isExpire(item.endDt) }">
              <img :src="item.thumbUrl" :alt="item.bookNm" @error="replaceDefault">
            </div>
            <div class="thumb-info">
              <div class="book-kind">
                <span :class="['motion-book', { 'show' : item.isMotionBook }]">모션북</span>
                <span :class="['e-book', { 'show' : item.isEbook }]">이북</span>
              </div>
              <div class="thumb-bottom-right">
                <span class="ico-guide" v-if="item.isGuide"></span>
                <div class="flag expire-date" v-if="(item.endDt && !isExpire(item.endDt) && (isExpireWeek(item.endDt) < 7)) || isExpire(item.endDt) ">
                <span class="txt-data">
                  <template v-if="isExpire(item.endDt)">
                    만료
                  </template>
                  <template v-else>
                    {{ 'D-' + (isExpireWeek(item.endDt) + 1) }}
                  </template>
                </span>
              </div>
              </div>
            </div>
            <template v-if="!isExpire(item.endDt)">
              <div class="view"
                   @click="mixin_openBook({ 'path' : 'S', 'entry' : 'VScan', 'index' : `${index}`, 'isRefresh' : 'N' }, item)"></div>
            </template>
            <template v-else>
              <div class="view" @click="showExpire()"></div>
            </template>
          </div>
          <div class="tag-wrap">
            <div class="tag" v-if="currentLanguage === 'K' ">
              <img v-if="item.mainAreaCd === '1'"
                   src="@/assets/img/launcher-readingclub/common/icons/ico_tag_society.webp" alt="사회성" class="tag-item">
              <img v-if="item.mainAreaCd === '2'"
                   src="@/assets/img/launcher-readingclub/common/icons/ico_tag_language.webp" alt="언어" class="tag-item">
              <img v-if="item.mainAreaCd === '3'"
                   src="@/assets/img/launcher-readingclub/common/icons/ico_tag_recognition.webp" alt="인지" class="tag-item">
              <img v-if="item.mainAreaCd === '4'"
                   src="@/assets/img/launcher-readingclub/common/icons/ico_tag_emotion.webp" alt="정서" class="tag-item">
              <img v-if="item.mainAreaCd === '5'"
                   src="@/assets/img/launcher-readingclub/common/icons/ico_tag_creativity.webp" alt="창의사고" class="tag-item">
              <img v-if="item.subAreaCd === '1'"
                   src="@/assets/img/launcher-readingclub/common/icons/ico_tag_society.webp" alt="사회성" class="tag-item">
              <img v-if="item.subAreaCd === '2'"
                   src="@/assets/img/launcher-readingclub/common/icons/ico_tag_language.webp" alt="언어" class="tag-item">
              <img v-if="item.subAreaCd === '3'"
                   src="@/assets/img/launcher-readingclub/common/icons/ico_tag_recognition.webp" alt="인지" class="tag-item">
              <img v-if="item.subAreaCd === '4'"
                   src="@/assets/img/launcher-readingclub/common/icons/ico_tag_emotion.webp" alt="정서" class="tag-item">
              <img v-if="item.subAreaCd === '5'"
                   src="@/assets/img/launcher-readingclub/common/icons/ico_tag_creativity.webp" alt="창의사고" class="tag-item">
            </div>
            <div class="tag ar" v-if="currentLanguage === 'E' ">
              <p v-if="item.bookEngStep === 'B'" class="tag-item step basic">Basic</p> <!--단계표시-->
              <p v-if="item.bookEngStep === 'I'" class="tag-item step intermediate">Intermediate</p>
              <p v-if="item.bookEngStep === 'A'" class="tag-item step advanced">Advanced</p>
              <p class="tag-item level">AR {{ item.arLevel }}</p><!--AR표시-->
            </div>
          </div>
        </li>
      </ul>
      <div v-else class="no-data">
        <span class="text-blind">보관된 책이 없습니다</span>
      </div>
    </div>
    <TopButton></TopButton>
    <viewerModal :propsData="{ viewerInfo }" @openBookRun="openBookRun" @openViewerPopup="openViewerPopup"
                 @closeViewerPopup="closeViewerPopup"></viewerModal>
  </div>
</template>
<script>
import moment from "moment";
import readingClubFactory from "@/api/reading-club/readingClub-factory";
import {mapGetters} from "vuex";
import functionMixin from "@/common/mixin/functionMixin";
import viewerMixin from "@/common/mixin/viewerMixin";
import TopButton from '@/components/launcher-readingclub/elements/top-button.vue'
import viewerModal from "@/components/launcher-readingclub/modals/model-viewer.vue";

const myLibrary = readingClubFactory.get('myLibrary');
export default {
  mixins: [
    functionMixin,
    viewerMixin
  ],
  data() {
    return {
      viewerInfo: {
        isModal: false,
        modalType: 'type',
        modalData: {}
      },
      bookListData: [],
      bookTotalCount: 0,
      currentLanguage: 'K',
      currentRead: 'A',
      scrollData: {
        pageIndex: 0,
        pageSize: 15,
        isLoading: false
      },
      isScrollUp: false,
      lastScrollPosition: 0,
    }
  },
  components: {
    viewerModal,
    TopButton
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.getVscanData();
  },
  mounted() {
    this.addInfiniteScroll();
  },
  watch: {
    currentRead(oldState, newState) {
      if (oldState !== newState) {
        this.bookListData = [];
        this.scrollData.pageIndex = 0;
        this.getVscanData();
      }
    },
    currentLanguage(oldValue, newValue) {
      if (oldValue !== newValue) {
        this.bookListData = [];
        this.scrollData.pageIndex = 0;
        this.getVscanData();
      }
    }
  },
  methods: {
    toggleLanguage(language) {
      this.currentLanguage = language;
    },
    addInfiniteScroll() {
      document.querySelector('.content-scroll-area').addEventListener('scroll', this.setInfiniteScroll)
    },
    setInfiniteScroll() {
      if (!this.isLastScroll()) {
        const tg = document.querySelector('.content-scroll-area')
        if (tg.clientHeight + tg.scrollTop >= tg.scrollHeight - 1) {
          if (this.scrollData.isLoading === false) {
            this.scrollData.isLoading = true;
            this.scrollData.pageIndex++;
            this.getVscanData();
          }
        }
      }
    },
    showExpire() {
      this.showToast('V스캔 카메라로 책을 찍어 주세요');
    },
    isExpireWeek(date) {
      return moment(date, "YYYY-MM-DD").diff(moment(), 'days');
    },
    isExpire(date) {
      return date < moment(new Date()).format('YYYY-MM-DD');
    },
    isLastScroll() {
      return this.bookTotalCount === this.bookListData.length;
    },
    getVscanData() {
      const params = {
        studentId: this.userInfo.info.studentId,
        bookDiv: this.currentLanguage,
        readingYn: this.currentRead,
        pageIndex: this.scrollData.pageIndex,
        pageSize: this.scrollData.pageSize
      }
      const storageApi = myLibrary.getVscanList(params);
      storageApi.then((res) => {
        if (res.status === 200 && res.data.data) {
          Array.prototype.push.apply(this.bookListData, res.data.data.items);
          this.bookTotalCount = res.data.data.totalCount;
          this.scrollData.isLoading = false;
        }
      }).catch((error) => {
        console.log(error)
      });

    },
    openAppVscan(rc) {
      const userAgent = navigator.userAgent;
      if (userAgent === 'SuperV-Launcher') {
        // eslint-disable-next-line
        GrowvLauncherBridge.startVScan(rc)
      }
    },
    viewFinalComplete() {
    },
    openBookRun(type) {
      this.mixin_openBookRun(type);
    },
    openViewerPopup(info, item, type) {
      this.viewerInfo.modalData.info = info;
      this.viewerInfo.modalData.item = item;
      this.viewerInfo.modalType = type;
      this.viewerInfo.isModal = true;
    },
    closeViewerPopup(onlyClose) {
      this.viewerInfo.isModal = false;
      if (!onlyClose) {
        this.viewFinalComplete();
      }
    },
    replaceDefault(e) {
      e.target.src = require('@/assets/img/launcher-readingclub/common/thumbnail_default.png')
    }
  }
}
</script>