<template>
<!--  달력+모션북표시 영역 =>
  ㄴ 최근학습 과목 : 달력
  ㄴ 최근학습 책 : 달력+모션북표시
  ㄴ 보관함 과목 : X
  ㄴ 보관함 책 : 모션북표시  -->
  <div class="contents-info" v-if="!(subjectDivCd == 'subject' && getStorageDiv == 'store')">
    <div class="left-info" :class="{ hide : subjectDivCd != 'book' }"></div>
    <div class="month-box" v-if="getStorageDiv == 'study'">
      <button class="prev-month" :class="{ disable : dateDiff <= -12 || String(firstExpDt).substring(0,7) === `${this.year}-${String(this.month).padStart(2,'0')}` }" @click="onClickPrevMonth()"></button>
      {{ year }}년 {{ month }}월
      <button class="next-month" :class="{ disable : today == `${year}-${month}` }" @click="onClickNextMonth()"></button>
    </div>
  </div>
</template>

<script>
import moment from "moment/moment";
import {mapGetters, mapMutations} from "vuex";

export default {
  props: {
    firstExpDt: String,
  },
  data() {
    return {
      // 날짜
      today: '',
      year: 0,
      month: 0,
      dateDiff: '',

      // 과목 구분
      subjectDivCd: '',
    }
  },
  computed: {
    ...mapGetters('mystorageStorage', ['getSubjectDiv', 'getStorageDiv', 'getYear', 'getMonth']),
  },
  created() {
    this.getDiv();
    this.setCurrentDate();
    this.calcDiffDate();
  },
  methods: {
    ...mapMutations('mystorageStorage', ['storeChangeDate']),

    // 구분 가져오기
    getDiv() {
      if (this.getSubjectDiv == '영어' || this.getSubjectDiv == '수학' || this.getSubjectDiv == '한글' || this.getSubjectDiv == '특별학습') {
        this.subjectDivCd = 'subject';
      } else {
        this.subjectDivCd = 'book';
      }
    },

    // 현재 날짜로 세팅
    setCurrentDate() {
      const today = moment().format('YYYY-M');
      const currentYear = moment().format('YYYY');
      const currnetMonth = moment().format('M');

      this.today = today;

      if (!this.getYear || this.getYear === '' || this.getYear == undefined) {
        this.year = Number(currentYear);
      } else {
        this.year = this.getYear;
      }

      if (!this.getMonth || this.getMonth === '' || this.getMonth == undefined) {
        this.month = Number(currnetMonth);
      } else {
        this.month = this.getMonth;
      }
    },
    // 월 이전버튼 클릭
    onClickPrevMonth() {
      if (this.month <= 1) {
        this.month = 12;
        this.year -= 1;
      } else {
        this.month -= 1;
      }

      this.calcDiffDate();
    },
    // 월 다음버튼 클릭
    onClickNextMonth() {
      if (this.month >= 12) {
        this.month = 1;
        this.year += 1;
      } else {
        this.month += 1;
      }

      this.calcDiffDate();
    },

    // 월 차이 계산 및 저장
    calcDiffDate() {
      let diff = moment(`${this.year}-${this.month}`, 'YYYY-M').diff(moment(this.today, 'YYYY-M'), 'months');
      this.dateDiff = diff;

      let year = this.year;
      let month = this.month;

      this.storeChangeDate({year, month});

      this.$emit('changeDate', this.year, this.month); // 부모 컴포넌트로 년,월 전달
    },
  },
}
</script>

<style>
.hide {
  visibility: hidden;
}
</style>