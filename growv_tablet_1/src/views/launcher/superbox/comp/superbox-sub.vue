<template>
  <div class="superbox-wrap sub">
    <header>
      <h1>
        <!-- sup_sb_icon_SEL1.png ~ sup_sb_icon_SEL6.png -->
        <em><img :src='require(`@/assets/img/launcher/superbox/sup_sb_icon_SEL${selectedSelCd}.png`)' :alt="`SEL${selectedSelCd}`">{{ curatorInfo.study_course_nm }}({{ curatorInfo.lecture_cnt }}권)</em>
        <p>{{ curatorInfo.study_course_desc }}</p>
      </h1>
      <button type="button" class="btn-home"><router-link :to="{ name: 'SuperboxMain' }">홈 버튼</router-link></button>
      <p v-if="curatorInfo.imageUrl" class="curator" :style="{background: 'url('+ curatorInfo.imageUrl+')'}" style="background-position: center 0;background-repeat: no-repeat;">{{ curatorInfo.curator_nickname }}</p>
      <button type="button" class="btn-subscribe" :class="{ ing : curatorInfo.plan_cnt > 0 }" @click="openApplyPopup">구독하기 버튼</button>
      <button type="button" class="btn-close" @click="closeSuperBox">닫기 버튼</button>
    </header>
    <div class="list">
      <p class="noti"><img src="@/assets/img/launcher/superbox/sup_sb_motion.png" alt="모션북"></p>
      <ul>
        <li v-for="item in listData" :key="item">
          <div>
            <span class="check-read" v-if="item.study_act_uid != null"></span> <!-- 읽음표시 -->
            <span class="motion" v-if="item.motion_thum != null && item.ebook_thum == null">모션북</span> <!-- 모션북표시 -->
            <img :src="item.imageUrl" alt="">
          </div>
          <label class="checkbox">
            <input type="checkbox" :value="item.study_lecture_id" v-model="selectedBooks" />
            <p>{{ item.lecture_session }}일차</p>
          </label>
        </li>
      </ul>
      <button type="button" class="btn-top" :class="{ show : isScrollUp }" @click="moveTop">맨위로</button>
    </div>
  </div>
  <applyModal ref="applyScript" :propsData="{applyShowModal, curatorInfo}" @closePopup="closeApplyPopup" @loadSubList="getList"></applyModal>
  <alertModal :propsData="{alertShowModal, message}" @closePopup="closeConfirmPopup"></alertModal>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import applyModal from './comp-superbox-popup/superbox-sub-apply-popup'
import alertModal from './comp-superbox-popup/alert-popup'
import superboxFactory from '@/api/superbox-factory';

const superboxCode = superboxFactory.get('superboxCode');

export default {
  props: ['id', 'selCd'],
  data() {
    return {
      applyShowModal: false,
      alertShowModal: false,
      selectedBooks: [],
      selectedSelCd: '', // 메인에서 넘어온 selCd를 체크해서 1~6까지 구분해서 적용하는 변수

      curatorInfo: {},
      listData: [],

      message: '',

      isScrollUp: false,
      lastScrollPosition: 0,
    }
  },
  components: {
    applyModal,
    alertModal,
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created() {
    this.getList();

    if (this.selCd == '78') {
      this.selectedSelCd = 1;
    } else if (this.selCd == '79') {
      this.selectedSelCd = 2;
    } else if (this.selCd == '80') {
      this.selectedSelCd = 3;
    } else if (this.selCd == '81') {
      this.selectedSelCd = 4;
    } else if (this.selCd == '82') {
      this.selectedSelCd = 5;
    } else if (this.selCd == '83') {
      this.selectedSelCd = 6;
    }
  },
  mounted() {
    this.showTopBtn();
  },
  methods: {
    ...mapMutations('superBoxStorage', ['storeListStep']),

    // 디폴트로 모든 책 선택
    setAllCheckList(){
      this.listData.forEach((item) => {
        const target = item.study_lecture_id;
        this.selectedBooks.push(target);
      });
    },

    // 구독 팝업 열기
    openApplyPopup() {
      if (this.selectedBooks.length < 2) {
        this.message = '도서를 2권 이상 선택해 주세요.';
        this.openConfirmPopup();
        return;
      }

      // 책 아이디 순서대로 정렬하기
      this.selectedBooks.sort(function(a, b) {
        return a - b;
      });

      this.applyShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
      this.$refs.applyScript.show(this.id, this.selectedBooks);
    },
    // 구독 팝업 닫기
    closeApplyPopup() {
      this.applyShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },

    // 슈퍼박스 닫기
    closeSuperBox() {
      this.storeListStep(null);

      // eslint-disable-next-line
      goGrowvAppPage("main");
    },

    // 알럿팝업 열기
    openConfirmPopup() {
      this.alertShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 알럿팝업 닫기
    closeConfirmPopup() {
      this.alertShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },

    // 맨위로
    moveTop() {
      window.scrollTo({top: 0, behavior:'smooth'});
    },

    getList() {
      const data = {
        student_id : this.userInfo.info.studentId,
        study_course_id : this.id,
      }

      const list = superboxCode.getSubList(data);
      list.then((res) => {
        if (res.status == 200) {
          const result = res.data.data;
          this.curatorInfo = result.courseInfo;
          this.listData = result.subList;

          this.setAllCheckList();
        }
      }).catch((error) => {
        console.log(error);
      });
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
</style>