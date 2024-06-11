<template>
  <div class="math-main">
    <div class="main-top">
      <h1 class="main-title">슈퍼V 숫자놀이</h1>
      <div class="top-btn-wrap">
        <button class="howto"><img src="@/assets/img/launcher/common/btn-question@3x.webp" alt="math-howto" @click="openInfoPopup()"></button>
        <button class="close"><img src="@/assets/img/launcher/common/btn-close@3x.webp" alt="math-close" @click="closePlayMath()"></button>
      </div>
    </div>
    <ul class="class-wrap">
      <li class="puzzle">
        <button @click="openPuzzlePopup()">
          숫자 퍼즐 모달띄우기
        </button>
      </li>
      <li class="quiz">
        <button @click="openQuizPopup()">
          숫자 퀴즈 모달띄우기
        </button>
      </li>
      <li class="match">
        <button @click="openMatchPopup()">
          숫자 맞추기 모달띄우기
        </button>
      </li>
      <li class="comparison">
        <button @click="openComparisonPopup()">
          수 비교 놀이 모달띄우기
        </button>
      </li>
      <li class="miro">
        <button @click="openMiroPopup()">
          숫자 미로 모달띄우기
        </button>
      </li>
      <li class="addition">
        <button @click="openAdditionPopup()">
        덧셈 놀이 모달띄우기
        </button>
      </li>
      <li class="subtraction">
        <button @click="openSubtractionPopup()">
          뺄셈 놀이 모달띄우기
        </button>
      </li>
    </ul>
  </div>
  <puzzleModal :propsData="{puzzleShowModal}" @closePopup="closePopup"></puzzleModal>
  <quizModal :propsData="{quizShowModal}" @closePopup="closePopup"></quizModal>
  <matchModal :propsData="{matchShowModal}" @closePopup="closePopup"></matchModal>
  <comparisonModal :propsData="{comparisonShowModal}" @closePopup="closePopup"></comparisonModal>
  <miroModal :propsData="{miroShowModal}" @closePopup="closePopup"></miroModal>
  <additionModal :propsData="{additionShowModal}" @closePopup="closePopup"></additionModal>
  <subtractionModal :propsData="{subtractionShowModal}" @closePopup="closePopup"></subtractionModal>
  <infoModal :propsData="{infoShowModal}" @closePopup="closePopup"></infoModal>
</template>

<script>
import puzzleModal from './comp-play-math-popup/play-math-puzzle-popup'
import quizModal from './comp-play-math-popup/play-math-quiz-popup'
import matchModal from './comp-play-math-popup/play-math-match-popup'
import comparisonModal from './comp-play-math-popup/play-math-comparison-popup'
import miroModal from './comp-play-math-popup/play-math-miro-popup'
import additionModal from './comp-play-math-popup/play-math-addition-popup'
import subtractionModal from './comp-play-math-popup/play-math-subtraction-popup'
import infoModal from './comp-play-math-popup/play-math-info-popup'

export default {
  data() {
    return {
      puzzleShowModal : false,
      quizShowModal : false,
      matchShowModal : false,
      comparisonShowModal : false,
      miroShowModal : false,
      additionShowModal : false,
      subtractionShowModal : false,
      infoShowModal: false
    }
  },
  components: {
    puzzleModal,
    quizModal,
    matchModal,
    comparisonModal,
    miroModal,
    additionModal,
    subtractionModal,
    infoModal,
  },
  created() {
    this.openInfoPopupByFirst();

    let showGbnModal = this.$route.query.showGbnModal;
    //alert(showGbnModal);

    if ( showGbnModal == "1") { // 숫자퍼즐
      this.openPuzzlePopup();
    } else if ( showGbnModal == "2") { // 숫자퀴즈
      this.openQuizPopup();
    } else if ( showGbnModal == "3") { // 숫자맞추기
      this.openMatchPopup();
    } else if ( showGbnModal == "4") { // 수 비교 놀이
      this.openComparisonPopup();
    } else if ( showGbnModal == "5") { // 숫자미로
      this.openMiroPopup();
    } else if ( showGbnModal == "6") { // 덧셈놀이
      this.openAdditionPopup();
    } else if ( showGbnModal == "7") { // 뺄셈놀이
      this.openSubtractionPopup();
    }

  },
  methods: {
    // 숫자놀이 페이지 기기 첫 진입시에만 안내팝업 띄우기
    openInfoPopupByFirst() {
      let firstHist = localStorage.getItem("firstHist");

      if (!firstHist) {
        this.infoShowModal = true;
        document.querySelector('body').style.overflow = 'hidden';
        localStorage.setItem("firstHist", "true");
      }
    },

    // 숫자 퍼즐 팝업 열기
    openPuzzlePopup() {
      this.puzzleShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 숫자 퀴즈 팝업 열기
    openQuizPopup() {
      this.quizShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 숫자 맞추기 팝업 열기
    openMatchPopup() {
      this.matchShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 수 비교 놀이 팝업 열기
    openComparisonPopup() {
      this.comparisonShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 숫자 미로 팝업 열기
    openMiroPopup() {
      this.miroShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 덧셈 놀이 팝업 열기
    openAdditionPopup() {
      this.additionShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 뺄셈 놀이 팝업 열기
    openSubtractionPopup() {
      this.subtractionShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 안내 팝업 열기
    openInfoPopup() {
      this.infoShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 팝업 닫기 공통
    closePopup() {
      this.puzzleShowModal = false;
      this.quizShowModal = false;
      this.matchShowModal = false;
      this.comparisonShowModal = false;
      this.miroShowModal = false;
      this.additionShowModal = false;
      this.subtractionShowModal = false;
      this.infoShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
    // 숫자놀이 페이지 종료(웹뷰 종료)
    closePlayMath() {
      // eslint-disable-next-line
      closeGrowvApp();
    },
  },
}
</script>

<style>
  @import "@/assets/css/launcher/play-math/play-math.css";
</style>