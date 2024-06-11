<template>
  <div class="superbox-wrap main">
    <header>
      <h1>
        <img src="@/assets/img/launcher/superbox/sup_main_top_tit.png" alt="1일 1권 슈퍼박스">
        <p>주제별 맞춤 도서가 매일 한 권씩 쏙!</p>
      </h1>
      <button type="button" class="btn-close" @click="closeSuperBox()">닫기 버튼</button>
      <button type="button" class="btn-superbox" @click="openInfoPopup">1일 1권 슈퍼박스란?</button>
      <div class="control">
        <nav>
          <!-- TODO: selectedStep과 클릭함수 매개변수의 값이 같아야 함 -->
          <button type="button" :class="{ active : selectedStep == null }" @click="changeStep(null)">전체</button>
          <button type="button" :class="{ active : selectedStep == '78' }" @click="changeStep('78')">SEL1</button>
          <button type="button" :class="{ active : selectedStep == '79' }" @click="changeStep('79')">SEL2</button>
          <button type="button" :class="{ active : selectedStep == '80' }" @click="changeStep('80')">SEL3</button>
          <button type="button" :class="{ active : selectedStep == '81' }" @click="changeStep('81')">SEL4</button>
          <button type="button" :class="{ active : selectedStep == '82' }" @click="changeStep('82')">SEL5</button>
          <button type="button" :class="{ active : selectedStep == '83' }" @click="changeStep('83')">SEL6</button>
        </nav>
        <v-select v-if="selectedStep == null"
                  label="cdVlNm"
                  placeholder="전체"
                  :options="objectItem"
                  v-model="selectedObject"
                  :reduce="objectItem => objectItem.cdVl">
          <template #open-indicator="{ attributes }">
            <span v-bind="attributes"><img src="@/assets/img/launcher/superbox/sup_drdown_ico_down.png" alt="arrow"></span>
          </template>
        </v-select>
        <v-select v-else
                  label="cdVlNm"
                  placeholder="전체"
                  :options="objectItemSel"
                  v-model="selectedObject"
                  :reduce="objectItemSel => objectItemSel.cdVl">
          <template #open-indicator="{ attributes }">
            <span v-bind="attributes"><img src="@/assets/img/launcher/superbox/sup_drdown_ico_down.png" alt="arrow"></span>
          </template>
        </v-select>
      </div>
    </header>
    <div class="list">
<!--      <p class="noti">매월 큐레이션이 업데이트 됩니다.</p>-->
      <ul style="margin-top: calc(1.0416vw + 22px)"> <!-- TODO: 위 텍스트 제거함으로써 윗공간 추가 -->
        <li v-for="item in listData" :key="item">
          <router-link :to="{ name: 'SuperboxSub', params: { id : item.study_course_id, selCd: item.step_cd } }">
            <span class="tag-new" v-if="Math.abs((new Date(item.reg_dtm).getTime() - new Date(setCurrentDate).getTime())/ (1000 * 60 * 60 * 24)) < 10">NEW</span> <!-- NEW 표시 -->
            <span class="tag-reading" v-if="item.plan_cnt > 0">구독중</span> <!-- 구독중 표시 -->
            <img :src="item.courseThum" alt="">
          </router-link>
        </li>
      </ul>
      <button type="button" class="btn-top" :class="{ show : isScrollUp }" @click="moveTop">맨위로</button>
    </div>
  </div>
  <infoModal :propsData="{infoShowModal}" @closePopup="closeInfoPopup"></infoModal>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import infoModal from './comp-superbox-popup/superbox-main-info-popup'
import superboxFactory from '@/api/superbox-factory';

const superboxCode = superboxFactory.get('superboxCode');

export default {
  data() {
    return {
      infoShowModal: false,
      selectedStep: null,
      selectedObject: 'study_course_nm ASC',

      isScrollUp: false,
      lastScrollPosition: 0,

      objectItem: [
        {
          cdVl: 'study_course_nm ASC',
          cdVlNm: '이름순',
        },
        {
          cdVl: 'step_cd DESC',
          cdVlNm: 'SEL 단계 높은 순',
        },
        {
          cdVl: 'step_cd ASC',
          cdVlNm: 'SEL 단계 낮은 순',
        },
      ],
      objectItemSel: [
        {
          cdVl: 'study_course_nm ASC',
          cdVlNm: '이름순',
        },
      ],

      listData: [],
    }
  },
  components: {
    infoModal,
  },
  watch: {
    'selectedObject'() {
      this.getList();
    },
    'selectedStep'() {
      this.selectedObject = 'study_course_nm ASC';
      this.getList();
    },
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapGetters('superBoxStorage', ['getListStep']),

    setCurrentDate() {
      const moment = require('moment');
      let today = moment().format('YYYY-MM-DD');

      return today;
    },
  },
  created() {
    this.selectedStep = this.getListStep;
    this.getList();
  },
  mounted() {
    this.showTopBtn();
  },
  methods: {
    ...mapMutations('superBoxStorage', ['storeListStep']),

    // 인포 팝업 열기
    openInfoPopup() {
      this.infoShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 인포 팝업 닫기
    closeInfoPopup() {
      this.infoShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },

    // 슈퍼박스 닫기
    closeSuperBox() {
      this.selectedStep = null;
      this.storeListStep(this.selectedStep);

      // eslint-disable-next-line
      goGrowvAppPage("main");
    },

    // 맨위로
    moveTop() {
      window.scrollTo({top: 0, behavior:'smooth'});
    },

    // 단계 변경
    changeStep(step) {
      this.selectedStep = step;
      this.getList();
      this.storeListStep(this.selectedStep);
    },

    getList() {
      const data = {
        student_id : this.userInfo.info.studentId,
        step_cd: this.selectedStep,
        orderKey: this.selectedObject,
      }

      const list = superboxCode.getMainList(data);
      list.then((res) => {
        if (res.status == 200) {
          const result = res.data.data;
          this.listData = result.mainList;

          this.hideKeyboard();
        }
      }).catch((error) => {
        console.log(error);
      });
    },

    hideKeyboard() {
      const input = document.querySelector('.vs__selected-options .vs__search');
      input.setAttribute('inputmode','none');
      input.setAttribute('readonly','readonly');
    },

    // 위로 스크롤 시에만 탑버튼 노출
    showTopBtn() {
      document.addEventListener('scroll', () => {
        const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop
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
  }
}
</script>

<style>
@import url('@/assets/css/launcher/superbox/superbox.css');
</style>