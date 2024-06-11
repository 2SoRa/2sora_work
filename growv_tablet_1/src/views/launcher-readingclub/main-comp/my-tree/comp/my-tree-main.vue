<template>
  <!-- 자람나무 메인 -->
  <!-- TODO : 년도 별로 클래스 부여 ex) theme-2023 -->
  <div class="my-tree" :class="['theme-' + moveYear]" v-if="treeData"> <!-- :style="{ backgroundImage : 'url(' + treeData.imgUrl +')'}" -->
    <div class="contents-bg-area" :style="{ backgroundImage : 'url(' + treeData.imgUrl +')'}"></div>
    <div class="sub-gnb">
      <div class="sub-gnb-left">
        <button type="button" class="btn-back" @click="$router.go(-1)"></button>
      </div>
      <h1>자람나무 숲지도</h1>
      <div class="sub-gnb-right">
        <button type="button" class="btn-close"><router-link :to="{ name : 'ReadingClubMainView' }"></router-link></button>
      </div>
    </div>
    <div class="btns-area">
      <div class="btn-calendar type-w-blue">
        <button type="button" class="btn-prev" @click="movePreviousYear" :disabled="moveYear === '2023'">이전 년도</button>
        <p class="txt-year">{{ moveDate }}</p>
        <button type="button" class="btn-next"  @click="moveNextYear" :disabled="!moveIsNextYear">다음 년도</button>
      </div>
      <div class="btn-wrap">
        <!--  TODO: 자람나무 안내 페이지로 연결 필요      -->
        <!--<button type="button" @click="openInfoPopup()"><img src="@/assets/img/launcher-readingclub/my-tree/btn_info.webp" alt="자람 나무 안내 버튼"></button>-->
        <button type="button"><router-link :to="{name: 'viewBridgeKind' ,query:{path:'guide-jaram'}}"><img src="@/assets/img/launcher-readingclub/my-tree/btn_info.webp" alt="자람 나무 안내 버튼"></router-link></button>
        <!-- TODO : 미션 바로가기 버튼 클릭 시 현재 진행 중인 미션 화면으로 진입 -->
        <button type="button">
          <router-link :to="{ path : '/my-tree/' + currentYear + '/' + currentMonth }">
            <img src="@/assets/img/launcher-readingclub/my-tree/btn_mission.webp" alt="미션 바로가기 버튼">
          </router-link>
        </button>
      </div>
    </div>
    <div class="contents content-scroll-area">
      <div class="sub-bg" :style="{ backgroundImage : 'url(' + treeData.imgUrl +')'}">
        <div class="jaram-list" v-if="treeData && treeData.list.length > 0">
          <!-- TODO : list-item 요소에 자람나무 월별 상태 클래스로 부여
              자람 나무 상태 별 클래스
              종료 : sta-end
              성공 : sta-success
              도전중 : sta-ing
              잠금 : sta-lock
          -->
          <!-- TODO : list-item 3개 단위로 list-item-group 클래스로 그룹핑해주기 -->
          <div class="list-item-group" v-for="obj in treeData.list" :key="obj">
            <div class="list-item" v-for="item in obj" :key="item" :class="{
                          'sta-end' : compareDate(item.growTreeYear, item.growTreeMonth) === 2 && !item.isSuccess,
            'sta-success' : item.isSuccess,
            'sta-ing' : item.isCurrent,
            'sta-lock' : compareDate(item.growTreeYear, item.growTreeMonth) === 0 }">
              <router-link :to="{ path : '/my-tree/' + moveYear + '/' + item.growTreeMonth }" v-if="compareDate(item.growTreeYear, item.growTreeMonth) !== 0" style="z-index:100;position:relative">
                <img v-if="item.missionTreeImgUrlList && !item.isCurrent && item.isSuccess" :src="item.missionTreeImgUrlList[2]">
                <img v-if="item.missionTreeImgUrlList && !item.isCurrent && !item.isSuccess" :src="item.missionTreeImgUrlList[1]">
                <img v-if="item.missionTreeImgUrlList && item.isCurrent" :src="item.missionTreeImgUrlList[1]">
              </router-link>
              <img v-else :src="item.missionTreeImgUrlList[0]">
              <div class="sta-ico-group">
                <span class="sta-ico end"></span>
                <span class="sta-ico success"></span>
                <span class="sta-ico ing">
                  <span class="ico"></span>
                  <span class="spr evie"></span>
                  </span>
                <span class="sta-ico lock"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </div>
  <infoModal ref="scriptDetail" :propsData="{ infoShowModal }" @closePopup="closePopup">
  </infoModal>
</template>

<script>
import moment from "moment";
import {mapGetters} from "vuex";
import dataMixin from "@/common/mixin/dataMixin";
import infoModal from './popup/my-tree-info-popup'
import readingClubFactory from "@/api/reading-club/readingClub-factory";

const myTreeApi = readingClubFactory.get('myTree')
export default {
  mixins: [ dataMixin ],
  data() {
    return {
      treeData : null,
      studentId : null,
      infoShowModal: false,
    }
  },
  components: {
    infoModal,
  },
  computed : {
    ...mapGetters(['userInfo']),
    moveNowDate : () => {
      const date = new Date();
      return moment(date).locale("ko").format("YYYY년");
    },
    currentYear : () => {
      return moment(new Date()).format("YYYY");
    },
    currentMonth : () => {
      return moment(new Date()).format("MM");
    }
  },
  watch : {
    moveDate() {
      this.getTreeYear();
      setTimeout(() => {
        this.focusTree();
      },300)
    }
  },
  created() {
    this.studentId = this.userInfo.info.studentId;
  },
  methods: {
    getTreeYear() {
      const treeYearData = myTreeApi.getTreeYear(this.studentId, this.moveYear);
      treeYearData.then((res) => {
        if (res.status === 200) {
          this.treeData = res.data.data;
          this.treeData.list = this.treeSlice(res.data.data.list)
        }
      })
    },
    treeSlice(arr) {
      const result = [];
      let index = 0;
      for (index=0; index < arr.length; index += 3) {
        let tempArray;
        // slice() 메서드를 사용하여 특정 길이만큼 배열을 분리함
        tempArray = arr.slice(index, index + 3);
        // 빈 배열에 특정 길이만큼 분리된 배열을 추가
        result.push(tempArray);
      }
      return result;
    },
    compareDate(year, month) {
      const current = this.currentYear + this.currentMonth;
      if (current === (year + month)) { return 1; }
      if (current < (year + month)) { return 0; } else { return 2;}
    },
    focusTree() {
      let tree = document.querySelectorAll('.jaram-list .list-item');
      let index = this.treeData?.list.map((el)=>el.isCurrent).indexOf(true);
      if(tree.length > 3 && index !== -1) {
        tree[index]?.scrollIntoView({behavior:'smooth'})
      }
    },
    // 안내팝업 열기
    openInfoPopup() {
      this.infoShowModal = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    // 팝업 닫기
    closePopup() {
      this.infoShowModal = false;
      document.querySelector('body').style.overflow = 'auto';
    },
  },
}
</script>