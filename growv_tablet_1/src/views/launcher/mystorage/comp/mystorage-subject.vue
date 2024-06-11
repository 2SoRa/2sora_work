<template>
  <!-- 최근학습은 study, 보관함은 storage -->
  <div class="contents-wrap" :class="[{'study' : storageId === 'study'}, {'storage' : storageId === 'store'}]">
    <div class="contents" :class="{ 'no-data' : listData.length === 0 }">
      <!-- 월 변경 & 모션북 정보 -->
      <dateArea :firstExpDt="firstExpDt" @changeDate="changeDate"></dateArea>
      <!-- 리스트 과목별로 클래스 따로 주면 그에따라 완료 표시 다르게뜸
       ㄴ 영어 : eng
       ㄴ 수학 : math
       ㄴ 한글: ko
       ㄴ 특별학습 : spe -->
      <div class="study-list" v-if="listData.length !== 0" :class="[{ eng : subId == '영어' }, { math : subId == '수학' }, { ko : subId == '한글' }, { spe : subId == '특별학습' }]">
        <ul>
          <li v-for="item in listData" :key="item">
            <div class="list-item">
              <div class="thumb">
<!--                <img v-if="!item.imageUrl" src="@/assets/img/launcher/storage/cmm_thumb_01_default@2x.webp" alt="default_img" @click="openContents(item)">-->
                <img :src="item.imageUrl" alt="thumb_img" @error="replaceDefault" @click="openContents(item)">
                <!-- complete 클래스 추가시 학습 완료 -->
                <div class="num" :class="{ complete :  item.actYn == 'Y' || !item.actYn }">{{ item.lecture_session.padStart(2, '0') }}</div>
                <div class="thumb-bottom-right">
                  <span class="ico-guide" v-if="item.guideYn === 'Y'"></span>
                  <button class="save" v-if="item.storageYn === 'N' && storageId === 'study'" @click="addToInventory(item)"></button> <!-- 담기 -->
                  <button class="save save-off" v-else @click="delToInventory(item)"></button> <!-- 빼기 -->
                </div>
              </div>
              <!-- 스토리일때 story 클래스 추가 영어일때 스토리만 작가가 나옴 -->
              <p class="title" :class="{ story : item.lectureAuthorNm }">
                <span>{{ item.study_lecture_nm }}</span>
                <span class="author"><i>{{ item.lectureAuthorNm }}</i></span>
              </p>
            </div>
          </li>
        </ul>
      </div>
      <img class="study-no-data" v-if="listData.length === 0" src="@/assets/img/launcher/storage/stg_none_ret_01@2x.webp" alt="최근학습_학습_X">
      <img class="storage-no-data" v-if="listData.length === 0" src="@/assets/img/launcher/storage/stg_none_stg_01@2x.webp" alt="보관함_학습_X">
    </div>
    <button class="btn-top" :class="{ show : isScrollUp }" @click="moveTop"></button>
    <!-- TODO: 임시버튼
    <button style="width: 100px; height: 100px; background-color: skyblue; position: absolute; top:0; left: 0;" @click="openStudyInfoPopup"></button>-->

  <studyInfoModal :propsData="{studyInfoShowModal}" @closePopup="closeStudyInfoPopup"></studyInfoModal>
  </div>
</template>

<script>
import dateArea from './comp-date-area';
import moment from "moment/moment";
import mystorageFactory from '@/api/mystorage-factory';
import {mapGetters} from "vuex";
import studyInfoModal from "@/views/launcher/mystorage/comp/comp-mystorage-popup/study-info-popup.vue";

const mystorageCode = mystorageFactory.get('mystorageCode');

export default {
  props: ['subId', 'storageId'],
  data() {
    return {
      year: '',
      month: '',
      firstExpDt: '',
      isScrollUp: false,
      lastScrollPosition: 0,
      listData: [],
      stopData : ['506','507','508','509','510','512'],
      studyInfoShowModal: false,
    }
  },
  components: {
    studyInfoModal,
    dateArea,
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created() {
    this.setCurrentDate();
    this.changeDate();
  },
  mounted() {
    this.showTopBtn();

    if (this.storageId == 'study') {
      this.getStudyList();
    } else {
      this.getStoreList();
    }
  },
  watch: {
    'year'(newValue, oldValue) {
      this.getList(newValue, oldValue);
    },
    'month'(newValue, oldValue) {
      this.getList(newValue, oldValue);
    },
    'subId'(newValue, oldValue) {
      this.getList(newValue, oldValue);
    },
    'storageId'(newValue, oldValue) {
      this.getList(newValue, oldValue);
    },
  },
  methods: {
    // 최근학습, 보관함 별 리스트 호출 분기처리 함수
    getList(newValue, oldValue) {
      if (newValue != oldValue && oldValue) {
        if (this.storageId == 'study') {
          this.getStudyList();
        } else {
          this.getStoreList();
        }
      }
    },

    // 현재 날짜로 세팅
    // created에선 getters가 더 늦게 불러와질 때가 있어서 local에 있는 내용으로 진행
    setCurrentDate() {
      let localMystorage = JSON.parse(localStorage.getItem('vuex')).mystorageStorage;
      const today = moment().format('YYYY-M');
      const currentYear = moment().format('YYYY');
      const currnetMonth = moment().format('M');

      this.today = today;

      if (!localMystorage.year || localMystorage.year === '' || localMystorage.year == undefined) {
        this.year = Number(currentYear);
      } else {
        this.year = localMystorage.year;
      }

      if (!localMystorage.month || localMystorage.month === '' || localMystorage.month == undefined) {
        this.month = Number(currnetMonth);
      } else {
        this.month = localMystorage.month;
      }
    },
    changeDate(year, month) {
      this.year = year;
      this.month = month;
    },

    // 맨위로
    moveTop() {
      const contents = document.querySelector('.contents');
      contents.scrollTo({top: 0, behavior:'smooth'});
    },
    // 위로 스크롤 시에만 탑버튼 노출
    showTopBtn() {
      const contents = document.querySelector('.contents');
      contents.addEventListener('scroll', () => {
        const currentScrollPosition = contents.pageYOffset || contents.scrollTop
        if (currentScrollPosition < 0) {
          return
        }

        if (Math.abs(currentScrollPosition - this.lastScrollPosition) < 60) {
          return
        }
        this.isScrollUp = currentScrollPosition > this.lastScrollPosition
        this.lastScrollPosition = currentScrollPosition
      })
    },

    // 최근학습 리스트
    async getStudyList() {
      const searchDate = moment(`${this.year}-${this.month}`, 'YYYY-MM').format('YYYY-MM');

      const data = {
        student_id : this.userInfo.info.studentId,
        search_date : searchDate,
        search_subj_nm : this.subId,
      }

      const res = await mystorageCode.getStudyList(data);
      if (res.status == 200) {
        // 서비스 종료된 강의 체크
        this.listData = res.data.data.items.filter((item) => {
          const stopResult = this.stopData.some(x => x === item.study_course_id);
          return !stopResult;
        })
        this.firstExpDt = res.data.data.firstExpDt ? res.data.data.firstExpDt : '';

        // 오늘의 학습 완료안했을때 막기
        if (res.data.data.progress == "incomplete") {
          this.studyInfoShowModal = true;
          document.querySelector('body').style.overflow = 'hidden';
        }
      }
    },
    // 보관함 리스트
    async getStoreList() {
      const data = {
        student_id : this.userInfo.info.studentId,
        search_subj_nm : this.subId,
      }

      const res = await mystorageCode.getStoreList(data);
      if (res.status == 200) {
        // 서비스 종료된 강의 체크
        this.listData = res.data.data.items.filter((item) => {
          const stopResult = this.stopData.some(x => x === item.study_course_id);
          return !stopResult;
        })
        this.firstExpDt = res.data.data.firstExpDt ? res.data.data.firstExpDt : '';
        // 오늘의 학습 완료안했을때 막기
        if (res.data.data.progress == "incomplete") {
          this.studyInfoShowModal = true;
          document.querySelector('body').style.overflow = 'hidden';
        }
      }
    },
    // 보관함에 담기
    async addToInventory(item) {
      const data = {
        student_id: this.userInfo.info.studentId,
        courseKey: item.study_course_id,
        lectureKey: item.study_lecture_id,
      }

      const res = await mystorageCode.addToInventory(data);
      if (res.status == 200) {
        if (this.storageId == 'study') {
          this.getStudyList();
        } else {
          this.getStoreList();
        }
      }
    },
    // 보관함에서 빼기
    async delToInventory(item) {
      const data = {
        student_id: this.userInfo.info.studentId,
        courseKey: item.study_course_id,
        lectureKey: item.study_lecture_id,
      }

      const res = await mystorageCode.delToInventory(data);
      if (res.status == 200) {
        if (this.storageId == 'study') {
          this.getStudyList();
        } else {
          this.getStoreList();
        }
      }
    },

    // 뷰어 띄우기
    openContents(item) {
      const token = localStorage.getItem("accessToken");
      const url = window.location.href;
      let baseUrl = '';

      if (url.indexOf("https://stw.superv.com/") > -1) {
        baseUrl = 'https://study.superv.com'
      } else {
        baseUrl = 'https://dev-study.superv.com'
      }

      location.href = `intent:#Intent;package=${item.packageName};i.lectureKey=${item.study_lecture_id};i.studentId=${this.userInfo.info.studentId};S.baseUrl=${baseUrl};S.launchMode=default;S.authToken=${token};i.courseKey=${item.study_course_id};S.paymentKey=${item.paymentKey};S.audioFileUrl=${item.audioFileUrl};end`;
    },

    // 알럿팝업 열기
    openStudyInfoPopup() {
      this.studyInfoShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    //  알럿팝업 닫기
    closeStudyInfoPopup() {
      this.studyInfoShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    replaceDefault(e) {
      e.target.src = require("@/assets/img/launcher/storage/cmm_thumb_01_default@2x.webp")
    },
  },
}
</script>

<style>
</style>