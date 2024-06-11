<template>
  <div class="library sub eng">
    <div class="sub-gnb">
      <div class="sub-gnb-left">
        <button @click="this.$router.go(-1)" class="btn-back"></button>
      </div>
      <!-- 모션북 모아보기 때만 보임-->
      <h1 v-if="motionbook == null">{{ getEngSubCategory.name }}</h1>
      <h1 v-else>모션북 모아보기</h1>
      <div class="sub-gnb-right gap-0">
        <!-- 내서재 & 검색 -->
        <div class="btn-group">
          <button type="button" class="btn-my-book"><router-link :to="{ name: 'myLibraryTodayBook',query:{'path':'english'} }">내서재</router-link></button>
          <button type="button" class="btn-search-link"><router-link :to="{ name: 'englishLibrarySearch' }">돋보기</router-link></button>
        </div>
        <button type="button" class="btn-close"><router-link :to="{ name: 'ReadingClubMainView' }">close</router-link></button>
      </div>
    </div>

    <!-- // -->
    <div class="contents">
      <div class="select-tab-menu-wrap">
        <!-- 카테고리가 단계별일 때 -->
        <ul v-if="getEngCategory === 'step' && motionbook == null " class="select-tab-list" :class="{'pd-left': isAdvanced}">
          <li v-for="(AR,index) in ARdata[getEngSubCategory.name]" :key="index" @click="toggleArLevel(AR.arLevels)" :class="{ active: currentAR === AR.arLevels}">
            {{ AR.label }}
          </li>
        </ul>
        <!-- 카테고리가 단계별이 아닐 때-->
        <ul v-else-if="getEngCategory !== 'step' && motionbook == null" class="select-tab-list" :class="{'sel' : getEngCategory !== 'step' }">
          <li v-for="(level,index) in selData" :key="index" @click="toggleSelLevel(level.selLevel)" :class="{ active: currentSel === level.selLevel}">
            <!--            {{level.label}}-->
          </li>
        </ul>
        <!--  모션북일 때      -->
        <ul v-else-if="motionbook !== null" class="select-tab-list sel no-high" >
          <li v-for="(level,index) in moitonBookSelData" :key="index" @click="toggleSelLevel(level.selLevel)" :class="{ active: currentSel === level.selLevel}"></li>
        </ul>
        <div class="book-icon"></div>

        <!-- TODO : V모드 적용 도서 체크박스, 모달 버튼 -->
        <div class="input-box-chk border-bd-gray vscan-chk-group">
          <input type="checkbox" id="vmodechk" v-model="isVmode" @change="toggleVmode">
          <label for="vmodechk">V모드 적용 도서</label>
          <button type="button" class="btn-question" @click="toggleVmodal"><i class="ico ico-question-pp"></i></button>
        </div>
      </div>
      <div class="book-list-wrap content-scroll-area">
        <div class="row-group" >
          <ul class="book-list" v-if="bookListData && bookListData.length > 0">
            <li  v-for="(item,index) in bookListData" :key="item" class="list-item">
              <div class="thumb-wrap">
                <span class="sta-book"  :class="{ 'check-read' : item.isRead }"></span> <!-- 읽음표시 -->
                <div class="thumbnail">
                  <img :src="item.thumbUrl" @error="replaceDefault">
                </div>
                <div class="thumb-info">
                  <div class="book-kind">
                    <span :class="{show : item.isMotionBook}" class="motion-book">모션북</span>
                    <span v-if="motionbook == null" :class="{show : item.isEbook}" class="e-book">이북</span> <!-- 모션북 모아보기에서는 이북이 보이지 않음-->
                  </div>
                  <div class="thumb-bottom-right">
                    <span class="ico-guide" v-if="item.isGuide"></span>
                    <button class="save" @click="toggleStorage(index, item.bookId, item.isStorage, 'english')" :class="{ 'save-off' : item.isStorage }"></button> <!-- 담기 &빼기 -->
                  </div>
                </div>
                <div class="view" v-if="motionbook == null" @click="mixin_openBook({ 'path' : 'R', 'entry' : 'EnglishLibrary', 'index' : `${index}` },item)"></div>
                <div class="view" v-if="motionbook" @click="mixin_openBook({ 'path' : 'R', 'entry' : 'EnglishLibrary', 'index' : `${index}`,'motion':'Y' },item)"></div>
              </div>
              <div class="tag-wrap shadow-box">
                <div class="tag ar">
                  <p v-if="item.bookEngStep === 'B'" class="tag-item step basic">Basic</p> <!--단계표시-->
                  <p v-if="item.bookEngStep === 'I'" class="tag-item step intermediate">Intermediate</p>
                  <p v-if="item.bookEngStep === 'A'" class="tag-item step advanced">Advanced</p>
                  <p class="tag-item level">AR {{item.arLevel}}</p><!--AR표시-->
                </div>
              </div>
            </li>
          </ul>
          <div v-show="bookTotalCount === 0" class="no-data"><span></span></div>
        </div>
      </div>
      <TopButton></TopButton>
    </div>

    <!-- TODO : V 모드 보기 안내 팝업 -->
    <div class="info-pop-wrap pos-fixed" v-show="isVmodeShow">
      <div class="guide-content guide-vmode">
        <button type="button" class="btn-close" @click="toggleVmodal"><!-- 툴팁 닫기 --></button>
        <div class="contents">
          <img src="@/assets/img/launcher-readingclub/guide/guide_vmode.webp" alt="V 모드란?">
        </div>
      </div>
    </div>

    <viewerModal :propsData="{ viewerInfo }" @openBookRun="openBookRun" @openViewerPopup="openViewerPopup" @closeViewerPopup="closeViewerPopup"></viewerModal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import readingClubFactory from "@/api/reading-club/readingClub-factory";
import functionMixin from "@/common/mixin/functionMixin";
import viewerMixin from "@/common/mixin/viewerMixin";
import TopButton from '@/components/launcher-readingclub/elements/top-button.vue'
import viewerModal from "@/components/launcher-readingclub/modals/model-viewer.vue";

const englishLibraryApi = readingClubFactory.get('englishLibrary')
export default {
  mixins: [functionMixin , viewerMixin ],
  data() {
    return {
      viewerInfo : {
        isModal : false,
        modalType : 'type',
        modalData : {}
      },
      bookListData: [],
      motionbook: null,
      isStorage: true,
      currentAR:'',
      currentSel:0,
      isScrollUp: false,
      lastScrollPosition: 0,
      pageIndex:1,
      bookTotalCount:0,
      isLoading : false,
      //API params에 넣어줄 searchValue값
      setSearchValue: '',
      isAdvanced:false,
      ARdata:{
        Basic:[
          {
            arLevels:'',
            label:'ALL'
          },
          {
            arLevels:'0~0.5',
            label:'AR 0~0.5'
          },
          {
            arLevels:'0.6~1.0',
            label:'AR 0.6~1.0'
          },
          {
            arLevels:'1.1~1.5',
            label:'AR 1.1~1.5'
          },
          {
            arLevels:'1.6~1.8',
            label:'AR 1.6~1.8'
          },
        ],
        Intermediate:[
          {
            arLevels:'',
            label:'ALL'
          },
          {
            arLevels:'1.0~1.5',
            label:'AR 1.0~1.5'
          },
          {
            arLevels:'1.6~2.0',
            label:'AR 1.6~2.0'
          },
          {
            arLevels:'2.1~2.5',
            label:'AR 2.1~2.5'
          },
          {
            arLevels:'2.6~3.0',
            label:'AR 2.6~3.0'
          },
        ],
        Advanced:[
          {
            arLevels:'',
            label:'ALL'
          },
          {
            arLevels:'2.7~3.0',
            label:'AR 2.7~3.0'
          },
          {
            arLevels:'3.1~3.5',
            label:'AR 3.1~3.5'
          },
          {
            arLevels:'3.6~4.0',
            label:'AR 3.6~4.0'
          },
          {
            arLevels:'4.1~4.5',
            label:'AR 4.1~4.5'
          },
          {
            arLevels:'4.6~',
            label:'AR 4.6~'
          },
        ]
      } ,
      selData:[
        {
          selLevel:0,
          label:'ALL'
        },
        {
          selLevel:1,
          label:'SEL1'
        },
        {
          selLevel:2,
          label:'SEL2'
        },
        {
          selLevel:3,
          label:'SEL3'
        },
        {
          selLevel:4,
          label:'SEL4'
        },
        {
          selLevel:5,
          label:'SEL5'
        },
        {
          selLevel:6,
          label:'SEL6'
        },
      ],
      moitonBookSelData:[
        {
          selLevel:0,
          label:'ALL'
        },
        {
          selLevel:1,
          label:'SEL1'
        },
        {
          selLevel:2,
          label:'SEL2'
        },
        {
          selLevel:3,
          label:'SEL3'
        },
      ],
      isVmode : false,
      isVmodeShow : false
    };
  },
  components : {
    viewerModal,
    TopButton
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapGetters('englishLibraryStorage', [
      'getEngCategory',
      'getEngSubCategory',
      'getSelLevel'
    ]),
  },
  watch: {
    'currentSel'(oldValue,newValue) {
      if(oldValue !== newValue){
        this.bookListData = [];
        this.pageIndex = 1;
        if(this.motionbook){
          this.getMotion()
        }else this.getEngLibrary();
      }
    },
    'currentAR'(oldValue,newValue) {
      if(oldValue !== newValue){
        this.bookListData = [];
        this.pageIndex = 1;
        this.getEngLibrary();
      }
    }
  },
  created() {
    this.motionbook = this.$route.query?.name;
    this.studentId = this.userInfo.info.studentId;
    if(this.getEngSubCategory.name === 'Advanced'){
      this.isAdvanced = true
    }
  },
  mounted() {
    this.translateSearchValue();
    //모션북 모아보기 일 경우
    if(this.motionbook !== undefined){
      this.getMotion();
      //그 외 모든 조회
    }else {
      this.currentSel = this.getSelLevel;
      this.getEngLibrary();
    }
    // this.showTopBtn();
    this.addInfiniteScroll();
  },
  methods: {
    addInfiniteScroll() {
      document.querySelector('.content-scroll-area').addEventListener('scroll',this.setInfiniteScroll)
    },
    setInfiniteScroll() {
      if (!this.isLastScroll()) {
        const element = document.querySelector('.content-scroll-area')
        if (element.clientHeight + element.scrollTop >= element.scrollHeight-1) {
          if (this.isLoading === false) {
            this.isLoading = true;
            this.pageIndex++;
            if(this.motionbook){
              this.getMotion();
            }else this.getEngLibrary();
          }
        }
      }
    },
    isLastScroll() {
      return this.bookTotalCount === this.bookListData.length;
    },
    getEngLibrary() {
      const params = {
        searchType: this.translateType(this.getEngCategory),
        searchValue: this.setSearchValue,
        studentId: this.studentId,
        arLevels: this.currentAR,
        selStep: this.currentSel,
        pageSize:15,
        pageIndex:this.pageIndex,
        vmodeYn:this.isVmode ? 'Y' : 'N'
      }
      const libraryData = englishLibraryApi.getEngLibraryData(params);
      libraryData.then((res) => {
        Array.prototype.push.apply(this.bookListData, res.data.data.items);
        this.bookTotalCount = res.data.data.totalCount;
        this.isLoading = false;

        // 스크롤 추가로 + 150
        if (this.pageIndex !== 1) {
          const element = document.querySelector('.content-scroll-area')
          let t = element.scrollTop;
          setTimeout(function () {
            element.scrollTo({top: t + 150, behavior: 'smooth'})
          }, 10);
        }
      }).catch((err) => { console.log(err) })
    },
    //모션북 모아보기 api
    getMotion() {
      const params = {
        selStep: this.currentSel,
        studentId: this.studentId,
        pageSize: 15,
        pageIndex: this.pageIndex,
        vmodeYn:this.isVmode ? 'Y' : 'N'
      }
      const motionData = englishLibraryApi.getEngMotion(params);
      motionData.then((res) => {
        Array.prototype.push.apply(this.bookListData, res.data.data.items);
        this.bookTotalCount = res.data.data.totalCount;
        this.isLoading = false;

        // 스크롤 추가로 + 150
        if (this.pageIndex !== 1) {
          const element = document.querySelector('.content-scroll-area')
          let t = element.scrollTop;
          setTimeout(function () {
            element.scrollTo({top: t + 150, behavior: 'smooth'})
          }, 10);
        }
      }).catch((err) => { console.log(err) })

    },
    toggleArLevel(level) {
      this.currentAR = level;
    },
    toggleSelLevel(level) {
      this.currentSel = level
    },
    translateType(type) {
      let label = '';
      switch (type) {
        case 'step' :
          label = 'bookEngStep';
          break;
        case 'theme' :
          label = 'brancheEng';
          break;
        case 'keyword' :
          label = 'keyword';
          break;
        case 'pub' :
          label = 'publisherEng';
          break;
      }
      return label
    },
    //단계별일 경우 각 단계별에 해당하는 글자로 바꿔서 넣어주기, 그 외는 id값
    translateSearchValue() {
      if(this.getEngCategory === 'step') {
        const name = this.getEngSubCategory.name === 'Basic' ? 'B' : this.getEngSubCategory.name === 'Intermediate' ? 'I' : 'A'
        this.setSearchValue = name
      }else this.setSearchValue = this.getEngSubCategory.id;
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
        // this.getEngLibrary();
        // this.getMotion();
      }
    },
    replaceDefault(e) {
      e.target.src = require('@/assets/img/launcher-readingclub/common/thumbnail_default.png')
    },
    toggleVmode() {
      this.bookListData = [];
      this.pageIndex = 1;
      if(this.motionbook !== undefined){
        this.getMotion();
      } else {
        this.currentSel = this.getSelLevel;
        this.getEngLibrary();
      }
      setTimeout(function () {
        document.querySelector('.content-scroll-area').scrollTo({top: 0})
      }, 1000);
    },
    toggleVmodal() {
      this.isVmodeShow = !this.isVmodeShow;
    }
  },
};
</script>
