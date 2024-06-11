<template>
  <!-- 리딩 클럽 메인 -->
  <!--  TODO : 임시 구성 및 스타일 -->
  <div class="rc-main-contents" ref="mainPage">
    <div>
      <mainGnb :propsData="{ gateInfo }" @showGatePopup="showGatePopup"></mainGnb>
    </div>
    <!-- Main Content -->
    <div class="main-contents">
      <!-- Left Content -->
      <div class="contents-left">
        <div class="btns-wrap v-scan-div">
          <div class="link-book">
            <button type="button" class="mylib">
              <router-link :to="{name: 'myLibraryTodayBook'}">내 도서관</router-link>
            </button>
          </div>
          <div class="link-search">
            <button type="button" class="vscan" @click="openAppVscan"></button>
            <button type="button" class="vscan-set" @click="openAppVscanSetting"></button>
            <button type="button" class="vscan-guide" @click="openAppVscanGuide"></button>
            <button type="button" class="vscan-search"><router-link :to="{name: 'searchMain'}"></router-link></button>
          </div>
        </div>
        <button type="button" class="link-superpick"
                :style="{ backgroundImage : 'url(' + superPickImage + ')'}">
          <router-link :to="{ name : 'superpickMain' }">슈퍼픽</router-link>
        </button>
      </div>
      <!-- Center Content -->
      <div class="contents">
        <div class="date">
          <button type="button" class="link-schedule">
            <router-link :to="{ name : 'readingStatusActiveCalendar' }">img</router-link>
          </button>
          <span>
            {{ todayDate }} {{ dayOfTheWeek }}
          </span>
        </div>
        <div class="daily">
          <div class="title">
            <div>
              <span class="title-name txt-ellipsis single-line">
                {{ userInfo.info.studentName }}
              </span>
              <img src="@/assets/img/launcher-readingclub/main/tit_todaybook.webp" alt="오늘의 책">
            </div>
          </div>
          <div class="daily-book content-scroll-area">
            <div class="list" v-if="bookList && bookList.length > 0">
              <div class="list-item"
                   v-for="(item, index) in bookList" :key="index"
                   :class="{ 'complete' : item.isRead, 'study-no' : !item.isRead}">
                <span class="line"></span>
                <div class="thumb">
                  <img :src="item.todayThumbUrl" :alt="item.bookId" @error="replaceDefaultToday">
                  <div v-if="item.bookVerDiv" class="flag day size-big">
                     <span class="txt-data">
                       {{ item.bookVerDiv === 'D1' ? 'Day 1' : 'Day 2' }}
                     </span>
                  </div>
                  <div class="tag-wrap" :class="[{'rounded-tail-shadow-ar':item.bookDiv === 'E'}, {'rounded-vertical-developer':item.bookDiv === 'K'}]">

                    <!-- TODO : 오늘의책 영역,단계 노출 (국문 : tag.develop, 영문 : tag.ar) -->
                    <div class="tag develop" v-if="item.bookDiv === 'K'">
<!--                      <p class="tag-item general">종합발달</p>-->
                      <p v-show ="item.mainAreaCd === '1'" class="tag-item sociality">사회성발달</p>
                      <p v-show ="item.mainAreaCd === '2'" class="tag-item language">언어발달</p>
                      <p v-show="item.mainAreaCd === '3'" class="tag-item recognition">인지발달</p>
                      <p v-show="item.mainAreaCd === '4'" class="tag-item emotion">정서발달</p>
                      <p v-show ="item.mainAreaCd === '5'" class="tag-item creativity">창의사고력</p>

                    </div>
                    <div class="tag ar" v-if="item.bookDiv === 'E'">
                      <p v-show ="item.bookEngStep === 'B'" class="tag-item step basic">Basic</p>
                      <p v-show ="item.bookEngStep === 'I'" class="tag-item step intermediate">Intermediate</p>
                      <p v-show ="item.bookEngStep === 'A'" class="tag-item step advanced">Advanced</p>
                    </div>
                  </div>
                </div>
                <span v-if="item.isRead" class="flag-complete"></span>
                <span class="pin"></span>
                <button type="button" class="re-view"
                        @click="mixin_openBook({ 'path' : 'T', 'entry' : 'TodayBook', 'index' : `${index}` }, item)">
                </button>
              </div>
            </div>
            <div v-else class="no-data"></div>
          </div>
        </div>
      </div>
      <!-- Right Content -->
      <div class="contents-right">
        <div class="reading-tree">
          <!-- 자람나무 현재 년도의 메인 지도로 연결 -->
          <router-link :to="`/my-tree/`">
            <img :src="treeCurrentImage" v-if="treeCurrentImage">
            <p class="total">읽은 책 <img src="@/assets/img/launcher-readingclub/main/ico_txt_dot.webp" alt="">
              총 {{ insertDotNumber(bookReadCount.readTotalCount.vscanCnt + bookReadCount.readTotalCount.readCnt) }}권
            </p>
          </router-link>
          <span class="bg-title"></span>
          <span class="bg-evie"></span>
        </div>
        <div class="slide-wrap">
          <div class="slide">
            <div class="slide-tab">
              <button type="button" class="kor" :class="{ active : currentPopularTab === 'kor'}"
                      @click="togglePopularTab('kor')"></button>
              <button type="button" class="eng hide-eng" :class="{ active : currentPopularTab === 'eng'}"
                      @click="togglePopularTab('eng')"></button>
            </div>
            <ul class="slide-list" v-show="currentPopularTab === 'kor'">
              <li v-for="(item, index) in bookListPopular.kor" :key="index" class="list-item">
                <button type="button" class="re-view"
                        @click="mixin_openBook({ 'path' : 'R', 'entry' : 'KoreanLibrary', 'index' : `${index}` }, item)">
                  <img :src="item.thumbUrl" @error="replaceDefault" @load="loadImage" :alt="item.bookNm">
                </button>
              </li>
            </ul>
            <ul class="slide-list" v-show="currentPopularTab === 'eng'">
              <li v-for="(item, index) in bookListPopular.eng" :key="index" class="list-item" >
                <button type="button" class="re-view"
                        @click="mixin_openBook({ 'path' : 'R', 'entry' : 'EnglishLibrary', 'index' : `${index}` }, item)">
                  <img :src="item.thumbUrl" @error="replaceDefault" :alt="item.bookNm">
                </button>
              </li>
            </ul>
          </div>
          <button type="button" class="btn-open" @click="togglePopularSlide()"></button>
        </div>
        <!-- TODO: slide-wrap이 열리면 active 클래스 추가필요       -->
        <span class="move-bg" @click="togglePopularSlide"></span>
      </div>
    </div>
  </div>
  <!-- 메인 로딩 -->
  <div class="reading-loading-wrap" v-if="isLoading">
    <ul class="reading-loading-list">
      <li><img src="@/assets/img/launcher-readingclub/common/profile_thumb/profile_thumb_su.webp" alt="su"></li>
      <li><img src="@/assets/img/launcher-readingclub/common/profile_thumb/profile_thumb_wi.webp" alt="wi"></li>
      <li><img src="@/assets/img/launcher-readingclub/common/profile_thumb/profile_thumb_de.webp" alt="de"></li>
      <li><img src="@/assets/img/launcher-readingclub/common/profile_thumb/profile_thumb_ev.webp" alt="ev"></li>
      <li><img src="@/assets/img/launcher-readingclub/common/profile_thumb/profile_thumb_ne.webp" alt="ne"></li>
    </ul>
  </div>
  <viewerModal :propsData="{ viewerInfo }" @openBookRun="openBookRun" @openViewerPopup="openViewerPopup" @closeViewerPopup="closeViewerPopup"></viewerModal>
  <studyModal v-if="gateInfo.isModal && gateInfo.modalType === 'study'" :propsData="{ gateInfo }" @closeGatePopup="closeGatePopup"></studyModal>
  <readingModal v-if="gateInfo.isModal && gateInfo.modalType === 'reading'" :propsData="{ gateInfo }" @closeGatePopup="closeGatePopup"></readingModal>
  <complimentModal v-if="isComplimentModal" @closeComplimentPopup="closeComplimentPopup"></complimentModal>
<!--  <modal-event-propmotion v-if="isEventModal" @closePromotion="closePromotion"/>-->
</template>

<script>
import moment from "moment/moment";
import mainGnb from './main-gnb';
import studyModal from '@/components/launcher-readingclub/modals/parts/consulting-superv-modal.vue';
import readingModal from '@/components/launcher-readingclub/modals/parts/consulting-reading-modal.vue';
import viewerModal from '@/components/launcher-readingclub/modals/model-viewer.vue';
import complimentModal from '@/components/launcher-readingclub/modals/parts/viewer-compliment-modal.vue'
import numberMixin from '@/common/mixin/numberMixin';
import viewerMixin from "@/common/mixin/viewerMixin";
import readingClubFactory from "@/api/reading-club/readingClub-factory";
// import ModalEventPropmotion from "@/components/launcher-readingclub/modals/modal-eventPropmotion.vue";

import {mapGetters, mapMutations} from "vuex";

const mainBook = readingClubFactory.get('mainBook')
const userProductApi =readingClubFactory.get('gate')
export default {
  inheritAttrs: false,
  mixins: [numberMixin, viewerMixin],
  components: {
    mainGnb,
    studyModal,
    readingModal,
    viewerModal,
    complimentModal,
    // ModalEventPropmotion
  },
  data() {
    return {
      gateInfo : {
        isModal : false,
        modalType : 'study',
        modalData : {}
      },
      gateData : {},
      gatePropData : {},
      viewerInfo : {
        isModal : false,
        modalType : 'type',
        modalData : {}
      },
      bookList: null,
      bookListNext : 0,
      bookListPopular: {
        eng: [],
        kor: []
      },
      bookReadCount: {
        readTotalCount: {
          readCnt: 0,
          vscanCnt: 0
        },
        listMissionLevelImg: null
      },
      completedInfo : { // 칭찬팝업 관련
        engBookCnt: 0, //영어책 개수
        korBookCnt: 0, //한글책 개수
        readEngBookId: 0, //완독 영어책
        readKorBookId: 0, //완독 힌글책
      },
      isComplimentModal: false,
      currentPopularTab: 'kor',
      todayDate: '',
      superPickImage: '',
      studentId: null,
      parentId: null,
      treeCurrentImage: '',
      isStudyFirst: false,
      isLoading : true,
      imgLoaded : 0,
      isEventModal: false,
      checkEventModal: false
    }
  },
  watch: {
    $route() {
      this.setVscanResult();

    },
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapGetters('readingStorage',['getIsEnglishMember']),
    dayOfTheWeek() {
      const weeks = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
      return weeks[moment(new Date()).day()];
    }
  },
  created() {
    this.studentId = this.userInfo.info.studentId;
    this.parentId = this.userInfo.info.parentId;
    this.getGateInfo();
  },
  mounted() {
    this.setVscanResult();
    this.getTotalReadingTree();
    this.setCurrentDate();
    this.$nextTick(() => {
      this.getPopularBookSuperpick();
      setTimeout(() => {
        this.isLoading = false;
      },2500);

      setTimeout(() => {
        if(!document.querySelector('.attend')) this.openEventPopup();
      },1000)
    });
  },
  methods: {
    openEventPopup() {
      if(this.$route.name !== 'ReadingClubMainView' || (this.gatePropData.supervread_subscribe_yn === 'N')) return; //메인 페이지에서만 함수가 실행되도록
      if(!this.checkEventModal) {
          this.checkPopup();
          this.checkEventModal = true;
      }
    },

    // 프로모션 팝업 쿠키 체크
    checkPopup() {
      // 쿠키 체크
      const cookiedata = document.cookie;
      if ( cookiedata.indexOf("isPromotionPopup=active") < 0 ){
        this.isEventModal = true;
      }
    },
    //사용자 구매상품 확인
    getGateInfo() {
      const params = {
        "student_id" : this.studentId
      }
      const userType = userProductApi.getUserProduct(params);
      userType.then((res) => {
        this.gateData = res.data.data;
        this.setGateInfo();
        this.getTodayBook();
      }).catch((err) => {
        console.log(err);
        this.gateInfo.modalData.NOT_USER = true;
        this.showGatePopup('reading');
      });
    },
    setGateInfo() {
      const studyIdx = this.gateData.userProducts.findIndex(item => item.name === 'study'),
        readingIdx = this.gateData.userProducts.findIndex(item => item.name === 'superReading');
      this.gatePropData = {
        "supervstudy_subscribe_yn" : studyIdx > -1 ? 'Y' : 'N',
        "supervstudy_subscribe_div" : studyIdx === -1 ? 'N' : (this.gateData.userProducts[studyIdx].level === 'trial') ? 'F' : 'C',
        "supervread_subscribe_yn" : readingIdx > -1 ? 'Y' : 'N',
        "supervread_subscribe_div" : readingIdx === -1 ? 'N' : (this.gateData.userProducts[readingIdx].level === 'trial') ? 'F' : 'C'
      }
      // 스터디 FC / 무체 N 일 때 리딩 가이드
      if (this.gatePropData.supervstudy_subscribe_yn === 'Y' && this.gatePropData.supervread_subscribe_yn === 'N') {
        this.showGatePopup('reading');
      }
      // 스터디 N / 리딩 C 일 때 스터디 가이드
      if (this.$route.query.entryPoint === 'gate' && this.$route.query.selectedButton === 'study') {
        if (this.gatePropData.supervstudy_subscribe_yn === 'N' && this.gatePropData.supervread_subscribe_yn === 'Y' && this.gatePropData.supervread_subscribe_div === 'C') {
          this.showGatePopup('study');
        }
      }
      // 모두 회원 아닐 경우
      if (this.gatePropData.supervstudy_subscribe_yn === 'N' && this.gatePropData.supervread_subscribe_yn === 'N') {
        this.showGatePopup('reading');
      }
      this.gateInfo.modalData = this.gatePropData;
    },
    showGatePopup(type) {
      this.gateInfo.modalType = type;
      this.gateInfo.isModal = true;
    },
    closeGatePopup() {
      this.gateInfo.isModal = false;
    },
    ...mapMutations('vscanStorage', ['updateVscanBookInfo']),
    setVscanResult() {
      if (this.$route.query.bookId) {
        const params = {
          studentId : this.studentId,
          parentId: this.parentId,
          accessToken: 'Bearer ' + localStorage.getItem("accessToken"),
          bookDiv: null
        }
        const getData = mainBook.getVscanInfo(this.$route.query.bookId, params);
        getData.then((res) => {
          if (res.data.data) {
            const buy = res.data.data.isBuy;
            this.updateVscanBookInfo(res.data.data);
            // 무료체험 책일 경우
            if (res.data.data.sbBooks.items[0].bookId < 0) {
              this.mixin_openBook({ "path" : "S", "entry" : 'VScan', "isFree" : "1" }, res.data.data.sbBooks.items[0]);
              return;
            }
            // 구매한 책일 경우
            if (buy) {
              this.mixin_openBook({ "path" : "S", "entry" : 'VScan' }, res.data.data.sbBooks.items[0]);
            } else {
              // 구매안한 책일 경우
              this.$router.push({name : 'vscanCheck' , params : { id : this.$route.query.retryCount }})
            }
          }
        }).catch((err) => {
          console.log(err)
        });
      }
    },
    goToSlide(idx) {
      this.bookListNext = this.bookList.findIndex(item => !item.isRead);
      if (this.bookListNext >= 0) {
        setTimeout(() => {
          if (document.querySelectorAll('.list-item')[idx]) {
            const eleTop = document.querySelectorAll('.list-item')[idx].offsetTop;
            document.querySelector('.daily-book').scrollTo({top: eleTop - 20, behavior: 'smooth'});
          }
        }, 1200);
      }
    },
    closeVscanPopup() {
      this.vscanInfo.isModal = false;
    },
    setCurrentDate() {
      this.todayDate = moment(new Date()).locale('ko').format('M월 D일');
    },
    // 인기도서 탭
    togglePopularTab(lang) {
      this.currentPopularTab = lang;
    },
    togglePopularSlide() {
      document.querySelector('.slide-wrap').classList.toggle("move");
      document.querySelector('.move-bg').classList.toggle("active");
    },
    // 1일 1권
    getTodayBook() {
      const getData = mainBook.getTodayBook({studentId: this.studentId})
      getData.then((res) => {
        if (res.status === 200 && res.data.data) {
          const readingEngIdx = this.gateData.userProducts.findIndex(item => item.name === 'superReadingEng');
          if (readingEngIdx > -1) {
            this.bookList = res.data.data.items;
          } else {
            this.bookList = res.data.data.items.filter(item => item.bookDiv === 'K')
          }
          // this.bookList = res.data.data.items;
          this.checkAllRead();

          this.bookListNext = this.bookList.findIndex(item => !item.isRead);
          this.checkReadBook(res.data.data);

          if (this.bookListNext > 0) {
            this.goToSlide(this.bookListNext);
          }
        }
      }).catch((err) => {
        console.log(err)
      });
    },
    // 메인슈퍼픽 & 인기도서 api
    getPopularBookSuperpick() {
      const getData = mainBook.getPopularBookSuperpick({studentId: this.studentId});
      getData.then((res) => {
        if (res.status === 200) {
          this.superPickImage = res.data.data.pick !== null ? res.data.data.pick.mainImageFileUrl : '';
          this.bookListPopular.kor = res.data.data.listSuggestKor.items !== null ? res.data.data.listSuggestKor.items : [];
          this.bookListPopular.eng = res.data.data.listSuggestEng.items !== null ? res.data.data.listSuggestEng.items : [];
          this.shuffleTab();
          this.shuffleItems();
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    shuffleTab() {
      if (this.getIsEnglishMember) {
        this.currentPopularTab = Math.random() < 0.5 ? 'kor' : 'eng';
      }
    },
    shuffleItems() {
      this.bookListPopular.kor = this.bookListPopular.kor.sort(() => Math.random() - 0.5).slice(0,5);
      this.bookListPopular.eng = this.bookListPopular.eng.sort(() => Math.random() - 0.5).slice(0,5);
    },
    loadImage() {
      this.imgLoaded++;
      if (this.bookListPopular.kor.length === this.imgLoaded) {
        this.isLoading = false;
      }
    },
    getTotalReadingTree() {
      const getData = mainBook.getTotalReadingTree(this.studentId)
      getData.then((res) => {
        this.bookReadCount = res.data.data;
        this.treeCurrentImage = (this.bookReadCount.missionCnt) <= 15 ? this.bookReadCount.listMissionLeveImg[0] : (this.bookReadCount.missionCnt >= 41) ? this.bookReadCount.listMissionLeveImg[2] : this.bookReadCount.listMissionLeveImg[1];
        if (!this.bookReadCount.missionCnt || this.bookReadCount.missionCnt === 0) {
          this.treeCurrentImage = this.bookReadCount.listMissionLeveImg[0];
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    checkReadBook(res) {
      const data = {
        engBookCnt: 0,
        korBookCnt: 0,
        readEngBookId: [],
        readKorBookId: []
      };

      res.items.forEach(item => {
        if (item.bookDiv === 'E') {
          data.engBookCnt++;
          if (item.isRead) data.readEngBookId.push(item.bookId);
        } else if (item.bookDiv === 'K') {
          data.korBookCnt++
          if (item.isRead) data.readKorBookId.push(item.bookId);
        }
      });
      this.completedInfo = data;
    },
    /*칭찬모달 오픈여부*/
    openComplimentPopup() {
      if(this.viewerInfo.modalData.info.isRead) {
        if(this.viewerInfo.modalData.item.bookDiv === 'K') {
          //완료 독서에 없는 책일 때만 카운팅 해주기
          if (this.completedInfo.readKorBookId.indexOf(this.viewerInfo.modalData.item.bookId) === -1) {
            let readCnt = this.completedInfo.readKorBookId.length
            readCnt++
            if (readCnt === this.completedInfo.korBookCnt) {
              this.isComplimentModal = true;
              this.completedInfo.readKorBookId.push(this.viewerInfo.modalData.item.bookId);
            }
          }
        }
        if (this.viewerInfo.modalData.item.bookDiv === 'E') {
          //완료 독서에 없는 책일 때만 카운팅 해주기
          if (this.completedInfo.readEngBookId.indexOf(this.viewerInfo.modalData.item.bookId) === -1) {
            let readCnt = this.completedInfo.readEngBookId.length
            readCnt++
            if (readCnt === this.completedInfo.engBookCnt) {
              this.isComplimentModal = true;
              this.completedInfo.readEngBookId.push(this.viewerInfo.modalData.item.bookId);
            }
          }
        }
      }

    },
    openAppVscan(rc) {
      const userAgent = navigator.userAgent;
      if (userAgent === 'SuperV-Launcher') {
        // eslint-disable-next-line
        GrowvLauncherBridge.startVScan(rc)
      }
    },
    openAppVscanSetting() {
      const userAgent = navigator.userAgent;
      if (userAgent === 'SuperV-Launcher') {
        // eslint-disable-next-line
        GrowvLauncherBridge.startVScanSettings();
      }
    },
    openAppVscanGuide() {
      const userAgent = navigator.userAgent;
      if (userAgent === 'SuperV-Launcher') {
        // eslint-disable-next-line
        GrowvLauncherBridge.startVScanGuide();
      }
    },
    checkAllRead() {
      if (this.bookList.every(item => item.isRead)) {
        document.querySelector('.slide-wrap').classList.add("active");
      }
    },
    viewFinalComplete() {
      if (this.viewerInfo.modalData.info.isRead) {
        // 오늘의 책 완독시 셔플처리
        this.shuffleTab();
        this.shuffleItems();
        // 오늘의 책 모두 완독시 모션처리
        this.checkAllRead();
        const result = this.bookList.findIndex((item) => {
          return !item.isRead;
        });
        if (result >= 0) {
          this.goToSlide(result);
        }
      }
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
        this.openComplimentPopup();
        if(!this.isComplimentModal) this.viewFinalComplete();
      }
    },
    //이벤트 프로모션 모달
    closePromotion(noPopup) {
      if (noPopup) {
        var todayDate = new Date();
        todayDate.setDate( todayDate.getDate() + 1 );
        document.cookie = "isPromotionPopup=active;path=/;expires=" + todayDate.toGMTString() + ";"
      }
      this.isEventModal = false;
    },
    closeComplimentPopup() {
      this.isComplimentModal = false;
      this.viewFinalComplete();
    },
    replaceDefaultToday(e) {
      e.target.src = require('@/assets/img/launcher-readingclub/common/thumbnail_today_default.png')
    },
    replaceDefault(e) {
      e.target.src = require('@/assets/img/launcher-readingclub/common/thumbnail_default.png')
    },
  }
}
</script>

<style>
.slide-wrap.active {
  animation : bounceVertical 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) 0s infinite alternate;
}
.rc-main-contents .main-contents > div .slide-wrap.move {
  animation: none !important;
}
@keyframes bounceVertical {
  0% {
    transform : translate3d(65.88%, 0, 0)
  }
  100% {
    transform : translate3d(64%, 0, 0)
  }
}
</style>